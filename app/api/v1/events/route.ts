/*
  ENDPOINT PÚBLICO MULTI-TENANT: POST /api/v1/events

  Tracking de eventos de comportamiento desde nodos satélite.
  Los eventos alimentan el Data Layer centralizado y los agentes de IA.

  Auth: Header "x-api-key" con la clave del tenant
*/

import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  event_name: z.string().min(1).max(100),
  session_id: z.string().optional(),
  user_id: z.string().optional(),
  page: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.number().optional(),
});

const VALID_TENANT_KEYS: Record<string, string> = {
  [process.env.TENANT_KEY_INTERNAL ?? "mk_internal_00"]: "marketnauta-core",
  [process.env.TENANT_KEY_CLIENT_1 ?? "mk_client_01"]: "cliente-demo-1",
  [process.env.TENANT_KEY_CLIENT_2 ?? "mk_client_02"]: "cliente-demo-2",
};

const HIGH_VALUE_EVENTS = [
  "cta_click",
  "form_start",
  "form_complete",
  "lead_created",
  "page_scroll_75",
  "pricing_view",
  "video_complete",
];

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const tenantName = apiKey ? VALID_TENANT_KEYS[apiKey] : null;

    if (!tenantName) {
      return NextResponse.json({ error: "API key inválida" }, { status: 401 });
    }

    const body = await req.json();

    // Soporte para batch de eventos (array) o evento único
    const events = Array.isArray(body) ? body : [body];

    const results = [];
    for (const rawEvent of events.slice(0, 50)) { // máx 50 eventos por batch
      const validation = eventSchema.safeParse(rawEvent);
      if (!validation.success) {
        results.push({ status: "invalid", event: rawEvent.event_name });
        continue;
      }

      const event = validation.data;
      const isHighValue = HIGH_VALUE_EVENTS.includes(event.event_name);

      // Log para debugging (en producción → insertar en DB)
      console.log(`[v1/events] tenant=${tenantName} event=${event.event_name} high_value=${isHighValue}`);

      // Si es evento de alto valor, disparar análisis de contexto (en prod → queue)
      if (isHighValue && event.properties) {
        console.log(`[v1/events] High-value event: ${event.event_name}`, event.properties);
      }

      results.push({
        status: "received",
        event: event.event_name,
        high_value: isHighValue,
        timestamp: event.timestamp ?? Date.now(),
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[API v1/events]:", message);
    return NextResponse.json({ error: "Error procesando eventos" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/v1/events",
    version: "1.0.0",
    description: "Tracking de eventos de comportamiento para nodos satélite",
    auth: "Header x-api-key requerido",
    supports_batch: true,
    max_batch_size: 50,
    high_value_events: HIGH_VALUE_EVENTS,
    schema: {
      event_name: "string (requerido)",
      session_id: "string (opcional)",
      user_id: "string (opcional)",
      page: "string (opcional)",
      properties: "object (opcional)",
      timestamp: "number epoch ms (opcional)",
    },
  });
}
