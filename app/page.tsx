"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowRight, Compass, Activity, ShieldCheck } from "lucide-react";
import SolutionsGrid from "@/components/blocks/SolutionsGrid";
import Methodology from "@/components/blocks/Methodology";
import SuccessCases from "@/components/blocks/SuccessCases";
import PainSection from "@/components/blocks/PainSection";
import TelemetryWidget from "@/components/blocks/TelemetryWidget";
import ClaudeEngineSection from "@/components/blocks/ClaudeEngineSection";
import TrackedCTA from "@/components/blocks/TrackedCTA";

function MouseReactiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const glowX = useTransform(mouseX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(mouseY, [0, 1], ["20%", "80%"]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Static data grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Mouse-reactive glow — radial-gradient (sin filtro blur → coste GPU ~0) */}
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: glowX,
          top: glowY,
          background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 65%)",
        }}
      />
      {/* Static ambient glows — radial-gradient en vez de blur-[160px]/blur-[100px] */}
      <div
        className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,119,255,0.06) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)" }}
      />
    </div>
  );
}

export default function Home() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-abisal-950 overflow-x-hidden">

      {/* ═══ 1. HERO ════════════════════════════════════════════ */}
      <div className="relative min-h-[100svh] md:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20 md:pt-24">
        <MouseReactiveGrid />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10 w-full max-w-6xl"
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 md:mb-12 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-neon-short"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marketnauta-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-marketnauta-primary" />
            </span>
            <span className="text-[10px] text-marketnauta-primary uppercase tracking-[0.35em] font-mono font-bold">
              Sistema Operativo // Forense de Datos v2.0
            </span>
          </motion.div>

          {/* Main headline */}
          <h1 className="text-[2.6rem] sm:text-6xl md:text-[6.5rem] lg:text-[7.5rem] font-display font-bold leading-[1.05] tracking-tighter mb-8 md:mb-10">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="block text-white"
            >
              Deja de perder
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-marketnauta-primary via-marketnauta-primary to-marketnauta-secondary animate-flicker"
            >
              presupuesto.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8 }}
              className="block text-white/90"
            >
              Domina tus Datos.
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-slate-400 mb-10 md:mb-14 font-light leading-relaxed"
          >
            Construimos infraestructuras de{" "}
            <span className="text-white border-b border-marketnauta-primary/30">
              tracking, atribución y analytics
            </span>{" "}
            que convierten el ruido digital en{" "}
            <span className="text-marketnauta-primary font-mono">ventajas competitivas reales</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5"
          >
            <TrackedCTA
              href="?modal=auditoria"
              eventName="hero_primary_cta"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-base md:text-lg hover:shadow-neon-long transition-all duration-300 active:scale-95"
            >
              <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              Auditoría Gratuita
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </TrackedCTA>

            <a
              href="#dolor"
              onClick={(e) => scrollToSection(e, "dolor")}
              className="w-full sm:w-auto group px-8 py-4 md:px-10 md:py-5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-white font-medium hover:border-white/25 transition-all duration-300 text-center active:scale-95"
            >
              Ver el diagnóstico
            </a>
          </motion.div>

          {/* Metric bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-12 flex-wrap"
          >
            {[
              { val: "+340%", label: "ROAS promedio" },
              { val: "-45%", label: "CAC en 90 días" },
              { val: "100%", label: "datos recuperados" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-black text-white">
                  {m.val}
                </p>
                <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent"
          />
        </motion.div>
      </div>

      {/* ═══ 2. PAIN SECTION ════════════════════════════════════ */}
      <section id="dolor" className="scroll-mt-20">
        <PainSection />
      </section>

      {/* ═══ 3. TELEMETRY WIDGET ════════════════════════════════ */}
      <section id="calculadora" className="scroll-mt-20 border-t border-white/[0.04]">
        <TelemetryWidget />
      </section>

      {/* ═══ 4. CLAUDE ENGINE ═══════════════════════════════════ */}
      <section id="motor-claude" className="scroll-mt-20">
        <ClaudeEngineSection />
      </section>

      {/* ═══ 5. SOLUCIONES ══════════════════════════════════════ */}
      <section id="soluciones" className="scroll-mt-20 border-t border-white/[0.04] py-4 md:py-12">
        <SolutionsGrid />
      </section>

      {/* ═══ 6. METODOLOGÍA ═════════════════════════════════════ */}
      <section id="metodologia" className="scroll-mt-20 border-t border-white/[0.04] py-4 md:py-12">
        <Methodology />
      </section>

      {/* ═══ 7. CASOS DE ÉXITO ══════════════════════════════════ */}
      <section id="casos-exito" className="scroll-mt-20 border-t border-white/[0.04] py-10 md:py-12">
        <SuccessCases />
      </section>

      {/* ═══ 8. CTA FINAL ═══════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 relative border-t border-white/[0.04] bg-abisal-900/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 65%)" }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <span className="terminal-badge mb-8 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
            Listo para comenzar
          </span>

          <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight mt-4">
            ¿Listo para dejar <br />
            <span className="text-slate-500">de adivinar?</span>
          </h2>

          <p className="text-base md:text-xl text-slate-400 mb-12 max-w-xl mx-auto font-light">
            Nuestro equipo de ingeniería trazará tu ruta de crecimiento basada en evidencia
            técnica y datos reales.
          </p>

          <TrackedCTA
            href="?modal=auditoria"
            eventName="home_footer_auditoria_tactica"
            className="inline-flex items-center gap-4 px-10 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-lg md:text-xl hover:shadow-neon-long transition-all duration-300 active:scale-95 shadow-neon-short group"
          >
            <Compass className="w-6 h-6 group-hover:rotate-90 transition-transform duration-700" />
            AUDITORÍA TÁCTICA GRATUITA
          </TrackedCTA>

          <div className="mt-12 flex items-center justify-center gap-8 opacity-20">
            <ShieldCheck className="w-6 h-6 text-white" />
            <Activity className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
