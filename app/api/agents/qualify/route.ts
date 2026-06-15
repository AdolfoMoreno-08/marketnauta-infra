import { NextResponse } from "next/server";
import { runLeadQualifier } from "@/agents/lead-qualifier";
import type { LeadData } from "@/agents/lead-qualifier";
import { rateLimit } from "@/lib/api/guard";
import { logQualification } from "@/lib/observability/track";
import { z } from "zod";

const qualifySchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5).optional(),
  challenge: z.string().min(3),
  budget: z.string().optional(),
  volume: z.string().optional(),
  url: z.string().optional(),
  source: z.string().optional(),
  conversationContext: z.string().optional(),
  // Clave interna para llamadas desde /api/send
  _internalKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Las llamadas internas autenticadas (ej: /api/v1/leads) hacen bypass del
    // rate limit. El resto se limita por IP para frenar abuso externo directo.
    const internalKey = process.env.DASHBOARD_API_KEY;
    const isTrustedInternal = !!internalKey && req.headers.get("x-internal-key") === internalKey;
    if (!isTrustedInternal) {
      const limited = rateLimit(req, { name: "qualify", limit: 12, windowMs: 60_000 });
      if (limited) return limited;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Sin key configurada: retorna calificación básica sin IA
      return NextResponse.json({
        score: 50,
        tier: "WARM",
        routingDecision: "EMAIL_SEQUENCE_A",
        scoreBreakdown: { budgetScore: 15, challengeScore: 20, companySizeScore: 10, contactDataScore: 5 },
        salesNote: "Calificación automática sin IA activa.",
        durationMs: 0,
      });
    }

    const body = await req.json();
    const validation = qualifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Datos del lead inválidos" }, { status: 400 });
    }

    const leadData: LeadData = {
      name: validation.data.name,
      company: validation.data.company,
      email: validation.data.email || undefined,
      phone: validation.data.phone,
      challenge: validation.data.challenge,
      budget: validation.data.budget,
      volume: validation.data.volume,
      url: validation.data.url,
      source: validation.data.source ?? "api",
      conversationContext: validation.data.conversationContext,
    };

    const result = await runLeadQualifier(leadData);

    // Persistimos la decisión de calificación (antes se descartaba con un console.log).
    logQualification({
      score: result.score,
      tier: result.tier,
      routingDecision: result.routingDecision,
      source: leadData.source,
      name: leadData.name,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[Agent/Qualify Error]:", message);
    return NextResponse.json({ error: "Error del agente calificador" }, { status: 500 });
  }
}
