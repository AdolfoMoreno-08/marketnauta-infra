import type Anthropic from "@anthropic-ai/sdk";
import type { LeadTier } from "@/lib/db/schema";

export const LEAD_QUALIFIER_TOOLS: Anthropic.Tool[] = [
  {
    name: "score_and_route",
    description:
      "Produce el score final (0-100), clasificación de tier y decisión de routing para el lead analizado.",
    input_schema: {
      type: "object" as const,
      properties: {
        score: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Score numérico calculado según los criterios de la rúbrica",
        },
        tier: {
          type: "string",
          enum: ["HOT", "WARM", "COLD", "DISQUALIFIED"],
        },
        routing_decision: {
          type: "string",
          enum: [
            "DIRECT_CALL",
            "EMAIL_SEQUENCE_A",
            "EMAIL_SEQUENCE_B",
            "NEWSLETTER",
          ],
          description: "Acción de follow-up automática a disparar",
        },
        score_breakdown: {
          type: "object",
          description: "Desglose del score por criterio",
          properties: {
            budget_score: { type: "number" },
            challenge_score: { type: "number" },
            company_size_score: { type: "number" },
            contact_data_score: { type: "number" },
          },
        },
        sales_note: {
          type: "string",
          description:
            "Nota estratégica para el equipo de ventas (máx 2 oraciones). Menciona el ángulo de approach más efectivo.",
        },
        estimated_deal_value: {
          type: "string",
          enum: ["<S/2000", "S/2000-S/5000", "S/5000-S/15000", ">S/15000"],
          description: "Estimado del valor potencial del contrato mensual",
        },
        urgency_signal: {
          type: "string",
          enum: ["immediate", "short_term", "exploratory", "unknown"],
        },
      },
      required: ["score", "tier", "routing_decision", "score_breakdown", "sales_note"],
    },
  },
  {
    name: "flag_for_review",
    description:
      "Marca un lead para revisión manual cuando los datos son ambiguos o el caso es atípico.",
    input_schema: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Motivo por el que requiere revisión manual",
        },
        preliminary_tier: {
          type: "string",
          enum: ["HOT", "WARM", "COLD"],
        },
        questions_for_sales: {
          type: "array",
          items: { type: "string" },
          description: "Preguntas que el equipo debería aclarar en el primer contacto",
        },
      },
      required: ["reason", "preliminary_tier"],
    },
  },
];

// ─── RESULTADO DE CALIFICACIÓN ────────────────────────────────────────────────

export interface QualificationResult {
  score: number;
  tier: LeadTier;
  routingDecision: string;
  scoreBreakdown: {
    budgetScore: number;
    challengeScore: number;
    companySizeScore: number;
    contactDataScore: number;
  };
  salesNote: string;
  estimatedDealValue?: string;
  urgencySignal?: string;
  flaggedForReview?: boolean;
  reviewReason?: string;
  questionsForSales?: string[];
}

export function parseQualifierToolOutput(
  toolName: string,
  output: Record<string, unknown>
): QualificationResult | null {
  if (toolName === "score_and_route") {
    const breakdown = output.score_breakdown as Record<string, number> | undefined;
    return {
      score: output.score as number,
      tier: output.tier as LeadTier,
      routingDecision: output.routing_decision as string,
      scoreBreakdown: {
        budgetScore: breakdown?.budget_score ?? 0,
        challengeScore: breakdown?.challenge_score ?? 0,
        companySizeScore: breakdown?.company_size_score ?? 0,
        contactDataScore: breakdown?.contact_data_score ?? 0,
      },
      salesNote: output.sales_note as string,
      estimatedDealValue: output.estimated_deal_value as string | undefined,
      urgencySignal: output.urgency_signal as string | undefined,
    };
  }

  if (toolName === "flag_for_review") {
    return {
      score: 50,
      tier: (output.preliminary_tier as LeadTier) ?? "WARM",
      routingDecision: "MANUAL_REVIEW",
      scoreBreakdown: { budgetScore: 0, challengeScore: 0, companySizeScore: 0, contactDataScore: 0 },
      salesNote: output.reason as string,
      flaggedForReview: true,
      reviewReason: output.reason as string,
      questionsForSales: output.questions_for_sales as string[] | undefined,
    };
  }

  return null;
}
