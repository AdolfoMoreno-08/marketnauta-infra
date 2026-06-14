"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Activity, CheckCircle2, Loader2, Terminal } from "lucide-react";

type EventType = "thinking" | "tool_call" | "tool_result" | "complete" | "error";

interface StreamEvent {
  id: string;
  type: EventType;
  agent: string;
  message: string;
  timestamp: Date;
}

const AGENT_COLORS: Record<string, string> = {
  "Asistente": "text-marketnauta-primary",
  "Analista": "text-violet-400",
  "Calificador": "text-amber-400",
};

const EVENT_ICONS: Record<EventType, React.ElementType> = {
  thinking: Loader2,
  tool_call: Terminal,
  tool_result: CheckCircle2,
  complete: CheckCircle2,
  error: Activity,
};

const EVENT_COLORS: Record<EventType, string> = {
  thinking: "text-slate-500",
  tool_call: "text-marketnauta-primary",
  tool_result: "text-emerald-400",
  complete: "text-emerald-400",
  error: "text-red-400",
};

const DEMO_EVENTS: StreamEvent[] = [
  { id: "1", type: "thinking", agent: "Analista", message: "Procesando solicitud de análisis multi-plataforma...", timestamp: new Date(Date.now() - 120000) },
  { id: "2", type: "tool_call", agent: "Analista", message: "query_google_analytics(last_30_days, sessions, conversions)", timestamp: new Date(Date.now() - 110000) },
  { id: "3", type: "tool_result", agent: "Analista", message: "GA4: 12,847 sesiones · 89 conversiones · Tasa 0.69%", timestamp: new Date(Date.now() - 105000) },
  { id: "4", type: "tool_call", agent: "Analista", message: "query_meta_ads(last_30_days, campaign, impressions, roas)", timestamp: new Date(Date.now() - 98000) },
  { id: "5", type: "tool_result", agent: "Analista", message: "Meta: 284,120 impresiones · ROAS 3.2x · CPL S/62", timestamp: new Date(Date.now() - 90000) },
  { id: "6", type: "complete", agent: "Analista", message: "Reporte generado: oportunidad de optimización en Meta TOF", timestamp: new Date(Date.now() - 82000) },
  { id: "7", type: "thinking", agent: "Calificador", message: "Evaluando lead entrante: Empresa XYZ S.A.C.", timestamp: new Date(Date.now() - 45000) },
  { id: "8", type: "tool_call", agent: "Calificador", message: "score_and_route(budget=10000, challenge=attribution, company_size=medium)", timestamp: new Date(Date.now() - 38000) },
  { id: "9", type: "complete", agent: "Calificador", message: "Lead calificado: HOT (87pts) → DEMO_CALL_PRIORITY", timestamp: new Date(Date.now() - 30000) },
  { id: "10", type: "thinking", agent: "Asistente", message: "Conversación activa — usuario consultando sobre auditoría", timestamp: new Date(Date.now() - 8000) },
];

function formatRelativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  return `hace ${Math.floor(diff / 3600)}h`;
}

export default function AgentStream() {
  const [events, setEvents] = useState<StreamEvent[]>(DEMO_EVENTS);
  const [, setTick] = useState(0);

  // Actualizar timestamps cada 30s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // Simular evento nuevo cada 25s
  useEffect(() => {
    const interval = setInterval(() => {
      const agentKeys = Object.keys(AGENT_COLORS);
      const agent = agentKeys[Math.floor(Math.random() * agentKeys.length)];
      const newEvent: StreamEvent = {
        id: `live_${Date.now()}`,
        type: "thinking",
        agent,
        message: agent === "Asistente"
          ? "Nueva conversación iniciada — usuario en contacto"
          : agent === "Calificador"
          ? "Procesando lead en cola..."
          : "Consultando plataforma publicitaria...",
        timestamp: new Date(),
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 20));
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-abisal-900/60 border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-abisal-950/40">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-marketnauta-primary" />
          <span className="text-white text-sm font-bold">Stream de Agentes IA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* EVENTS */}
      <div className="divide-y divide-white/[0.03] max-h-[380px] overflow-y-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {events.map((event) => {
            const Icon = EVENT_ICONS[event.type];
            const agentColor = AGENT_COLORS[event.agent] ?? "text-slate-400";
            const eventColor = EVENT_COLORS[event.type];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className={`w-3.5 h-3.5 ${eventColor} ${event.type === "thinking" ? "animate-spin" : ""}`} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="flex items-center gap-1">
                      <Bot className={`w-2.5 h-2.5 ${agentColor}`} />
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${agentColor}`}>{event.agent}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-700">{formatRelativeTime(event.timestamp)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed truncate">{event.message}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
