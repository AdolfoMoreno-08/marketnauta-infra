/*
  INTEGRACIÓN: LinkedIn Ads — LinkedIn Marketing API
  Docs: https://learn.microsoft.com/en-us/linkedin/marketing/

  Variables de entorno requeridas:
    LINKEDIN_ACCESS_TOKEN  → OAuth2 Access Token con permisos r_ads y r_ads_reporting
    LINKEDIN_AD_ACCOUNT_ID → URN de la cuenta (ej: "urn:li:sponsoredAccount:123456")
*/

export interface LinkedInAdsMetrics {
  campaign_id?: string;
  campaign_name?: string;
  creative_id?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  leads?: number;
  cost_per_lead?: number;
  spend: number;
  breakdown?: string;
  [key: string]: unknown;
}

export interface LinkedInAdsResponse {
  account_id: string;
  date_range: string;
  level: string;
  rows: LinkedInAdsMetrics[];
  totals: Partial<LinkedInAdsMetrics>;
  status: "live" | "demo";
  currency: string;
  note?: string;
}

const LI_API_VERSION = "202501";
const LI_API_BASE = "https://api.linkedin.com/rest";

export async function queryLinkedInAds(params: Record<string, unknown>): Promise<LinkedInAdsResponse> {
  const accountId = process.env.LINKEDIN_AD_ACCOUNT_ID;
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  if (!accountId || !accessToken) {
    return buildDemoLinkedInResponse(params);
  }

  try {
    const { startDate, endDate } = resolveLinkedInDateRange(params.date_range as string);
    const level = params.level as string;

    const pivotMap: Record<string, string> = {
      account: "ACCOUNT",
      campaign: "CAMPAIGN",
      creative: "CREATIVE",
    };

    const breakdown = params.breakdown as string | undefined;
    const facets = buildLinkedInFacets(breakdown);

    const fields = [
      "dateRange",
      "impressions",
      "clicks",
      "costInLocalCurrency",
      "leadGenerationMailContactInfoShares",
      "oneClickLeads",
      "totalEngagements",
      "videoViews",
    ].join(",");

    const url = new URL(`${LI_API_BASE}/adAnalytics`);
    url.searchParams.set("q", "analytics");
    url.searchParams.set("pivot", pivotMap[level] ?? "CAMPAIGN");
    url.searchParams.set("dateRange.start.year", startDate.year.toString());
    url.searchParams.set("dateRange.start.month", startDate.month.toString());
    url.searchParams.set("dateRange.start.day", startDate.day.toString());
    url.searchParams.set("dateRange.end.year", endDate.year.toString());
    url.searchParams.set("dateRange.end.month", endDate.month.toString());
    url.searchParams.set("dateRange.end.day", endDate.day.toString());
    url.searchParams.set("accounts[0]", accountId);
    url.searchParams.set("fields", fields);
    if (facets) url.searchParams.set("pivotValues[0]", facets);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": LI_API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    if (!res.ok) throw new Error(`LinkedIn API error: ${res.status}`);
    const data = await res.json() as { elements: Record<string, unknown>[] };
    return parseLinkedInResponse(data.elements ?? [], accountId, params);
  } catch {
    return buildDemoLinkedInResponse(params);
  }
}

function resolveLinkedInDateRange(range: string) {
  const today = new Date();
  const get = (d: Date) => ({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() });
  const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000);

  const map: Record<string, { startDate: ReturnType<typeof get>; endDate: ReturnType<typeof get> }> = {
    today: { startDate: get(today), endDate: get(today) },
    yesterday: { startDate: get(daysAgo(1)), endDate: get(daysAgo(1)) },
    last_7_days: { startDate: get(daysAgo(7)), endDate: get(today) },
    last_30_days: { startDate: get(daysAgo(30)), endDate: get(today) },
    last_90_days: { startDate: get(daysAgo(90)), endDate: get(today) },
  };

  return map[range] ?? map.last_30_days;
}

function buildLinkedInFacets(breakdown?: string): string | null {
  if (!breakdown || breakdown === "none") return null;
  const facetMap: Record<string, string> = {
    job_title: "urn:li:adTargetingFacet:titles",
    industry: "urn:li:adTargetingFacet:industries",
    company_size: "urn:li:adTargetingFacet:companySizes",
    seniority: "urn:li:adTargetingFacet:seniorities",
  };
  return facetMap[breakdown] ?? null;
}

function parseLinkedInResponse(
  elements: Record<string, unknown>[],
  accountId: string,
  params: Record<string, unknown>
): LinkedInAdsResponse {
  const rows: LinkedInAdsMetrics[] = elements.map((e) => {
    const spend = parseFloat(e.costInLocalCurrency as string) || 0;
    const clicks = parseInt(e.clicks as string, 10) || 0;
    const impressions = parseInt(e.impressions as string, 10) || 0;
    const leads = (parseInt(e.oneClickLeads as string, 10) || 0) + (parseInt(e.leadGenerationMailContactInfoShares as string, 10) || 0);

    return {
      impressions,
      clicks,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      conversions: leads,
      leads,
      cost_per_lead: leads > 0 ? spend / leads : 0,
      spend,
    };
  });

  const totals = rows.reduce<Partial<LinkedInAdsMetrics>>((acc, r) => ({
    impressions: (acc.impressions ?? 0) + r.impressions,
    clicks: (acc.clicks ?? 0) + r.clicks,
    leads: (acc.leads ?? 0) + (r.leads ?? 0),
    spend: (acc.spend ?? 0) + r.spend,
  }), {});

  return { account_id: accountId, date_range: params.date_range as string, level: params.level as string, rows, totals, status: "live", currency: "USD" };
}

function buildDemoLinkedInResponse(params: Record<string, unknown>): LinkedInAdsResponse {
  return {
    account_id: "DEMO",
    date_range: params.date_range as string,
    level: params.level as string,
    rows: [
      { campaign_id: "li1", campaign_name: "Decision Makers - SaaS B2B - Directores", impressions: 42000, clicks: 588, ctr: 1.4, cpc: 8.5, conversions: 12, leads: 12, cost_per_lead: 416, spend: 4998 },
      { campaign_id: "li2", campaign_name: "Retargeting - Website Visitors - C-Level", impressions: 18500, clicks: 370, ctr: 2.0, cpc: 6.2, conversions: 9, leads: 9, cost_per_lead: 255, spend: 2295 },
    ],
    totals: { impressions: 60500, clicks: 958, leads: 21, spend: 7293 },
    status: "demo",
    currency: "USD",
    note: "LinkedIn Ads típicamente muestra mayor CPC pero menor CPL en segmentos B2B de alto valor.",
  };
}
