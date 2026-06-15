import type { Metadata } from "next";
import BentoMetrics from "@/components/dashboard/BentoMetrics";
import AgentStream from "@/components/dashboard/AgentStream";
import { Compass } from "lucide-react";

export const metadata: Metadata = { title: "Overview" };

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-marketnauta-primary" />
          <h1 className="text-white text-xl font-bold">Control Hub</h1>
        </div>
        <p className="text-slate-500 text-sm">Visión consolidada del ecosistema Marketnauta</p>
      </div>

      {/* MÉTRICAS */}
      <BentoMetrics />

      {/* GRID INFERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentStream />

        {/* QUICK ACTIONS */}
        <div className="bg-abisal-900/60 border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            {[
              { href: "/leads", label: "Ver leads pendientes de contacto", badge: "3 nuevos", color: "text-red-400" },
              { href: "/analytics", label: "Análisis semanal multi-plataforma", badge: "Listo", color: "text-emerald-400" },
              { href: "/agents", label: "Monitorear agentes en tiempo real", badge: "3 activos", color: "text-marketnauta-primary" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition-all group"
              >
                <span className="text-slate-400 group-hover:text-white text-sm transition-colors">{action.label}</span>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${action.color}`}>{action.badge}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
