/*
  STREAMING ENDPOINT: POST /api/agents/stream
  Motor Claude en vivo — transmite eventos del agente al cliente en tiempo real.

  Emite eventos newline-delimited JSON:
    {"t":"start"}
    {"t":"status","s":"texto"}
    {"t":"text","d":"token"}
    {"t":"tool_start","n":"nombre","label":"Descripción legible"}
    {"t":"tool_end","n":"nombre","summary":"resultado resumido"}
    {"t":"done","stats":{"tokens":123,"ms":4500,"tools":["ga4","meta"]}}
    {"t":"error","msg":"texto"}
*/

import { anthropic, MODELS } from "@/lib/ai/client";
import { rateLimit } from "@/lib/api/guard";
import { logAIInteraction } from "@/lib/observability/track";
import type Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const encoder = new TextEncoder();

type StreamEvent =
  | { t: "start" }
  | { t: "status"; s: string }
  | { t: "text"; d: string }
  | { t: "tool_start"; n: string; label: string; input?: Record<string, unknown> }
  | { t: "tool_end"; n: string; summary: string }
  | { t: "done"; stats: { tokens: number; ms: number; tools: string[] } }
  | { t: "error"; msg: string };

function send(ctrl: ReadableStreamDefaultController<Uint8Array>, event: StreamEvent) {
  ctrl.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── HERRAMIENTAS DEL DEMO ────────────────────────────────────────────────────

const DEMO_TOOLS: Anthropic.Tool[] = [
  {
    name: "query_ga4",
    description:
      "Consulta métricas de Google Analytics 4: sesiones, usuarios, conversiones, revenue, tasa de rebote, fuentes de tráfico.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days", "last_90_days"],
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description: "sessions | users | conversions | revenue | bounce_rate",
        },
        dimension: {
          type: "string",
          enum: ["channel", "device", "landing_page", "country"],
          description: "Dimensión de segmentación",
        },
      },
      required: ["date_range", "metrics"],
    },
  },
  {
    name: "query_ads",
    description:
      "Consulta métricas de Meta Ads y Google Ads: impresiones, clics, CTR, CPC, ROAS, conversiones, presupuesto gastado.",
    input_schema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["meta", "google", "tiktok", "linkedin"],
        },
        date_range: {
          type: "string",
          enum: ["today", "yesterday", "last_7_days", "last_30_days"],
        },
        metrics: {
          type: "array",
          items: { type: "string" },
          description: "spend | impressions | clicks | ctr | cpc | roas | conversions",
        },
      },
      required: ["platform", "date_range", "metrics"],
    },
  },
  {
    name: "analyze_attribution",
    description:
      "Analiza la atribución cross-canal y detecta fugas. Cruza datos de GA4 con Meta y Google para encontrar discrepancias.",
    input_schema: {
      type: "object" as const,
      properties: {
        date_range: { type: "string" },
        focus: {
          type: "string",
          enum: ["ios_attribution", "cross_channel", "roas_anomaly", "cac_trend"],
        },
      },
      required: ["date_range", "focus"],
    },
  },
];

// Labels legibles para cada herramienta
const TOOL_LABELS: Record<string, string> = {
  query_ga4: "Consultando Google Analytics 4",
  query_ads: "Consultando plataformas de pauta",
  analyze_attribution: "Analizando atribución cross-canal",
};

// Resultados mock para demo (cuando las integraciones reales no están configuradas)
function mockToolResult(name: string, input: Record<string, unknown>): string {
  if (name === "query_ga4") {
    return JSON.stringify({
      status: "demo",
      date_range: input.date_range ?? "last_30_days",
      sessions: 4280,
      users: 3150,
      conversions: 47,
      revenue: 18500,
      bounce_rate: 42.3,
      top_channels: [
        { channel: "Organic Search", sessions: 1820, conversions: 22 },
        { channel: "Paid Search", sessions: 1240, conversions: 15 },
        { channel: "Paid Social", sessions: 780, conversions: 8 },
        { channel: "Direct", sessions: 440, conversions: 2 },
      ],
    });
  }
  if (name === "query_ads") {
    const platform = input.platform ?? "meta";
    return JSON.stringify({
      status: "demo",
      platform,
      date_range: input.date_range ?? "last_30_days",
      spend: 4200,
      impressions: 285000,
      clicks: 3840,
      ctr: 1.35,
      cpc: 1.09,
      conversions: 38,
      roas: 4.2,
      top_campaign: platform === "meta" ? "Prospecting_LAL_E-comm" : "Brand_Search_Exact",
    });
  }
  if (name === "analyze_attribution") {
    return JSON.stringify({
      status: "demo",
      focus: input.focus,
      ios_signal_loss: "34%",
      ga4_conversions: 47,
      meta_reported_conversions: 38,
      discrepancy: "9 conversiones (19%) sin trackear en Meta",
      recommendation:
        "Implementar Meta CAPI Server-Side para recuperar señal iOS. Estimado de recuperación: +28% de conversiones reportadas.",
      estimated_recovery: "+$5,180 en revenue atribuible/mes",
    });
  }
  return JSON.stringify({ status: "demo", result: "OK" });
}

// ─── SISTEMA DE PROMPT ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres el Motor de Inteligencia de Marketnauta — un analista senior de performance marketing y datos.

Cuando el usuario haga una consulta:
1. Usa las herramientas disponibles para obtener datos reales ANTES de responder
2. Cruza datos entre plataformas cuando sea relevante
3. Sé directo y accionable — evita generalidades
4. Formatea la respuesta con secciones claras usando markdown
5. Termina siempre con una recomendación concreta con estimado de impacto

Responde en español. Sé conciso pero completo (máx 400 palabras).`;

// ─── MODO DEMO (sin API key) ──────────────────────────────────────────────────

async function* demoEvents(prompt: string): AsyncGenerator<StreamEvent> {
  yield { t: "start" };
  await sleep(200);
  yield { t: "status", s: "Parseando intención..." };
  await sleep(600);

  const isRoas = prompt.toLowerCase().includes("roas") || prompt.toLowerCase().includes("campañ");
  const isAttr = prompt.toLowerCase().includes("atribución") || prompt.toLowerCase().includes("ios");
  const isLead = prompt.toLowerCase().includes("lead") || prompt.toLowerCase().includes("calific");

  if (!isLead) {
    yield { t: "tool_start", n: "query_ga4", label: "Consultando Google Analytics 4" };
    await sleep(900);
    yield {
      t: "tool_end",
      n: "query_ga4",
      summary: "4,280 sesiones · 47 conv · Revenue $18,500 (últimos 30 días)",
    };
    await sleep(300);
  }

  if (isRoas || (!isAttr && !isLead)) {
    yield { t: "tool_start", n: "query_ads", label: "Consultando Meta Ads & Google Ads" };
    await sleep(1000);
    yield {
      t: "tool_end",
      n: "query_ads",
      summary: "Meta ROAS: 4.2x · Google CPC: $1.09 · Spend total: $4,200",
    };
    await sleep(300);
  }

  if (isAttr) {
    yield { t: "tool_start", n: "analyze_attribution", label: "Analizando atribución cross-canal" };
    await sleep(1100);
    yield {
      t: "tool_end",
      n: "analyze_attribution",
      summary: "34% de señal iOS perdida · 9 conv sin reportar · Recuperable: +$5,180/mes",
    };
    await sleep(300);
  }

  yield { t: "status", s: "Generando análisis..." };
  await sleep(400);

  let responseText: string;
  if (isAttr) {
    responseText =
      "## Diagnóstico de Atribución\n\nHe detectado una pérdida de señal del **34%** en tus conversiones de Meta, correlacionada con las restricciones iOS 14.5+.\n\n**Hallazgos clave:**\n- GA4 registra 47 conversiones\n- Meta reporta solo 38 (diferencia: 9 eventos)\n- El canal Paid Social muestra CTR bajo artificialmente\n\n**Causa raíz:** El píxel del navegador no puede trackear usuarios con App Tracking Transparency (ATT) desactivado — aproximadamente el 65% de los usuarios iOS.\n\n**Acción recomendada:** Implementar Meta Conversion API (CAPI) Server-Side vía GTM Server Container. Impacto estimado: recuperar +$5,180/mes en revenue atribuible y reducir el CPA reportado en un 18%.";
  } else if (isLead) {
    responseText =
      "## Calificación de Lead\n\nBasado en el perfil indicado, el sistema de scoring asigna:\n\n**Score: 78/100 — Tier: WARM 🟡**\n\n**Factores positivos:**\n- Presupuesto alineado con el servicio objetivo\n- Industria con alto LTV histórico\n- Canal de entrada con mayor tasa de cierre\n\n**Próximo paso recomendado:** Agendar llamada de discovery en las próximas 24h. La probabilidad de cierre es del 42% con contacto inmediato vs 18% si se demora más de 72h.\n\n**Score de urgencia:** ALTA — el lead tiene características de 'comprador activo' basado en el patrón de comportamiento.";
  } else {
    responseText =
      "## Análisis de ROAS — Últimos 30 días\n\nEl ROAS consolidado es de **4.2x** en Meta y **3.8x** en Google Search, con una tendencia positiva del +12% vs el período anterior.\n\n**Por canal:**\n- Prospecting Meta: 3.1x (por debajo del objetivo de 3.5x)\n- Retargeting Meta: 6.8x (excelente)\n- Google Search Brand: 8.2x\n- Google Search No-brand: 2.4x\n\n**Oportunidad identificada:** El segmento de Retargeting está limitado por presupuesto. Reasignar $800/mes de Google No-brand a Retargeting Meta proyecta un incremento de +0.6x en ROAS consolidado.\n\n**Recomendación:** Ejecutar este rebalanceo en los próximos 7 días y monitorear con ventana de 14 días.";
  }

  for (const char of responseText) {
    yield { t: "text", d: char };
    await sleep(char === "\n" ? 50 : 14);
  }

  const toolsUsed = isAttr
    ? ["query_ga4", "analyze_attribution"]
    : isLead
    ? []
    : ["query_ga4", "query_ads"];

  yield {
    t: "done",
    stats: { tokens: Math.floor(Math.random() * 150) + 280, ms: 3200, tools: toolsUsed },
  };
}

// ─── HANDLER PRINCIPAL ────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Rate limit: endpoint público de demo del motor.
  const limited = rateLimit(req, { name: "stream", limit: 6, windowMs: 60_000 });
  if (limited) return limited;

  let promptText = "";
  try {
    const body = await req.json();
    promptText = String(body.prompt ?? "").slice(0, 500);
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  if (!promptText) {
    return new Response("Prompt requerido", { status: 400 });
  }

  const readableStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const startTime = Date.now();

      try {
        // ── MODO SIMULACIÓN (por defecto — ahorro de tokens) ──────────────────
        // El motor en vivo corre en demo salvo que STREAM_LIVE_AI="true" Y haya
        // API key. Así producción no gasta tokens reales en esta sección.
        // Para reactivar IA real: setear STREAM_LIVE_AI=true en Vercel.
        const streamLiveAI =
          process.env.STREAM_LIVE_AI === "true" &&
          !!process.env.ANTHROPIC_API_KEY &&
          process.env.ANTHROPIC_API_KEY.length >= 10;

        if (!streamLiveAI) {
          for await (const event of demoEvents(promptText)) {
            send(controller, event);
          }
          controller.close();
          return;
        }

        // ── MODO REAL — Claude con herramientas ───────────────────────────────
        send(controller, { t: "start" });
        send(controller, { t: "status", s: "Activando agente de análisis..." });

        const toolsUsed: string[] = [];
        let totalTokens = 0;

        let messages: Anthropic.MessageParam[] = [
          { role: "user", content: promptText },
        ];

        let iterations = 0;
        const MAX_ITER = 6;

        while (iterations < MAX_ITER) {
          iterations++;

          // Streaming real: usamos .stream() y reenviamos cada delta de texto
          // conforme el modelo lo genera (antes se esperaba la respuesta completa
          // y se troceaba carácter a carácter, lo que anulaba el streaming).
          const stream = anthropic.messages.stream({
            model: MODELS.FAST,
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            tools: DEMO_TOOLS,
            messages,
          });

          stream.on("text", (delta) => {
            send(controller, { t: "text", d: delta });
          });

          const response = await stream.finalMessage();
          totalTokens += response.usage?.output_tokens ?? 0;

          if (response.stop_reason === "tool_use") {
            const toolBlocks = response.content.filter(
              (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
            );

            const toolResults: Anthropic.ToolResultBlockParam[] = [];

            for (const tb of toolBlocks) {
              const label = TOOL_LABELS[tb.name] ?? tb.name;
              send(controller, { t: "tool_start", n: tb.name, label });
              toolsUsed.push(tb.name);

              const result = mockToolResult(tb.name, tb.input as Record<string, unknown>);
              await sleep(600 + Math.random() * 400); // simular latencia de herramienta

              const parsed = JSON.parse(result);
              const summary =
                tb.name === "query_ga4"
                  ? `${parsed.sessions?.toLocaleString() ?? "—"} sesiones · ${parsed.conversions ?? "—"} conv · ROAS demo`
                  : tb.name === "query_ads"
                  ? `ROAS: ${parsed.roas ?? "—"}x · Spend: $${parsed.spend?.toLocaleString() ?? "—"}`
                  : parsed.recommendation?.slice(0, 80) ?? "Análisis completado";

              send(controller, { t: "tool_end", n: tb.name, summary });

              toolResults.push({
                type: "tool_result",
                tool_use_id: tb.id,
                content: result,
              });
            }

            messages = [
              ...messages,
              { role: "assistant", content: response.content },
              { role: "user", content: toolResults },
            ];

            send(controller, { t: "status", s: "Sintetizando análisis..." });
            continue;
          }

          // end_turn: el texto ya se transmitió en vivo vía stream.on("text").
          break;
        }

        const uniqueTools = [...new Set(toolsUsed)];
        send(controller, {
          t: "done",
          stats: {
            tokens: totalTokens,
            ms: Date.now() - startTime,
            tools: uniqueTools,
          },
        });

        logAIInteraction({
          agent: "stream-engine",
          tokens: totalTokens,
          durationMs: Date.now() - startTime,
          tools: uniqueTools,
          success: true,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error del motor";
        send(controller, { t: "error", msg });
        logAIInteraction({
          agent: "stream-engine",
          durationMs: Date.now() - startTime,
          success: false,
          meta: { error: msg.slice(0, 200) },
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
