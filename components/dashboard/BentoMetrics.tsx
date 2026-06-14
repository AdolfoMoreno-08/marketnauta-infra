"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Target, Zap } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  span?: "wide" | "normal";
}

const DEMO_METRICS: Metric[] = [
  { label: "Ingresos Atribuidos", value: "S/ 84,320", change: 18.4, changeLabel: "vs mes anterior", icon: DollarSign, color: "text-emerald-400", span: "wide" },
  { label: "Leads Calificados", value: "127", change: 34.2, changeLabel: "este mes", icon: Users, color: "text-marketnauta-primary" },
  { label: "ROAS Consolidado", value: "4.8x", change: -2.1, changeLabel: "vs mes anterior", icon: Target, color: "text-amber-400" },
  { label: "Costo por Lead", value: "S/ 48", change: -12.3, changeLabel: "optimización IA", icon: Zap, color: "text-violet-400" },
];

function TrendIcon({ change }: { change: number }) {
  if (change > 0) return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (change < 0) return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-slate-500" />;
}

export default function BentoMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {DEMO_METRICS.map((metric, i) => {
        const Icon = metric.icon;
        const isPositive = metric.change > 0;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className={`bg-abisal-900/60 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 ${
              metric.span === "wide" ? "col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon change={metric.change} />
                <span className={`text-xs font-mono ${isPositive ? "text-emerald-400" : metric.change < 0 ? "text-red-400" : "text-slate-500"}`}>
                  {isPositive ? "+" : ""}{metric.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{metric.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{metric.label}</p>
              <p className="text-[9px] font-mono text-slate-600 mt-1 uppercase tracking-widest">{metric.changeLabel}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
