import { anthropic, MODELS } from "@/lib/ai/client";
import { CUSTOMER_SERVICE_SYSTEM_PROMPT } from "./prompts";
import { CUSTOMER_SERVICE_TOOLS, executeCustomerServiceTool } from "./tools";
import type Anthropic from "@anthropic-ai/sdk";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentResponse {
  text: string;
  toolsUsed: string[];
  leadCreated: boolean;
  durationMs: number;
}

export async function runCustomerServiceAgent(
  messages: ChatMessage[]
): Promise<AgentResponse> {
  const startTime = Date.now();
  const toolsUsed: string[] = [];
  let leadCreated = false;

  // Convertir al formato Anthropic
  let currentMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let finalText = "";

  // Bucle agéntico — maneja llamadas a herramientas automáticamente
  while (true) {
    const response = await anthropic.messages.create({
      model: MODELS.BALANCED,
      max_tokens: 1500,
      system: CUSTOMER_SERVICE_SYSTEM_PROMPT,
      tools: CUSTOMER_SERVICE_TOOLS,
      messages: currentMessages,
    });

    // Acumulamos texto visible
    for (const block of response.content) {
      if (block.type === "text") {
        finalText = block.text;
      }
    }

    // Si el agente no llama herramientas, terminamos
    if (response.stop_reason === "end_turn") break;

    // Procesamos llamadas a herramientas
    if (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUseBlocks) {
        toolsUsed.push(toolUse.name);
        if (toolUse.name === "create_lead") leadCreated = true;

        const result = await executeCustomerServiceTool(
          toolUse.name,
          toolUse.input as Record<string, unknown>
        );

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(result),
        });
      }

      // Añadimos respuesta del asistente + resultados de herramientas al historial
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
    leadCreated,
    durationMs: Date.now() - startTime,
  };
}
