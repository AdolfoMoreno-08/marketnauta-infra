/*
  ESQUEMA DE BASE DE DATOS — Marketnauta Conversion OS
  Motor: PostgreSQL (Neon Serverless recomendado)

  Para activar:
    npm install drizzle-orm @neondatabase/serverless drizzle-kit
    Añadir DATABASE_URL en .env.local
    npx drizzle-kit push
*/

// ─── TIPOS TYPESCRIPT (usados por los agentes sin conexión activa) ─────────

export type LeadTier = "HOT" | "WARM" | "COLD" | "DISQUALIFIED";
export type LeadStatus =
  | "NEW"
  | "QUALIFYING"
  | "QUALIFIED"
  | "NURTURING"
  | "CONTACTED"
  | "CONVERTED"
  | "LOST";
export type AgentType = "customer-service" | "data-analyst" | "lead-qualifier" | "nurture";
export type Platform = "meta" | "google" | "tiktok" | "linkedin" | "ga4";

export interface Tenant {
  id: string;
  name: string;
  apiKey: string;
  domain: string;
  createdAt: Date;
  active: boolean;
}

export interface Lead {
  id: string;
  tenantId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  challenge: string;
  budget: string | null;
  volume: string | null;
  url: string | null;
  score: number | null;
  tier: LeadTier | null;
  status: LeadStatus;
  routingDecision: string | null;
  agentNotes: string | null;
  eventId: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentLog {
  id: string;
  leadId: string | null;
  agentType: AgentType;
  inputSummary: string;
  outputSummary: string;
  toolsUsed: string[];
  durationMs: number;
  modelUsed: string;
  createdAt: Date;
}

export interface ConversionEvent {
  id: string;
  tenantId: string | null;
  eventName: string;
  sessionId: string | null;
  userId: string | null;
  page: string | null;
  properties: Record<string, unknown>;
  createdAt: Date;
}

export interface NurtureSequence {
  id: string;
  leadId: string;
  templateId: string;
  scheduledAt: Date;
  sentAt: Date | null;
  opened: boolean;
  clicked: boolean;
  subject: string;
  status: "PENDING" | "SENT" | "FAILED";
}

/*
  SQL DE REFERENCIA — ejecutar en Neon tras activar drizzle-orm:

  CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    challenge TEXT NOT NULL,
    budget TEXT,
    volume TEXT,
    url TEXT,
    score INTEGER,
    tier TEXT CHECK (tier IN ('HOT','WARM','COLD','DISQUALIFIED')),
    status TEXT DEFAULT 'NEW',
    routing_decision TEXT,
    agent_notes TEXT,
    event_id TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    agent_type TEXT NOT NULL,
    input_summary TEXT,
    output_summary TEXT,
    tools_used TEXT[],
    duration_ms INTEGER,
    model_used TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    event_name TEXT NOT NULL,
    session_id TEXT,
    user_id TEXT,
    page TEXT,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE nurture_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    template_id TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    opened BOOLEAN DEFAULT false,
    clicked BOOLEAN DEFAULT false,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING'
  );
*/
