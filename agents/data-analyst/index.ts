import { anthropic, MODELS } from "@/lib/ai/client";
import { DATA_ANALYST_SYSTEM_PROMPT } from "./prompts";
import { DATA_ANALYST_TOOLS, executeDataAnalystTool } from "./tools";
import type Anthropic from "@anthropic-ai/sdk";

export interface AnalysisMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnalysisResponse {
  text: string;
  toolsUsed: string[];
  platformsQueried: string[];
  durationMs: number;
  hasReport: boolean;
}

export async function runDataAnalystAgent(
  messages: AnalysisMessage[],
  tenantId?: string
): Promise<AnalysisResponse> {
  const startTime = Date.now();
  const toolsUsed: string[] = [];
  const platformsQueried: string[] = [];

  // Construir contexto de tenant si está disponible
  const tenantContext = tenantId
    ? `\nCONTEXTO ACTIVO: Analizando datos del cliente tenant_id=${tenantId}`
    : "";

  let currentMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let finalText = "";
  let hasReport = false;

  // Bucle agéntico con soporte para múltiples rondas de herramientas
  let iterations = 0;
  const MAX_ITERATIONS = 8; // Límite de seguridad para análisis complejos multi-plataforma

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await anthropic.messages.create({
      model: MODELS.POWERFUL,
      max_tokens: 4096,
      system: DATA_ANALYST_SYSTEM_PROMPT + tenantContext,
      tools: DATA_ANALYST_TOOLS,
      messages: currentMessages,
    });

    for (const block of response.content) {
      if (block.type === "text") {
        finalText = block.text;
        if (finalText.includes("Reporte") || finalText.includes("reporte")) hasReport = true;
      }
    }

    if (response.stop_reason === "end_turn") break;

    if (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        toolsUsed.push(toolUse.name);

        // Rastrear qué plataformas se consultaron
        const platformMap: Record<string, string> = {
          query_google_analytics: "GA4",
          query_google_ads: "Google Ads",
          query_meta_ads: "Meta Ads",
          query_tiktok_ads: "TikTok Ads",
          query_linkedin_ads: "LinkedIn Ads",
        };
        if (platformMap[toolUse.name]) {
          platformsQueried.push(platformMap[toolUse.name]);
        }

        const result = await executeDataAnalystTool(
          toolUse.name,
          toolUse.input as Record<string, unknown>
        );

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(result),
        });
      }

      currentMessages = [
        ...currentMessages,
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ];
    } else {
      break;
    }
  }

  return {
    text: finalText,
    toolsUsed,
    platformsQueried: [...new Set(platformsQueried)],
    durationMs: Date.now() - startTime,
    hasReport,
  };
}
