import type Anthropic from "@anthropic-ai/sdk";
import { queryGA4 } from "@/lib/integrations/google-analytics";
import { queryGoogleAds } from "@/lib/integrations/google-ads";
import { queryMetaAds } from "@/lib/integrations/meta-ads";
import { queryTikTokAds } from "@/lib/integrations/tiktok-ads";
import { queryLinkedInAds } from "@/lib/integrations/linkedin-ads";

export const DATA_ANALYST_TOOLS: Anthropic.Tool[] = [
  {
    name: "query_google_analytics",
    description:
      "Consulta métricas de Google Analytics 4: usuarios, sesiones, conversiones, revenue, tráfico por canal, páginas de destino, eventos personalizados.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "last_90_days", "custom"],
          description: "Período de consulta",
        },
        start_date: { type: "string", description: "YYYY-MM-DD (si date_range es custom)" },
        end_date: { type: "string", description: "YYYY-MM-DD (si date_range es custom)" },
        metrics: {
          type: "array",
          items: { type: "string" },
          description:
            "Métricas: sessions, users, conversions, revenue, bounce_rate, avg_session_duration",
        },
        dimension: {
          type: "string",
          enum: ["channel", "landing_page", "device", "country", "event_name"],
          description: "Dimensión de agrupación (opcional)",
        },
        property_id: {
          type: "string",
          description: "GA4 Property ID (ej: '123456789'). Si no se especifica, usa el default.",
        },
      },
      required: ["date_range", "metrics"],
    },
  },
  {
    name: "query_google_ads",
    description:
      "Consulta métricas de Google Ads: impresiones, clics, CTR, CPC, conversiones, costo, ROAS, Quality Score por campaña, grupo de anuncios o keyword.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "last_90_days"],
        },
        level: {
          type: "string",
          enum: ["account", "campaign", "ad_group", "keyword"],
          description: "Nivel de granularidad del reporte",
        },
        campaign_id: {
          type: "string",
          description: "ID de campaña específica (opcional)",
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description:
            "Métricas: impressions, clicks, ctr, cpc, conversions, cost, roas, quality_score",
        },
      },
      required: ["date_range", "level", "metrics"],
    },
  },
  {
    name: "query_meta_ads",
    description:
      "Consulta métricas de Meta Ads (Facebook + Instagram): alcance, impresiones, CPM, CTR, CPC, conversiones, ROAS, frecuencia, desglose por placement o demografía.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "last_90_days"],
        },
        level: {
          type: "string",
          enum: ["account", "campaign", "adset", "ad"],
        },
        breakdown: {
          type: "string",
          enum: ["age", "gender", "placement", "device", "country", "none"],
          description: "Segmentación adicional (opcional)",
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description:
            "Métricas: reach, impressions, cpm, ctr, cpc, conversions, roas, frequency, spend",
        },
        campaign_id: { type: "string", description: "ID de campaña específica (opcional)" },
      },
      required: ["date_range", "level", "metrics"],
    },
  },
  {
    name: "query_tiktok_ads",
    description:
      "Consulta métricas de TikTok Ads: impresiones, clics, CTR, CPM, CPC, conversiones, costo, ROAS, retención de video, desglose por edad/creatividad.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "last_90_days"],
        },
        level: {
          type: "string",
          enum: ["account", "campaign", "adgroup", "ad"],
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description:
            "Métricas: impressions, clicks, ctr, cpm, cpc, conversions, cost, roas, video_views, video_completion_rate",
        },
        breakdown: {
          type: "string",
          enum: ["age", "gender", "creative", "placement", "none"],
        },
      },
      required: ["date_range", "level", "metrics"],
    },
  },
  {
    name: "query_linkedin_ads",
    description:
      "Consulta métricas de LinkedIn Ads: impresiones, clics, CTR, CPC, conversiones, leads de formularios, desglose por cargo, industria o empresa.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "last_90_days"],
        },
        level: {
          type: "string",
          enum: ["account", "campaign", "creative"],
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description:
            "Métricas: impressions, clicks, ctr, cpc, conversions, leads, cost_per_lead, spend",
        },
        breakdown: {
          type: "string",
          enum: ["job_title", "industry", "company_size", "seniority", "none"],
        },
      },
      required: ["date_range", "level", "metrics"],
    },
  },
  {
    name: "compare_platforms",
    description:
      "Compara el rendimiento entre múltiples plataformas publicitarias en el mismo período para identificar la distribución óptima de presupuesto.",
    input_schema: {
      type: "object" as const,
      properties: {
        platforms: {
          type: "array",
          items: {
            type: "string",
            enum: ["google_ads", "meta_ads", "tiktok_ads", "linkedin_ads"],
          },
          description: "Plataformas a comparar",
        },
        date_range: {
          type: "string",
          enum: ["last_7_days", "last_30_days", "last_90_days"],
        },
        primary_kpi: {
          type: "string",
          enum: ["roas", "cpa", "ctr", "conversions", "spend_efficiency"],
          description: "KPI principal de comparación",
        },
      },
      required: ["platforms", "date_range", "primary_kpi"],
    },
  },
  {
    name: "generate_report",
    description:
      "Genera un reporte ejecutivo estructurado con los datos analizados, insights prioritarios y plan de acción recomendado.",
    input_schema: {
      type: "object" as const,
      properties: {
        report_type: {
          type: "string",
          enum: ["weekly", "monthly", "campaign_audit", "budget_reallocation", "creative_analysis"],
        },
        recipient: {
          type: "string",
          enum: ["client", "internal_team", "executive"],
          description: "Audiencia del reporte para ajustar el nivel técnico",
        },
        focus_areas: {
          type: "array",
          items: { type: "string" },
          description: "Áreas específicas a profundizar en el reporte",
        },
      },
      required: ["report_type", "recipient"],
    },
  },
];

// ─── EJECUTOR DE HERRAMIENTAS ────────────────────────────────────────────────

export async function executeDataAnalystTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "query_google_analytics":
      return queryGA4(input);
    case "query_google_ads":
      return queryGoogleAds(input);
    case "query_meta_ads":
      return queryMetaAds(input);
    case "query_tiktok_ads":
      return queryTikTokAds(input);
    case "query_linkedin_ads":
      return queryLinkedInAds(input);
    case "compare_platforms":
      return comparePlatforms(input);
    case "generate_report":
      return generateReport(input);
    default:
      return { error: `Herramienta desconocida: ${toolName}` };
  }
}

async function comparePlatforms(input: Record<string, unknown>) {
  const platforms = input.platforms as string[];
  const dateRange = input.date_range as string;
  const kpi = input.primary_kpi as string;

  const results: Record<string, unknown> = {};

  for (const platform of platforms) {
    if (platform === "google_ads") results.google_ads = await queryGoogleAds({ date_range: dateRange, level: "account", metrics: ["impressions", "clicks", "conversions", "cost", "roas"] });
    if (platform === "meta_ads") results.meta_ads = await queryMetaAds({ date_range: dateRange, level: "account", metrics: ["impressions", "clicks", "conversions", "spend", "roas"] });
    if (platform === "tiktok_ads") results.tiktok_ads = await queryTikTokAds({ date_range: dateRange, level: "account", metrics: ["impressions", "clicks", "conversions", "cost", "roas"] });
    if (platform === "linkedin_ads") results.linkedin_ads = await queryLinkedInAds({ date_range: dateRange, level: "account", metrics: ["impressions", "clicks", "conversions", "spend"] });
  }

  return {
    comparison: results,
    primary_kpi: kpi,
    date_range: dateRange,
    note: "Compara los valores del KPI primario entre plataformas para identificar oportunidades de redistribución de presupuesto.",
  };
}

function generateReport(input: Record<string, unknown>) {
  return {
    report_type: input.report_type,
    recipient: input.recipient,
    status: "Generando reporte con datos actuales...",
    sections: [
      "Resumen Ejecutivo",
      "Performance por Plataforma",
      "Análisis de Tendencias",
      "Anomalías Detectadas",
      "Oportunidades de Optimización",
      "Plan de Acción Priorizado",
    ],
    note: "El reporte completo se generará tras obtener todos los datos de las plataformas.",
  };
}
