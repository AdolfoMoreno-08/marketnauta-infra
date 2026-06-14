import { NextResponse } from "next/server";
import { runCustomerServiceAgent } from "@/agents/customer-service";
import type { ChatMessage } from "@/agents/customer-service";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(4000),
    })
  ).min(1).max(20),
  sessionId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Bot no disponible en este momento. Configura ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const validation = chatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Formato de mensajes inválido" }, { status: 400 });
    }

    const { messages } = validation.data;

    const result = await runCustomerServiceAgent(messages as ChatMessage[]);

    return NextResponse.json({
      text: result.text,
      toolsUsed: result.toolsUsed,
      leadCreated: result.leadCreated,
      durationMs: result.durationMs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno del agente";
    console.error("[Agent/Chat Error]:", message);
    return NextResponse.json({ error: "Error del agente de atención al cliente" }, { status: 500 });
  }
}
