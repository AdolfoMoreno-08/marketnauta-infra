import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

// Optimización de costo: todos los agentes usan Haiku 4.5 ($1/$5 por millón de
// tokens, ~3x más barato que Sonnet). Calidad muy buena para atención al cliente,
// calificación de leads y análisis. Mantenemos las tres claves semánticas para
// poder re-escalar un agente concreto a Sonnet con un cambio de una línea:
//   · FAST     → stream-engine (demo del motor)
//   · BALANCED → customer-service, lead-qualifier
//   · POWERFUL → data-analyst  (si el análisis pierde calidad, subir a
//                "claude-sonnet-4-6" — es el agente de razonamiento más complejo)
export const MODELS = {
  FAST: "claude-haiku-4-5",
  BALANCED: "claude-haiku-4-5",
  POWERFUL: "claude-haiku-4-5",
} as const;

export type ModelKey = keyof typeof MODELS;
