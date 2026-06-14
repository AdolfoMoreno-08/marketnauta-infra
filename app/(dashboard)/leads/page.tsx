import type { Metadata } from "next";
import LeadCard from "@/components/dashboard/LeadCard";
import type { Lead } from "@/components/dashboard/LeadCard";
import { Users, Filter } from "lucide-react";

export const metadata: Metadata = { title: "Leads & CRM" };

const DEMO_LEADS: Lead[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    company: "RetailPeru S.A.C.",
    email: "carlos@retailperu.com",
    phone: "+51 987 654 321",
    score: 92,
    tier: "HOT",
    routingDecision: "DEMO_CALL_PRIORITY",
    salesNote: "E-commerce con 50k USD/mes en pauta. Problema de atribución multi-touch urgente antes del Hot Sale.",
    estimatedDealValue: 8500,
    urgencySignal: "Hot Sale en 3 semanas",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "María Santos",
    company: "Clínica Bienestar",
    email: "m.santos@bienestar.pe",
    phone: "+51 998 112 233",
    score: 74,
    tier: "WARM",
    routingDecision: "EMAIL_SEQUENCE_B",
    salesNote: "Clínica con 3 sedes. Quiere unificar data de Meta y Google. Presupuesto confirmado Q3.",
    estimatedDealValue: 4200,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Jorge Quispe",
    company: "Constructora JQ",
    phone: "+51 945 678 901",
    score: 45,
    tier: "COLD",
    routingDecision: "NURTURE_SEQUENCE_30DAYS",
    salesNote: "Empresa familiar. Aún explorando si necesita analítica. Seguimiento en 30 días.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Ana Huamán",
    company: "Consultora AH",
    email: "ana@consultora-ah.com",
    phone: "+51 912 345 678",
    score: 88,
    tier: "HOT",
    routingDecision: "DEMO_CALL_PRIORITY",
    salesNote: "Agencia que quiere replicar el sistema de Marketnauta para sus propios clientes. Alto potencial de nodo satélite.",
    estimatedDealValue: 12000,
    urgencySignal: "Propuesta a su cliente el lunes",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "5",
    name: "Pedro Rojas",
    company: undefined,
    phone: "+51 956 789 012",
    score: 18,
    tier: "DISQUALIFIED",
    routingDecision: "ARCHIVE",
    salesNote: "Sin empresa, sin presupuesto definido. Freelancer buscando herramienta gratuita.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const TIER_COUNTS = {
  HOT: DEMO_LEADS.filter((l) => l.tier === "HOT").length,
  WARM: DEMO_LEADS.filter((l) => l.tier === "WARM").length,
  COLD: DEMO_LEADS.filter((l) => l.tier === "COLD").length,
};

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-marketnauta-primary" />
            <h1 className="text-white text-xl font-bold">Leads & CRM</h1>
          </div>
          <p className="text-slate-500 text-sm">Pipeline calificado por IA — {DEMO_LEADS.length} leads activos</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm">
          <Filter className="w-3.5 h-3.5" />
          Filtrar
        </button>
      </div>

      {/* TIER SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        {([["HOT", "text-red-400", "bg-red-500/10 border-red-500/30"], ["WARM", "text-amber-400", "bg-amber-500/10 border-amber-500/30"], ["COLD", "text-blue-400", "bg-blue-500/10 border-blue-500/30"]] as const).map(([tier, color, bg]) => (
          <div key={tier} className={`${bg} border rounded-xl px-4 py-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{TIER_COUNTS[tier]}</p>
            <p className={`text-[9px] font-mono uppercase tracking-widest ${color} opacity-70`}>{tier}</p>
          </div>
        ))}
      </div>

      {/* LEAD LIST */}
      <div className="space-y-3">
        {DEMO_LEADS.map((lead, i) => (
          <LeadCard key={lead.id} lead={lead} index={i} />
        ))}
      </div>
    </div>
  );
}
