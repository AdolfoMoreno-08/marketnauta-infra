/*
  INTEGRACIÓN: TikTok Ads — TikTok Marketing API
  Docs: https://ads.tiktok.com/marketing_api/docs

  Variables de entorno requeridas:
    TIKTOK_ACCESS_TOKEN   → Long-term Access Token de la plataforma
    TIKTOK_ADVERTISER_ID  → ID del anunciante (ej: "7123456789012345678")
*/

export interface TikTokAdsMetrics {
  campaign_id?: string;
  campaign_name?: string;
  adgroup_id?: string;
  adgroup_name?: string;
  ad_id?: string;
  ad_name?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversions: number;
  cost: number;
  roas?: number;
  video_views?: number;
  video_completion_rate?: number;
  breakdown?: string;
  [key: string]: unknown;
}

export interface TikTokAdsResponse {
  advertiser_id: string;
  date_range: string;
  level: string;
  rows: TikTokAdsMetrics[];
  totals: Partial<TikTokAdsMetrics>;
  status: "live" | "demo";
  currency: string;
}

const TIKTOK_API_BASE = "https://business-api.tiktok.com/open_api/v1.3";

export async function queryTikTokAds(params: Record<string, unknown>): Promise<TikTokAdsResponse> {
  const advertiserId = process.env.TIKTOK_ADVERTISER_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!advertiserId || !accessToken) {
    return buildDemoTikTokResponse(params);
  }

  try {
    const { startDate, endDate } = resolveTikTokDateRange(params.date_range as string);
    const level = params.level as string;

    const endpointMap: Record<string, string> = {
      account: "report/integrated/get",
      campaign: "report/integrated/get",
      adgroup: "report/integrated/get",
      ad: "report/integrated/get",
    };

    const dataLevelMap: Record<string, string> = {
      account: "AUCTION_ADVERTISER",
      campaign: "AUCTION_CAMPAIGN",
      adgroup: "AUCTION_ADGROUP",
      ad: "AUCTION_AD",
    };

    const metricsMap: Record<string, string> = {
      impressions: "impression",
      clicks: "click",
      ctr: "ctr",
      cpm: "cpm",
      cpc: "cpc",
      conversions: "conversion",
      cost: "spend",
      roas: "value_per_total_complete_payment",
      video_views: "video_play_actions",
      video_completion_rate: "video_watched_2s",
    };

    const selectedMetrics = (params.metrics as string[]).map((m) => metricsMap[m] ?? m);

    const requestBody = {
      advertiser_id: advertiserId,
      report_type: "AUDIENCE",
      data_level: dataLevelMap[level] ?? "AUCTION_CAMPAIGN",
      dimensions: ["campaign_id", ...(params.breakdown && params.breakdown !== "none" ? [params.breakdown as string] : [])],
      metrics: ["campaign_name", ...selectedMetrics],
      start_date: startDate,
      end_date: endDate,
      page_size: 50,
    };

    const res = await fetch(`${TIKTOK_API_BASE}/${endpointMap[level]}`, {
      method: "GET",
      headers: {
        "Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`TikTok API error: ${res.status}`);
    const data = await res.json() as { data: { list: Record<string, unknown>[] } };
    return parseTikTokResponse(data.data.list ?? [], advertiserId, params);
  } catch {
    return buildDemoTikTokResponse(params);
  }
}

function resolveTikTokDateRange(range: string): { startDate: string; endDate: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000);

  const map: Record<string, { startDate: string; endDate: string }> = {
    today: { startDate: fmt(today), endDate: fmt(today) },
    yesterday: { startDate: fmt(daysAgo(1)), endDate: fmt(daysAgo(1)) },
    last_7_days: { startDate: fmt(daysAgo(7)), endDate: fmt(today) },
    last_30_days: { startDate: fmt(daysAgo(30)), endDate: fmt(today) },
    last_90_days: { startDate: fmt(daysAgo(90)), endDate: fmt(today) },
  };

  return map[range] ?? map.last_30_days;
}

function parseTikTokResponse(
  list: Record<string, unknown>[],
  advertiserId: string,
  params: Record<string, unknown>
): TikTokAdsResponse {
  const rows: TikTokAdsMetrics[] = list.map((item) => {
    const dims = item.dimensions as Record<string, string> | undefined;
    const mets = item.metrics as Record<string, string> | undefined;
    return {
      campaign_id: dims?.campaign_id,
      campaign_name: mets?.campaign_name,
      impressions: parseInt(mets?.impression ?? "0", 10),
      clicks: parseInt(mets?.click ?? "0", 10),
      ctr: parseFloat(mets?.ctr ?? "0"),
      cpm: parseFloat(mets?.cpm ?? "0"),
      cpc: parseFloat(mets?.cpc ?? "0"),
      conversions: parseInt(mets?.conversion ?? "0", 10),
      cost: parseFloat(mets?.spend ?? "0"),
      video_views: parseInt(mets?.video_play_actions ?? "0", 10),
    };
  });

  const totals = rows.reduce<Partial<TikTokAdsMetrics>>((acc, r) => ({
    impressions: (acc.impressions ?? 0) + r.impressions,
    clicks: (acc.clicks ?? 0) + r.clicks,
    conversions: (acc.conversions ?? 0) + r.conversions,
    cost: (acc.cost ?? 0) + r.cost,
  }), {});

  return { advertiser_id: advertiserId, date_range: params.date_range as string, level: params.level as string, rows, totals, status: "live", currency: "USD" };
}

function buildDemoTikTokResponse(params: Record<string, unknown>): TikTokAdsResponse {
  return {
    advertiser_id: "DEMO",
    date_range: params.date_range as string,
    level: params.level as string,
    rows: [
      { campaign_id: "t1", campaign_name: "TopFunnel - Awareness - 18-34", impressions: 320000, clicks: 4800, ctr: 1.5, cpm: 5.8, cpc: 0.39, conversions: 42, cost: 1856, roas: 3.2, video_views: 210000, video_completion_rate: 28.4 },
      { campaign_id: "t2", campaign_name: "Conversión - Retargeting - Viewers", impressions: 85000, clicks: 2380, ctr: 2.8, cpm: 9.2, cpc: 0.33, conversions: 31, cost: 782, roas: 5.7, video_views: 58000, video_completion_rate: 42.1 },
    ],
    totals: { impressions: 405000, clicks: 7180, conversions: 73, cost: 2638, video_views: 268000 },
    status: "demo",
    currency: "USD",
  };
}
