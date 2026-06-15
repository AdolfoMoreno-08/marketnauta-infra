/*
  GUARDA DE API — Autenticación interna + Rate Limiting
  ──────────────────────────────────────────────────────────────────────────────
  Protege los endpoints que consumen tokens de Anthropic contra abuso de costos
  (token-burn / wallet-DoS) y accesos no autorizados.

  Dos primitivas:
    · rateLimit(req, opts) → limita por IP. Para endpoints públicos (chat, stream,
      qualify) que NO deben requerir auth pero sí deben frenar floods.
    · guardInternal(req)   → exige x-internal-key. Para endpoints internos (analyze).
      Es FAIL-CLOSED: si la clave no está configurada, deniega (503), nunca abre.

  NOTA DE PRODUCCIÓN (escalabilidad):
    El rate limit es in-memory, por lo que el contador es POR INSTANCIA serverless.
    Frena floods contra una instancia caliente, pero no es un límite global exacto.
    Para límites globales precisos, sustituir el Map por Upstash Redis:
      import { Ratelimit } from "@upstash/ratelimit";
      import { Redis } from "@upstash/redis";
    manteniendo la misma firma de `rateLimit`.
*/

import { NextResponse } from "next/server";

// ─── EXTRACCIÓN DE IP DEL CLIENTE ─────────────────────────────────────────────

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}

// ─── RATE LIMITER IN-MEMORY (sliding window) ──────────────────────────────────

interface RateLimitOptions {
  /** Máximo de solicitudes permitidas dentro de la ventana. Default: 8 */
  limit?: number;
  /** Tamaño de la ventana en milisegundos. Default: 60_000 (1 min) */
  windowMs?: number;
  /** Namespace para aislar contadores entre endpoints. Default: "default" */
  name?: string;
}

// Mapa: clave (`${name}:${ip}`) → timestamps (ms) de las solicitudes en la ventana
const hits = new Map<string, number[]>();

// Limpieza periódica para evitar fugas de memoria en instancias de larga vida.
// Se ejecuta como máximo una vez por minuto, de forma perezosa.
let lastSweep = 0;
function sweep(now: number, windowMs: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, times] of hits) {
    const fresh = times.filter((t) => now - t < windowMs);
    if (fresh.length === 0) hits.delete(key);
    else hits.set(key, fresh);
  }
}

/**
 * Aplica rate limiting por IP. Devuelve una NextResponse 429 si se excede el
 * límite, o `null` si la solicitud puede continuar.
 */
export function rateLimit(req: Request, opts: RateLimitOptions = {}): NextResponse | null {
  const limit = opts.limit ?? 8;
  const windowMs = opts.windowMs ?? 60_000;
  const name = opts.name ?? "default";

  const now = Date.now();
  sweep(now, windowMs);

  const key = `${name}:${getClientIp(req)}`;
  const prev = hits.get(key) ?? [];
  const recent = prev.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0];
    const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  recent.push(now);
  hits.set(key, recent);
  return null;
}

// ─── GUARDA INTERNA (fail-closed) ─────────────────────────────────────────────

/**
 * Exige el header `x-internal-key` igual a `DASHBOARD_API_KEY`.
 * FAIL-CLOSED: si la variable de entorno no está configurada, deniega con 503
 * en lugar de abrir el endpoint (corrige el patrón fail-open anterior).
 * Devuelve una NextResponse de error, o `null` si la solicitud está autorizada.
 */
export function guardInternal(req: Request): NextResponse | null {
  const expected = process.env.DASHBOARD_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "Servicio no configurado" },
      { status: 503 }
    );
  }
  if (req.headers.get("x-internal-key") !== expected) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
