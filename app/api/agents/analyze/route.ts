import { NextResponse } from "next/server";
import { runDataAnalystAgent } from "@/agents/data-analyst";
import type { AnalysisMessage } from "@/agents/data-analyst";
import { z } from "zod";

const analyzeSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(8000),
    })
  ).min(1).max(10),
  tenantId: z.string().optional(),
});

// Middleware de autenticación interna simple (expandir con Clerk en producción)
function isAuthorized(req: Request): boolean {
  const apiKey = req.headers.get("x-internal-key");
  const dashboardKey = process.env.DASHBOARD_API_KEY;
  if (!dashboardKey) return true; // Desarrollo sin clave
  return apiKey === dashboardKey;
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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
