/*
  ENDPOINT PÚBLICO MULTI-TENANT: POST /api/v1/leads

  Usado por sitios satélite de clientes para capturar leads
  y dirigirlos al pipeline de calificación de Marketnauta.

  Auth: Header "x-api-key" con la clave del tenant
*/

import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5),
  company: z.string().optional(),
  challenge: z.string().min(3),
  budget: z.string().optional(),
  source_page: z.string().optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

// Tenants hardcodeados temporalmente — mover a DB cuando se active Neon
const VALID_TENANT_KEYS: Record<string, string> = {
  [process.env.TENANT_KEY_INTERNAL ?? "mk_internal_00"]: "marketnauta-core",
  [process.env.TENANT_KEY_CLIENT_1 ?? "mk_client_01"]: "cliente-demo-1",
  [process.env.TENANT_KEY_CLIENT_2 ?? "mk_client_02"]: "cliente-demo-2",
};

function resolveTenant(apiKey: string | null): { tenantId: string | null; tenantName: string | null } {
  if (!apiKey) return { tenantId: null, tenantName: null };
  const name = VALID_TENANT_KEYS[apiKey];
  return name ? { tenantId: apiKey, tenantName: name } : { tenantId: null, tenantName: null };
}

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const { tenantId, tenantName } = resolveTenant(apiKey);

    if (!tenantId) {
      return NextResponse.json({ error: "API key inválida o no proporcionada" }, { status: 401 });
    }

    const body = await req.json();
    const validation = leadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Datos del lead inválidos", details: validation.error.format() }, { status: 400 });
    }

    const data = validation.data;
    const eventId = `v1_${tenantId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // 1. Disparar calificación asíncrona (fire-and-forget en Edge)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.marketnauta.com";
    fetch(`${baseUrl}/api/agents/qualify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        source: `satellite:${tenantName}`,
        _internalKey: process.env.DASHBOARD_API_KEY,
      }),
    }).catch((e) => console.error("[v1/leads] Qualify trigger failed:", e));

    // 2. Enviar notificación interna por email
    fetch(`${baseUrl}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email ?? "",
        phone: data.phone,
        company: data.company ?? "",
        challenge: data.challenge,
        budget: data.budget ?? "Vía satélite",
        volume: "Satellite lead",
        url: data.source_page ?? "",
        eventId,
        userAgent: req.headers.get("user-agent") ?? "satellite",
        botField: "",
        tenantId,
        tenantName,
      }),
    }).catch((e) => console.error("[v1/leads] Email notification failed:", e));

    return NextResponse.json({
      success: true,
      eventId,
      tenant: tenantName,
      message: "Lead registrado y pipeline de calificación activado.",
    }, { status: 201 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[API v1/leads]:", message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/v1/leads",
    version: "1.0.0",
    description: "Endpoint de captura de leads para nodos satélite de Marketnauta",
    auth: "Header x-api-key requerido",
    schema: {
      name: "string (requerido)",
      phone: "string (requerido)",
      challenge: "string (requerido)",
      email: "string (opcional)",
      company: "string (opcional)",
      budget: "string (opcional)",
      source_page: "string (opcional)",
      custom_fields: "object (opcional)",
    },
  });
}
