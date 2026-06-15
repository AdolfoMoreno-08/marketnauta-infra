/*
  ENDPOINT: POST /api/crm/lead
  Recibe un lead del formulario y lo envía al CRM (HubSpot) server-side.
  La API key del CRM vive solo aquí (nunca en el cliente).

  Graceful: si el CRM no está configurado, responde success igualmente — la
  captura del lead (email vía /api/send) no depende de esto.
*/

import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/api/guard";
import { sendLeadToCrm } from "@/lib/integrations/crm";
import { logQualification } from "@/lib/observability/track";

export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5),
  company: z.string().optional(),
  url: z.string().optional(),
  challenge: z.string().optional(),
  budget: z.string().optional(),
  volume: z.string().optional(),
  source: z.string().optional(),
  botField: z.string().optional(), // honeypot anti-spam
});

export async function POST(req: Request) {
  // Rate-limit: endpoint público llamado desde el formulario.
  const limited = rateLimit(req, { name: "crm", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await req.json();

    // Honeypot: si el campo trampa viene lleno, fingir éxito (bots).
    if (body.botField && body.botField !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos del lead inválidos" }, { status: 400 });
    }

    const { botField: _hp, email, ...rest } = parsed.data;
    void _hp;

    const result = await sendLeadToCrm({ ...rest, email: email || undefined });

    // Telemetría (NDJSON): registra el destino del lead sin PII sensible.
    logQualification({
      score: 0,
      tier: "NEW",
      routingDecision: `CRM_${result.status.toUpperCase()}`,
      source: rest.source ?? "contact_modal",
      name: rest.name,
    });

    return NextResponse.json({ success: result.status !== "error", crm: result.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[api/crm/lead]:", message);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
