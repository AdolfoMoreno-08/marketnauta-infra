/*
  CAPA DE OBSERVABILIDAD — registro estructurado de interacciones agénticas y eventos
  ──────────────────────────────────────────────────────────────────────────────
  Antes, las interacciones de IA, los scores de leads y los eventos satélite se
  perdían en `console.log` dispersos y sin formato. Esta capa los centraliza como
  NDJSON (una línea JSON por registro), que un log-drain de Vercel puede exportar
  directamente a BigQuery / Datadog / Logflare para atribución y análisis de costo.

  PUNTO DE EXTENSIÓN (persistencia real):
    Cuando se aprovisione Neon (ver lib/db/schema.ts) y exista DATABASE_URL,
    reemplazar el cuerpo de `sink()` por un INSERT a la tabla correspondiente.
    Las firmas de las funciones públicas no cambiarán.

  PRINCIPIO: la telemetría NUNCA debe lanzar ni romper el flujo de negocio, y
  NUNCA registra PII directa (email / teléfono). Solo identificadores y métricas.
*/

type Json = Record<string, unknown>;

function sink(record: Json): void {
  try {
    // Una línea NDJSON por registro → parseable y exportable sin transformación.
    console.log("[telemetry] " + JSON.stringify(record));
  } catch {
    // La telemetría jamás propaga errores al caller.
  }
}

// ─── INTERACCIONES DE IA (coste / latencia / herramientas) ────────────────────

export interface AIInteractionRecord {
  agent: "customer-service" | "data-analyst" | "lead-qualifier" | "stream-engine";
  tenantId?: string;
  tokens?: number;
  durationMs: number;
  tools?: string[];
  success: boolean;
  meta?: Json;
}

export function logAIInteraction(r: AIInteractionRecord): void {
  sink({ kind: "ai_interaction", ts: new Date().toISOString(), ...r });
}

// ─── CALIFICACIÓN DE LEADS (decisión de routing — antes se descartaba) ─────────

export interface QualificationRecord {
  score: number;
  tier: string;
  routingDecision: string;
  source?: string;
  /** Nombre del lead (identificador no sensible). No registrar email/teléfono. */
  name?: string;
}

export function logQualification(r: QualificationRecord): void {
  sink({ kind: "lead_qualification", ts: new Date().toISOString(), ...r });
}

// ─── EVENTOS DE NODOS SATÉLITE (antes solo console.log y descarte) ─────────────

export interface SatelliteEventRecord {
  tenant: string;
  eventName: string;
  highValue: boolean;
  sessionId?: string;
  page?: string;
}

export function logSatelliteEvent(r: SatelliteEventRecord): void {
  sink({ kind: "satellite_event", ts: new Date().toISOString(), ...r });
}
