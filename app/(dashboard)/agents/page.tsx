import type { Metadata } from "next";
import AgentStream from "@/components/dashboard/AgentStream";
import { Bot, MessageCircle, BarChart3, Star, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Agentes IA" };

const AGENT_CARDS = [
  {
    name: "Bot de Atención al Cliente",
    model: "claude-haiku-4-5",
    endpoint: "POST /api/agents/chat",
    icon: MessageCircle,
    color: "text-marketnauta-primary",
    border: "border-marketnauta-primary/20",
    bg: "bg-marketnauta-primary/5",
    stats: [
      { label: "Conversaciones hoy", value: "24" },
      { label: "Leads creados", value: "7" },
      { label: "Tasa conversión", value: "29%" },
    ],
    tools: ["get_service_details", "create_lead", "schedule_callback", "get_success_cases"],
    status: "online",
  },
  {
    name: "Motor de Análisis de Datos",
    model: "claude-sonnet-4-6",
    endpoint: "POST /api/agents/analyze",
    icon: BarChart3,
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    stats: [
      { label: "Consultas hoy", value: "8" },
      { label: "Plataformas activas", value: "5" },
      { label: "Reportes generados", value: "3" },
    ],
    tools: ["query_google_analytics", "query_google_ads", "query_meta_ads", "query_tiktok_ads", "query_linkedin_ads", "compare_platforms", "generate_report"],
    status: "online",
  },
  {
    name: "Calificador de Leads",
    model: "claude-haiku-4-5",
    endpoint: "POST /api/agents/qualify",
    icon: Star,
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    stats: [
      { label: "Leads calificados hoy", value: "12" },
      { label: "HOT detectados", value: "4" },
      { label: "Precisión promedio", value: "91%" },
    ],
    tools: ["score_and_route", "flag_for_review"],
    status: "online",
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-5 h-5 text-marketnauta-primary" />
          <h1 className="text-white text-xl font-bold">Agentes IA</h1>
        </div>
        <p className="text-slate-500 text-sm">Monitoreo y configuración de los agentes Marketnauta Intelligence del ecosistema</p>
      </div>

      {/* AGENT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {AGENT_CARDS.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.name} className={`${agent.bg} border ${agent.border} rounded-2xl p-5 flex flex-col gap-4`}>
              {/* HEAD */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${agent.bg} border ${agent.border} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${agent.color}`} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{agent.name}</p>
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{agent.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">online</span>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-2">
                {agent.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className={`text-lg font-bold ${agent.color}`}>{stat.value}</p>
                    <p className="text-[8px] text-slate-600 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* TOOLS */}
              <div>
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2">Tools disponibles</p>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((tool) => (
                    <span key={tool} className="text-[8px] font-mono bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full text-slate-500">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* ENDPOINT */}
              <div className="border-t border-white/[0.05] pt-3">
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1">Endpoint</p>
                <code className="text-[10px] font-mono text-slate-500">{agent.endpoint}</code>
              </div>
            </div>
          );
        })}
      </div>

      {/* STREAM */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-slate-500" />
          <h2 className="text-white font-bold text-sm">Actividad en Tiempo Real</h2>
        </div>
        <AgentStream />
      </div>
    </div>
  );
}
