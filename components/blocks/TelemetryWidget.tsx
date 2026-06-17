"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";
import TrackedCTA from "./TrackedCTA";
import { pushToDataLayer, newEventId } from "@/lib/gtm";

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default function TelemetryWidget() {
  const [monthlySpend, setMonthlySpend] = useState(15000);
  const [attrLoss, setAttrLoss] = useState(35);

  const lostMonthly = useMemo(
    () => Math.round(monthlySpend * (attrLoss / 100)),
    [monthlySpend, attrLoss]
  );
  const lostAnnually = lostMonthly * 12;
  const recoverable = Math.round(lostMonthly * 0.72);

  // calculator_used (zero-party): se dispara tras interacción del usuario,
  // con debounce, para capturar inversión/fuga estimada sin spamear eventos.
  const interacted = useRef(false);
  useEffect(() => {
    if (!interacted.current) { interacted.current = true; return; }
    const t = setTimeout(() => {
      pushToDataLayer({
        event: "calculator_used",
        event_id: newEventId(),
        calc_spend: monthlySpend,
        calc_loss: lostMonthly,
        calc_recoverable: recoverable,
        attr_loss_pct: attrLoss,
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [monthlySpend, attrLoss, lostMonthly, recoverable]);

  return (
    <section className="relative py-24 md:py-32 px-6">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,119,255,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="terminal-badge mb-6 inline-flex">
            <Calculator className="w-3 h-3" />
            Calculadora de Pérdida de Atribución
          </span>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mt-4 mb-4">
            ¿Cuánto estás{" "}
            <span className="text-marketnauta-primary text-glow-cyan">perdiendo</span>{" "}
            ahora mismo?
          </h2>

          <p className="text-slate-400 text-lg font-light">
            Mueve los controles y observa el impacto real en tu negocio.
          </p>
        </motion.div>

        {/* Widget Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-card rounded-3xl p-8 md:p-12 border border-white/[0.06] scan-line-overlay"
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left: Sliders */}
            <div className="space-y-10">
              {/* Slider 1: Monthly Spend */}
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <label className="text-slate-300 font-medium text-sm">
                    Inversión mensual en pauta
                  </label>
                  <span className="text-marketnauta-primary font-mono font-bold text-lg">
                    {formatCurrency(monthlySpend)}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={1000}
                    max={200000}
                    step={1000}
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="telemetry-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00E5FF ${((monthlySpend - 1000) / 199000) * 100}%, rgba(255,255,255,0.1) 0%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono">
                  <span>$1K</span>
                  <span>$200K</span>
                </div>
              </div>

              {/* Slider 2: Attribution Loss */}
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <label className="text-slate-300 font-medium text-sm">
                    Pérdida de atribución estimada
                  </label>
                  <span className="text-marketnauta-orange font-mono font-bold text-lg">
                    {attrLoss}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={1}
                    value={attrLoss}
                    onChange={(e) => setAttrLoss(Number(e.target.value))}
                    className="telemetry-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FF6B35 ${((attrLoss - 5) / 75) * 100}%, rgba(255,255,255,0.1) 0%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono">
                  <span>5%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Context note */}
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                * Promedio de pérdida post-iOS 14 para cuentas sin Server-Side Tracking: 28–45%.
                Sectores e-commerce reportan hasta 60%.
              </p>
            </div>

            {/* Right: Results */}
            <div className="space-y-5">
              {/* Metric: Monthly loss */}
              <motion.div
                key={lostMonthly}
                initial={{ scale: 0.97, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,107,53,0.07)",
                  border: "1px solid rgba(255,107,53,0.2)",
                }}
              >
                <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">
                  Pérdida mensual
                </p>
                <p className="text-4xl font-display font-black text-marketnauta-orange text-glow-orange">
                  {formatCurrency(lostMonthly)}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  presupuesto mal atribuido o desperdiciado
                </p>
              </motion.div>

              {/* Metric: Annual loss */}
              <motion.div
                key={lostAnnually}
                initial={{ scale: 0.97, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">
                  Proyección anual
                </p>
                <p className="text-3xl font-display font-black text-red-400">
                  {formatCurrency(lostAnnually)}
                </p>
                <p className="text-xs text-slate-500 mt-1">en 12 meses sin optimización</p>
              </motion.div>

              {/* Metric: Recoverable */}
              <motion.div
                key={recoverable}
                initial={{ scale: 0.97, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(0,229,255,0.05)",
                  border: "1px solid rgba(0,229,255,0.2)",
                }}
              >
                <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-2">
                  Recuperable con SST + BigQuery
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-display font-black text-marketnauta-primary text-glow-cyan">
                    {formatCurrency(recoverable)}
                  </p>
                  <span className="text-sm text-slate-400 font-mono">/mes</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #00E5FF, #0077FF)" }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">72% de recuperación estimada</p>
              </motion.div>

              {/* CTA */}
              <TrackedCTA
                href="?modal=auditoria"
                eventName="telemetry_widget_cta"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-abisal-950 bg-marketnauta-primary hover:shadow-neon-long transition-all duration-300 group"
              >
                <TrendingUp className="w-5 h-5" />
                Recuperar {formatCurrency(recoverable)}/mes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </TrackedCTA>
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .telemetry-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0,229,255,0.5);
          border: 2px solid rgba(0,229,255,0.6);
        }
        .telemetry-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid rgba(0,229,255,0.6);
        }
      ` }} />
    </section>
  );
}
