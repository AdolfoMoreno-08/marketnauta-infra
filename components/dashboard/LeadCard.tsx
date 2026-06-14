"use client";

import { motion } from "framer-motion";
import { Flame, Thermometer, Snowflake, AlertTriangle, Building2, Phone, Mail, Clock } from "lucide-react";

export type LeadTier = "HOT" | "WARM" | "COLD" | "DISQUALIFIED";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  score: number;
  tier: LeadTier;
  routingDecision: string;
  salesNote?: string;
  estimatedDealValue?: number;
  urgencySignal?: string;
  createdAt: Date;
}

const TIER_CONFIG: Record<LeadTier, { label: string; icon: React.ElementType; color: string; bg: string; border: string; glow: string }> = {
  HOT:          { label: "HOT",          icon: Flame,        color: "text-red-400",    bg: "bg-red-500/10",     border: "border-red-500/30",    glow: "shadow-red-500/20" },
  WARM:         { label: "WARM",         icon: Thermometer,  color: "text-amber-400",  bg: "bg-amber-500/10",   border: "border-amber-500/30",  glow: "shadow-amber-500/20" },
  COLD:         { label: "COLD",         icon: Snowflake,    color: "text-blue-400",   bg: "bg-blue-500/10",    border: "border-blue-500/30",   glow: "shadow-blue-500/20" },
  DISQUALIFIED: { label: "DESCALIFICADO", icon: AlertTriangle, color: "text-slate-500", bg: "bg-slate-500/10",  border: "border-slate-500/20",  glow: "" },
};

function ScoreGauge({ score, tier }: { score: number; tier: LeadTier }) {
  const config = TIER_CONFIG[tier];
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor = tier === "HOT" ? "#f87171" : tier === "WARM" ? "#fbbf24" : tier === "COLD" ? "#60a5fa" : "#475569";

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <motion.circle
          cx="24" cy="24" r="22"
          fill="none" stroke={strokeColor} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-bold ${config.color}`}>{score}</span>
      </div>
    </div>
  );
}

export default function LeadCard({ lead, index = 0 }: { lead: Lead; index?: number }) {
  const config = TIER_CONFIG[lead.tier];
  const TierIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`bg-abisal-900/60 border ${config.border} rounded-2xl p-4 flex gap-4 items-start shadow-lg ${config.glow}`}
    >
      <ScoreGauge score={lead.score} tier={lead.tier} />

      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-white font-semibold text-sm truncate">{lead.name}</p>
            {lead.company && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Building2 className="w-2.5 h-2.5" />
                {lead.company}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} border ${config.border} flex-shrink-0`}>
            <TierIcon className={`w-2.5 h-2.5 ${config.color}`} />
            <span className={`text-[9px] font-mono font-bold ${config.color} uppercase tracking-wider`}>{config.label}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
          {lead.phone && (
            <span className="flex items-center gap-1 text-[10px] text-slate-600">
              <Phone className="w-2.5 h-2.5" /> {lead.phone}
            </span>
          )}
          {lead.email && (
            <span className="flex items-center gap-1 text-[10px] text-slate-600 truncate max-w-[160px]">
              <Mail className="w-2.5 h-2.5" /> {lead.email}
            </span>
          )}
        </div>

        {lead.salesNote && (
          <p className="text-[10px] text-slate-500 italic border-l border-white/10 pl-2 line-clamp-2">{lead.salesNote}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          {lead.estimatedDealValue && (
            <span className="text-[10px] font-mono text-emerald-400">~S/ {lead.estimatedDealValue.toLocaleString()}</span>
          )}
          <span className="flex items-center gap-1 text-[9px] text-slate-700 font-mono ml-auto">
            <Clock className="w-2.5 h-2.5" />
            {lead.createdAt.toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
