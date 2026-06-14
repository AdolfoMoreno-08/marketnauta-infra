import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

export const MODELS = {
  FAST: "claude-haiku-4-5-20251001",
  BALANCED: "claude-sonnet-4-6",
  POWERFUL: "claude-sonnet-4-6",
} as const;

export type ModelKey = keyof typeof MODELS;
