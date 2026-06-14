/*
  INTEGRACIÓN: Meta Ads (Facebook + Instagram) — Marketing API
  Docs: https://developers.facebook.com/docs/marketing-api

  Variables de entorno requeridas:
    META_ACCESS_TOKEN  → Long-lived User Token o System User Token (ya en .env)
    META_AD_ACCOUNT_ID → ID de la cuenta publicitaria (ej: "act_123456789")
    META_PIXEL_ID      → Pixel ID (ya en .env)
*/

export interface MetaAdsMetrics {
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  reach?: number;
  impressions: number;
  cpm: number;
  ctr: number;
  cpc: number;
  clicks: number;
  spend: number;
  conversions?: number;
  roas?: number;
  frequency?: number;
  breakdown?: string;
  [key: string]: unknown;
}

export interface MetaAdsResponse {
  account_id: string;
  date_range: string;
  level: string;
  rows: MetaAdsMetrics[];
  totals: Partial<MetaAdsMetrics>;
  status: "live" | "demo";
  currency: string;
  api_version: string;
}

const META_API_VERSION = "v22.0";

export async function queryMetaAds(params: Record<string, unknown>): Promise<MetaAdsResponse> {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!adAccountId || !accessToken) {
    return buildDemoMetaAdsResponse(params);
  }

  try {
    const level = params.level as string;
    const datePreset = mapMetaDateRange(params.date_range as string);
    const breakdown = params.breakdown as string | undefined;

    const fields = buildMetaFields(params.metrics as string[], breakdown);
    const endpoint = buildMetaEndpoint(adAccountId, level, params.campaign_id as string | undefined);

    const searchParams = new URLSearchParams({
      access_token: accessToken,
      date_preset: datePreset,
      level,
      fields,
      limit: "50",
    });

    if (breakdown && breakdown !== "none") {
      searchParams.set("breakdowns", breakdown);
    }

    const res = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${endpoint}/insights?${searchParams}`);

    if (!res.ok) throw new Error(`Meta API error: ${res.status}`);

    const data = await res.json() as { data: Record<string, unknown>[] };
    return parseMetaAdsResponse(data, adAccountId, params);
  } catch (err: unknown) {
    return buildDemoMetaAdsResponse(params);
  }
}

function buildMetaFields(metrics: string[], breakdown?: string): string {
  const fieldMap: Record<string, string> = {
    reach: "reach",
    impressions: "impressions",
    cpm: "cpm",
    ctr: "ctr",
    cpc: "cpc",
    clicks: "clicks",
    spend: "spend",
    conversions: "actions",
    roas: "purchase_roas",
    frequency: "frequency",
  };

  const baseFields = ["campaign_id", "campaign_name", "adset_id", "adset_name"];
  const metricFields = metrics.map((m) => fieldMap[m] ?? m);
  return [...baseFields, ...metricFields].join(",");
}

function buildMetaEndpoint(accountId: string, level: string, campaignId?: string): string {
  if (campaignId && level === "adset") return `${campaignId}/adsets`;
  if (campaignId && level === "ad") return `${campaignId}/ads`;
  return accountId;
}

function mapMetaDateRange(range: string): string {
  const map: Record<string, string> = {
    today: "today",
    yesterday: "yesterday",
    last_7_days: "last_7_days",
    last_30_days: "last_30_days",
    last_90_days: "last_90_days",
  };
  return map[range] ?? "last_30_days";
}

function parseMetaAdsResponse(
  data: { data: Record<string, unknown>[] },
  accountId: string,
  params: Record<string, unknown>
): MetaAdsResponse {
  const rows: MetaAdsMetrics[] = (data.data ?? []).map((r) => {
    const actions = r.actions as { action_type: string; value: string }[] | undefined;
    const purchaseRoas = r.purchase_roas as { action_type: string; value: string }[] | undefined;
    const purchases = actions?.find((a) => a.action_type === "purchase");
    const roas = purchaseRoas?.[0];

    return {
      campaign_id: r.campaign_id as string,
      campaign_name: r.campaign_name as string,
      impressions: parseInt(r.impressions as string, 10) || 0,
      reach: parseInt(r.reach as string, 10) || 0,
      cpm: parseFloat(r.cpm as string) || 0,
      ctr: parseFloat(r.ctr as string) || 0,
      cpc: parseFloat(r.cpc as string) || 0,
      clicks: parseInt(r.clicks as string, 10) || 0,
      spend: parseFloat(r.spend as string) || 0,
      conversions: purchases ? parseInt(purchases.value, 10) : 0,
      roas: roas ? parseFloat(roas.value) : 0,
      frequency: parseFloat(r.frequency as string) || 0,
    };
  });

  const totals = rows.reduce<Partial<MetaAdsMetrics>>((acc, row) => ({
    impressions: (acc.impressions ?? 0) + row.impressions,
    clicks: (acc.clicks ?? 0) + row.clicks,
    spend: (acc.spend ?? 0) + row.spend,
    conversions: (acc.conversions ?? 0) + (row.conversions ?? 0),
    reach: (acc.reach ?? 0) + (row.reach ?? 0),
  }), {});

  return {
    account_id: accountId,
    date_range: params.date_range as string,
    level: params.level as string,
    rows,
    totals,
    status: "live",
    currency: "USD",
    api_version: META_API_VERSION,
  };
}

function buildDemoMetaAdsResponse(params: Record<string, unknown>): MetaAdsResponse {
  return {
    account_id: "DEMO",
    date_range: params.date_range as string,
    level: params.level as string,
    rows: [
      { campaign_id: "c1", campaign_name: "Prospecting - TOF - Intereses", impressions: 180000, reach: 92000, cpm: 12.5, ctr: 1.8, cpc: 0.69, clicks: 3240, spend: 2250, conversions: 38, roas: 4.8, frequency: 1.96 },
      { campaign_id: "c2", campaign_name: "Retargeting - MOF - Video Viewers", impressions: 45000, reach: 18200, cpm: 8.2, ctr: 3.4, cpc: 0.24, clicks: 1530, spend: 369, conversions: 22, roas: 8.1, frequency: 2.47 },
      { campaign_id: "c3", campaign_name: "Retargeting - BOF - Website Visitors", impressions: 28000, reach: 9400, cpm: 15.3, ctr: 4.1, cpc: 0.37, clicks: 1148, spend: 428, conversions: 31, roas: 11.2, frequency: 2.98 },
    ],
    totals: { impressions: 253000, clicks: 5918, spend: 3047, conversions: 91, reach: 119600 },
    status: "demo",
    currency: "USD",
    api_version: META_API_VERSION,
  };
}
