/*
  INTEGRACIÓN CRM — HubSpot (Contacts API v3)
  ──────────────────────────────────────────────────────────────────────────────
  Crea/actualiza un contacto en HubSpot a partir de un lead del formulario.

  Configuración (Vercel → Environment Variables):
    HUBSPOT_TOKEN → Private App Token de HubSpot con scope crm.objects.contacts.write
                    (HubSpot → Settings → Integrations → Private Apps → Create)

  Diseño: GRACEFUL. Si HUBSPOT_TOKEN no está configurado, no hace nada y nunca
  rompe el flujo de captura del lead (el email vía /api/send sigue funcionando).
  Mapea solo propiedades estándar de HubSpot para evitar 400 por propiedad
  inexistente; el contexto de calificación (desafío, presupuesto, escala) va en
  la propiedad estándar `message`.
*/

export interface CrmLead {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  url?: string;
  challenge?: string;
  budget?: string;
  volume?: string;
  source?: string;
}

export interface CrmResult {
  status: "sent" | "updated" | "skipped" | "error";
  id?: string;
  message?: string;
}

const HUBSPOT_BASE = "https://api.hubapi.com/crm/v3/objects/contacts";

function buildProperties(lead: CrmLead): Record<string, string> {
  const trimmed = lead.name.trim();
  const [firstname, ...rest] = trimmed.split(/\s+/);
  const lastname = rest.join(" ");

  const note = [
    lead.challenge && `Desafío: ${lead.challenge}`,
    lead.budget && `Presupuesto: ${lead.budget}`,
    lead.volume && `Escala: ${lead.volume}`,
    lead.source && `Fuente: ${lead.source}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const props: Record<string, string> = {
    firstname: firstname || trimmed,
    phone: lead.phone,
    lifecyclestage: "lead",
  };
  if (lastname) props.lastname = lastname;
  if (lead.email) props.email = lead.email;
  if (lead.company) props.company = lead.company;
  if (lead.url) props.website = lead.url;
  if (note) props.message = note;

  return props;
}

export async function sendLeadToCrm(lead: CrmLead): Promise<CrmResult> {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) return { status: "skipped", message: "HUBSPOT_TOKEN no configurado" };

  const properties = buildProperties(lead);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(HUBSPOT_BASE, {
      method: "POST",
      headers,
      body: JSON.stringify({ properties }),
    });

    if (res.ok) {
      const data = (await res.json()) as { id: string };
      return { status: "sent", id: data.id };
    }

    // 409 = contacto ya existe → actualizar por email (upsert)
    if (res.status === 409 && lead.email) {
      const upd = await fetch(
        `${HUBSPOT_BASE}/${encodeURIComponent(lead.email)}?idProperty=email`,
        { method: "PATCH", headers, body: JSON.stringify({ properties }) }
      );
      if (upd.ok) return { status: "updated" };
    }

    const err = (await res.json().catch(() => ({}))) as { message?: string };
    return { status: "error", message: `HubSpot ${res.status}: ${err.message ?? "error"}` };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "error de red" };
  }
}
