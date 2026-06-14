/*
  INTEGRACIÓN: Google Ads API
  Docs: https://developers.google.com/google-ads/api/docs/start

  Variables de entorno requeridas:
    GOOGLE_ADS_DEVELOPER_TOKEN  → Token de desarrollador de Google Ads API
    GOOGLE_ADS_CLIENT_ID        → OAuth2 Client ID
    GOOGLE_ADS_CLIENT_SECRET    → OAuth2 Client Secret
    GOOGLE_ADS_REFRESH_TOKEN    → OAuth2 Refresh Token
    GOOGLE_ADS_CUSTOMER_ID      → ID del cliente (sin guiones, ej: "1234567890")
*/

export interface GoogleAdsMetrics {
  campaign_id?: string;
  campaign_name?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cost: number;
  roas?: number;
  quality_score?: number;
  [key: string]: unknown;
}

export interface GoogleAdsResponse {
  customer_id: string;
  date_range: string;
  level: string;
  rows: GoogleAdsMetrics[];
  totals: Partial<GoogleAdsMetrics>;
  status: "live" | "demo";
  currency: string;
}

const GOOGLE_ADS_API_VERSION = "v18";

export async function queryGoogleAds(params: Record<string, unknown>): Promise<GoogleAdsResponse> {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  if (!customerId || !developerToken) {
    return buildDemoGoogleAdsResponse(params);
  }

  try {
    const accessToken = await refreshGoogleAccessToken();
    const gaql = buildGAQL(params);

    const res = await fetch(
      `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}/googleAds:search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "developer-token": developerToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: gaql }),
      }
    );

    if (!res.ok) throw new Error(`Google Ads API error: ${res.status}`);

    const data = await res.json() as { results: Record<string, unknown>[] };
    return parseGoogleAdsResponse(data, customerId, params);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ...buildDemoGoogleAdsResponse(params), status: "demo" };
  }
}

function buildGAQL(params: Record<string, unknown>): string {
  const level = params.level as string;
  const dateRange = mapDateRange(params.date_range as string);

  const selectMap: Record<string, string[]> = {
    account: ["metrics.impressions", "metrics.clicks", "metrics.conversions", "metrics.cost_micros", "metrics.all_conversions_value"],
    campaign: ["campaign.id", "campaign.name", "metrics.impressions", "metrics.clicks", "metrics.conversions", "metrics.cost_micros", "metrics.all_conversions_value"],
    ad_group: ["campaign.name", "ad_group.id", "ad_group.name", "metrics.impressions", "metrics.clicks", "metrics.conversions", "metrics.cost_micros"],
    keyword: ["ad_group_criterion.keyword.text", "metrics.impressions", "metrics.clicks", "metrics.conversions", "metrics.cost_micros", "ad_group_criterion.quality_info.quality_score"],
  };

  const resourceMap: Record<string, string> = {
    account: "customer",
    campaign: "campaign",
    ad_group: "ad_group",
    keyword: "ad_group_criterion",
  };

  const fields = selectMap[level] ?? selectMap.campaign;
  const resource = resourceMap[level] ?? "campaign";

  return `SELECT ${fields.join(", ")} FROM ${resource} WHERE segments.date DURING ${dateRange} AND campaign.status = 'ENABLED'`;
}

function mapDateRange(range: string): string {
  const map: Record<string, string> = {
    today: "TODAY",
    yesterday: "YESTERDAY",
    last_7_days: "LAST_7_DAYS",
    last_30_days: "LAST_30_DAYS",
    last_90_days: "LAST_90_DAYS",
  };
  return map[range] ?? "LAST_30_DAYS";
}

function parseGoogleAdsResponse(
  data: { results: Record<string, unknown>[] },
  customerId: string,
  params: Record<string, unknown>
): GoogleAdsResponse {
  const rows: GoogleAdsMetrics[] = (data.results ?? []).map((r) => {
    const metrics = r.metrics as Record<string, number> | undefined;
    const campaign = r.campaign as Record<string, string> | undefined;
    const costMicros = metrics?.cost_micros ?? 0;
    const cost = costMicros / 1_000_000;
    const conversions = metrics?.conversions ?? 0;
    const convValue = metrics?.all_conversions_value ?? 0;

    return {
      campaign_id: campaign?.id,
      campaign_name: campaign?.name,
      impressions: metrics?.impressions ?? 0,
      clicks: metrics?.clicks ?? 0,
      ctr: metrics?.clicks && metrics?.impressions ? (metrics.clicks / metrics.impressions) * 100 : 0,
      cpc: metrics?.clicks ? cost / metrics.clicks : 0,
      conversions,
      cost,
      roas: cost > 0 ? convValue / cost : 0,
    };
  });

  const totals = rows.reduce<Partial<GoogleAdsMetrics>>((acc, row) => ({
    impressions: ((acc.impressions ?? 0) + row.impressions),
    clicks: ((acc.clicks ?? 0) + row.clicks),
    conversions: ((acc.conversions ?? 0) + row.conversions),
    cost: ((acc.cost ?? 0) + row.cost),
  }), {});

  return {
    customer_id: customerId,
    date_range: params.date_range as string,
    level: params.level as string,
    rows,
    totals,
    status: "live",
    currency: "PEN",
  };
}

function buildDemoGoogleAdsResponse(params: Record<string, unknown>): GoogleAdsResponse {
  return {
    customer_id: "DEMO",
    date_range: params.date_range as string,
    level: params.level as string,
    rows: [
      { campaign_id: "1", campaign_name: "Brand - Búsqueda", impressions: 8420, clicks: 540, ctr: 6.41, cpc: 1.85, conversions: 28, cost: 998, roas: 4.2, quality_score: 9 },
      { campaign_id: "2", campaign_name: "Competencia - Búsqueda", impressions: 12800, clicks: 384, ctr: 3.0, cpc: 2.4, conversions: 12, cost: 922, roas: 2.1, quality_score: 7 },
      { campaign_id: "3", campaign_name: "Display - Retargeting", impressions: 95000, clicks: 285, ctr: 0.3, cpc: 0.95, conversions: 8, cost: 271, roas: 5.8 },
    ],
    totals: { impressions: 116220, clicks: 1209, conversions: 48, cost: 2191, ctr: 1.04, cpc: 1.81 },
    status: "demo",
    currency: "PEN",
  };
}

async function refreshGoogleAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json() as { access_token: string };
  return data.access_token;
}
