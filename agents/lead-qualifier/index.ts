import { anthropic, MODELS } from "@/lib/ai/client";
import { LEAD_QUALIFIER_SYSTEM_PROMPT } from "./prompts";
import { LEAD_QUALIFIER_TOOLS, parseQualifierToolOutput } from "./tools";
import type { QualificationResult } from "./tools";
import type Anthropic from "@anthropic-ai/sdk";

export interface LeadData {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  challenge: string;
  budget?: string;
  volume?: string;
  url?: string;
  source?: string;
  conversationContext?: string;
}

export async function runLeadQualifier(lead: LeadData): Promise<QualificationResult> {
  const leadSummary = `
DATOS DEL LEAD A CALIFICAR:
- Nombre: ${lead.name}
- Empresa: ${lead.company ?? "No especificada"}
- Email: ${lead.email ?? "No proporcionado"}
- WhatsApp: ${lead.phone ?? "No proporcionado"}
- Desafío principal: ${lead.challenge}
- Presupuesto mensual en pauta: ${lead.budget ?? "No especificado"}
- Tamaño de empresa: ${lead.volume ?? "No especificado"}
- URL del sitio: ${lead.url ?? "No proporcionado"}
- Fuente: ${lead.source ?? "web-form"}
${lead.conversationContext ? `\nCONTEXTO DE CONVERSACIÓN:\n${lead.conversationContext}` : ""}

Analiza este lead y usa la herramienta score_and_route para producir la calificación.
`.trim();

  let qualificationResult: QualificationResult | null = null;

  let currentMessages: Anthropic.MessageParam[] = [
    { role: "user", content: leadSummary },
  ];

  // El qualificador es single-turn: debería llamar a la herramienta en el primer intento
  for (let i = 0; i < 3; i++) {
    const response = await anthropic.messages.create({
      model: MODELS.BALANCED,
      max_tokens: 1024,
      system: LEAD_QUALIFIER_SYSTEM_PROMPT,
      tools: LEAD_QUALIFIER_TOOLS,
      tool_choice: { type: "any" }, // Forzar uso de herramienta
      messages: currentMessages,
    });

    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (toolUseBlocks.length > 0) {
      const toolUse = toolUseBlocks[0];
      qualificationResult = parseQualifierToolOutput(
        toolUse.name,
        toolUse.input as Record<string, unknown>
      );
      break;
    }

    // Si no usó herramienta, reintentar con presión
    currentMessages = [
      ...currentMessages,
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: "Debes usar la herramienta score_and_route para producir el output estructurado.",
      },
    ];
  }

  // Fallback si el agente no produce resultado
  if (!qualificationResult) {
    qualificationResult = {
      score: 40,
      tier: "COLD",
      routingDecision: "EMAIL_SEQUENCE_B",
      scoreBreakdown: { budgetScore: 10, challengeScore: 15, companySizeScore: 10, contactDataScore: 5 },
      salesNote: "Calificación de fallback — revisar manualmente.",
      flaggedForReview: true,
    };
  }

  return qualificationResult;
}
