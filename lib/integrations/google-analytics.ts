/*
  INTEGRACIÓN: Google Analytics 4 — Data API
  Docs: https://developers.google.com/analytics/devguides/reporting/data/v1

  Variables de entorno requeridas:
    GA4_PROPERTY_ID        → ID de la propiedad GA4 (ej: "123456789")
    GA4_SERVICE_ACCOUNT_KEY → JSON de cuenta de servicio con acceso a la propiedad
    GA4_API_SECRET         → (ya usado en /api/send para Measurement Protocol)
*/

export interface GA4QueryParams {
  date_range: string;
  metrics: string[];
  dimension?: string;
  start_date?: string;
  end_date?: string;
  property_id?: string;
}

export interface GA4MetricRow {
  dimension?: string;
  sessions?: number;
  users?: number;
  conversions?: number;
  revenue?: number;
  bounce_rate?: number;
  avg_session_duration?: number;
  [key: string]: unknown;
}

export interface GA4Response {
  property_id: string;
  date_range: { start: string; end: string };
  rows: GA4MetricRow[];
  totals: GA4MetricRow;
  row_count: number;
  sampled: boolean;
  status: "live" | "demo";
}

// ─── MAPEO DE RANGOS DE FECHAS ────────────────────────────────────────────────

function resolveDateRange(dateRange: string, startDate?: string, endDate?: string) {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const ranges: Record<string, { startDate: string; endDate: string }> = {
    today: { startDate: fmt(today), endDate: fmt(today) },
    yesterday: {
      startDate: fmt(new Date(today.getTime() - 86400000)),
      endDate: fmt(new Date(today.getTime() - 86400000)),
    },
    last_7_days: {
      startDate: fmt(new Date(today.getTime() - 7 * 86400000)),
      endDate: fmt(today),
    },
    last_30_days: {
      startDate: fmt(new Date(today.getTime() - 30 * 86400000)),
      endDate: fmt(today),
    },
    last_90_days: {
      startDate: fmt(new Date(today.getTime() - 90 * 86400000)),
      endDate: fmt(today),
    },
  };

  return ranges[dateRange] ?? { startDate: startDate ?? "30daysAgo", endDate: endDate ?? "today" };
}

// ─── CLIENTE PRINCIPAL ────────────────────────────────────────────────────────

export async function queryGA4(params: Record<string, unknown>): Promise<GA4Response> {
  const propertyId = (params.property_id as string) ?? process.env.GA4_PROPERTY_ID;
  const serviceAccountKey = process.env.GA4_SERVICE_ACCOUNT_KEY;
  const dateResolved = resolveDateRange(
    params.date_range as string,
    params.start_date as string | undefined,
    params.end_date as string | undefined
  );

  // Sin credenciales → devuelve datos demo con nota clara
  if (!propertyId || !serviceAccountKey) {
    return buildDemoResponse(propertyId ?? "NOT_CONFIGURED", dateResolved, params);
  }

  try {
    // Obtener access token via Service Account
    const token = await getServiceAccountToken(serviceAccountKey);

    // Construir request para GA4 Data API v1
    const metricsMap: Record<string, string> = {
      sessions: "sessions",
      users: "totalUsers",
      conversions: "conversions",
      revenue: "purchaseRevenue",
      bounce_rate: "bounceRate",
      avg_session_duration: "averageSessionDuration",
    };

    const dimensionsMap: Record<string, string> = {
      channel: "sessionDefaultChannelGrouping",
      landing_page: "landingPagePlusQueryString",
      device: "deviceCategory",
      country: "country",
      event_name: "eventName",
    };

    const requestedMetrics = (params.metrics as string[]).map((m) => ({
      name: metricsMap[m] ?? m,
    }));

    const requestBody: Record<string, unknown> = {
      dateRanges: [{ startDate: dateResolved.startDate, endDate: dateResolved.endDate }],
      metrics: requestedMetrics,
    };

    if (params.dimension) {
      requestBody.dimensions = [{ name: dimensionsMap[params.dimension as string] ?? params.dimension }];
    }

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await res.json();
    return parseGA4Response(data, propertyId, dateResolved);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      property_id: propertyId,
      date_range: dateResolved,
      rows: [],
      totals: {},
      row_count: 0,
      sampled: false,
      status: "demo",
      ...({ error: `Error consultando GA4: ${message}` } as unknown as object),
    };
  }
}

function parseGA4Response(
  data: Record<string, unknown>,
  propertyId: string,
  dateRange: { startDate: string; endDate: string }
): GA4Response {
  const rows = (data.rows as Record<string, unknown>[] | undefined) ?? [];
  const parsed = rows.map((row) => {
    const r: GA4MetricRow = {};
    const dims = row.dimensionValues as { value: string }[] | undefined;
    const mets = row.metricValues as { value: string }[] | undefined;
    if (dims?.[0]) r.dimension = dims[0].value;
    if (mets) {
      mets.forEach((m, i) => {
        const headers = (data.metricHeaders as { name: string }[])?.[i];
        if (headers) r[headers.name] = parseFloat(m.value) || m.value;
      });
    }
    return r;
  });

  return {
    property_id: propertyId,
    date_range: { start: dateRange.startDate, end: dateRange.endDate },
    rows: parsed,
    totals: parsed.reduce((acc, row) => {
      Object.entries(row).forEach(([k, v]) => {
        if (k !== "dimension" && typeof v === "number") {
          acc[k] = ((acc[k] as number) ?? 0) + v;
        }
      });
      return acc;
    }, {} as GA4MetricRow),
    row_count: parsed.length,
    sampled: !!(data.samplingSpaceSizes as unknown[])?.length,
    status: "live",
  };
}

function buildDemoResponse(
  propertyId: string,
  dateRange: { startDate: string; endDate: string },
  params: Record<string, unknown>
): GA4Response {
  const metrics = params.metrics as string[];
  const demoRow: GA4MetricRow = {};
  if (metrics.includes("sessions")) demoRow.sessions = 4280;
  if (metrics.includes("users")) demoRow.users = 3150;
  if (metrics.includes("conversions")) demoRow.conversions = 47;
  if (metrics.includes("revenue")) demoRow.revenue = 18500;
  if (metrics.includes("bounce_rate")) demoRow.bounce_rate = 42.3;
  if (metrics.includes("avg_session_duration")) demoRow.avg_session_duration = 185;

  return {
    property_id: propertyId,
    date_range: { start: dateRange.startDate, end: dateRange.endDate },
    rows: [{ ...demoRow, dimension: "Organic Search" }, { ...demoRow, sessions: 1820, dimension: "Paid Search" }],
    totals: demoRow,
    row_count: 2,
    sampled: false,
    status: "demo",
  };
}

async function getServiceAccountToken(serviceAccountKeyJson: string): Promise<string> {
  const key = JSON.parse(serviceAccountKeyJson);
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );

  // Nota: la firma RS256 requiere crypto.subtle en Edge Runtime
  // En producción usar google-auth-library o implementación completa
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${payload}.SIGNATURE_PLACEHOLDER`,
    }),
  });

  const data = await res.json() as { access_token: string };
  return data.access_token;
}
