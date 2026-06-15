import { NextResponse } from "next/server";
import { runDataAnalystAgent } from "@/agents/data-analyst";
import type { AnalysisMessage } from "@/agents/data-analyst";
import { guardInternal } from "@/lib/api/guard";
import { logAIInteraction } from "@/lib/observability/track";
import { z } from "zod";

// Las integraciones (GA4 service-account/ADC) usan crypto y fs → runtime nodejs.
export const runtime = "nodejs";

const analyzeSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(8000),
    })
  ).min(1).max(10),
  tenantId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Endpoint interno (el más caro: Sonnet, 4096 tokens, fan-out multi-plataforma).
    // FAIL-CLOSED: sin DASHBOARD_API_KEY configurada → 503, nunca abierto.
    const unauthorized = guardInternal(req);
    if (unauthorized) return unauthorized;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Motor de análisis no disponible. Configura ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const validation = analyzeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const { messages, tenantId } = validation.data;

    const result = await runDataAnalystAgent(messages as AnalysisMessage[], tenantId);

    logAIInteraction({
      agent: "data-analyst",
      tenantId,
      durationMs: result.durationMs,
      tools: result.toolsUsed,
      success: true,
      meta: { platformsQueried: result.platformsQueried, hasReport: result.hasReport },
    });

    return NextResponse.json({
      text: result.text,
      toolsUsed: result.toolsUsed,
      platformsQueried: result.platformsQueried,
      durationMs: result.durationMs,
      hasReport: result.hasReport,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[Agent/Analyze Error]:", message);
    return NextResponse.json({ error: "Error del agente de análisis" }, { status: 500 });
  }
}
