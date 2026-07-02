"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, Grid3x3, Zap, Target, Layers, TrendingUp, ChevronDown, Play
} from "lucide-react";
import TrackedCTA from "@/components/blocks/TrackedCTA";
import RelatedServices from "@/components/blocks/RelatedServices";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";

interface FaqItem { q: string; a: string; }
interface Props { faqs: FaqItem[]; }

// ─── Mouse-reactive hero grid ────────────────────────────────────────────────
function HeroGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const glowX = useTransform(mouseX, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(mouseY, [0, 1], ["20%", "80%"]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseX.set((e.clientX - r.left) / r.width);
      mouseY.set((e.clientY - r.top) / r.height);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(rgba(0,229,255,0.8) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,229,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: glowX, top: glowY,
          background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 65%)",
        }}
      />
      <div className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 65%)" }} />
    </div>
  );
}

// ─── Wireframe composition animation ─────────────────────────────────────────
function WireframeComposer() {
  const [step, setStep] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStep(s => s < 4 ? s + 1 : 4), 800);
    return () => clearInterval(id);
  }, [inView]);

  const hookText = "El hook es tu arma.";
  const variants = ["v01", "v05", "v12", "v24"];

  return (
    <div ref={ref} className="relative">
      {/* Hook typewriter */}
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
        <p className="text-sm font-mono text-slate-400 mb-4">
          <span className="text-marketnauta-primary">&gt;</span> Composing...
        </p>
        <div className="h-12 flex items-start">
          {hookText.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.04 }}
              className="text-xl font-bold text-white font-display"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Wireframe blocks */}
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={inView && step > i ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="h-4 bg-gradient-to-r from-marketnauta-primary/30 to-transparent rounded"
          />
        ))}
      </div>

      {/* Variant counter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView && step > 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <div className="inline-block px-4 py-2 rounded-lg bg-marketnauta-primary/10 border border-marketnauta-primary/30">
          <p className="text-xs font-mono text-marketnauta-primary uppercase tracking-widest">
            Variantes: {variants[Math.min(step - 1, 3)]}
          </p>
        </div>
      </motion.div>

      {/* Status */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView && step === 4 ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-6 text-xs font-mono text-emerald-400 uppercase tracking-widest text-center"
      >
        ✓ ENGINE: Ready
      </motion.p>
    </div>
  );
}

// ─── Framer animation variants ───────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function EstudioCreativoPageContent({ faqs }: Props) {
  const heroWords = ["Deja de", "decorar.", "Empieza", "a testear."];

  return (
    <div className="min-h-screen bg-abisal-950 overflow-x-hidden relative">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
        <HeroGrid />

        <Breadcrumbs
          fromLayer={6}
          items={[
            { label: "Inicio", href: "/", toLayer: 1 },
            { label: "Soluciones", href: "/#soluciones", toLayer: 1 },
            { label: "Estudio Creativo de Growth" },
          ]}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24 grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left col — copy */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-neon-short">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marketnauta-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-marketnauta-primary" />
              </span>
              <span className="text-[10px] text-marketnauta-primary uppercase tracking-[0.3em] font-mono font-bold">
                Creative Engine // CREAR · Capa 6
              </span>
            </motion.div>

            {/* H1 staggered */}
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter mb-8">
              {heroWords.map((word, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${i < 2 ? "title-gradient" : "text-white"}`}>
                  {i === 3
                    ? <span className="relative">{word}<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-60" /></span>
                    : word}
                </motion.span>
              ))}
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
              Diseñamos piezas publicitarias como <span className="text-white font-medium">variables de crecimiento</span>.
              Cada anuncio es una <span className="text-marketnauta-primary font-medium">hipótesis testeable</span>, producida
              a escala modular y medida <span className="text-white font-medium">server-side</span> para maximizar ROAS.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4">
              <TrackedCTA href="#metodo" eventName="activar_estudio_creativo" fromLayer={6}
                className="w-fit group inline-flex items-center gap-3 px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:shadow-neon-long transition-all duration-300 active:scale-95">
                Activar el estudio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </TrackedCTA>
              <TrackedCTA href="#faq" eventName="explorar_metodo" fromLayer={6}
                className="w-fit group inline-flex items-center gap-3 px-8 py-5 rounded-full border border-white/20 text-white font-bold text-lg hover:border-marketnauta-primary hover:text-marketnauta-primary transition-all duration-300">
                Ver el método
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </TrackedCTA>
            </motion.div>

            {/* KPI bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="mt-12 flex items-center gap-8 flex-wrap">
              {[
                { val: "3s", label: "Ventana de hook" },
                { val: "×20", label: "Variantes por concepto" },
                { val: "−32%", label: "CPA por iteración" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-display font-black text-white">{m.val}</p>
                  <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right col — wireframe composer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="relative group">
            <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"
              style={{ background: "radial-gradient(ellipse, rgba(0,229,255,0.2) 0%, transparent 70%)" }} />
            <div className="relative p-8 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60">
              <WireframeComposer />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 z-10">
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </div>

      {/* ── DIAGNÓSTICO ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="mb-16 pb-6 border-b border-white/[0.07]">
            <span className="terminal-badge mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
              Diagnóstico
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mt-4">
              ¿Tu creatividad frena el crecimiento?
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-12 gap-6">
            {[
              { col: "md:col-span-4", title: "Creatividad decorativa", desc: "Piezas 'lindas' que no detienen el scroll. Sin hook, no hay performance. El feed es competencia real." },
              { col: "md:col-span-4", title: "La única pieza ganadora", desc: "Vives de un solo creativo hasta que se fatiga. Sin variantes, el CPA se dispara. Dependencia creativa = riesgo." },
              { col: "md:col-span-4", title: "Producción lenta", desc: "Si producir toma semanas, no puedes testear. Sin volumen de aprendizaje, repites lo de siempre. Speed = data." },
            ].map((point, i) => (
              <motion.div key={i} variants={cardVariant}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`${point.col} p-6 md:p-8 glass-card rounded-3xl border border-white/5 bg-white/[0.01] cursor-default group`}>
                <div className="h-px w-12 bg-marketnauta-primary/50 mb-6 group-hover:w-full transition-all duration-700" />
                <h3 className="text-lg font-bold text-white tracking-tight mb-3">{point.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{point.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MÉTODO (CREAR_01-05) ──────────────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10" id="metodo">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-20">
            <span className="terminal-badge mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
              Método
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 title-gradient mt-4">
              El loop creativo de performance.
            </h2>
            <p className="text-slate-400 text-lg font-light">
              Cada etapa cierra un dato: hypothesis → test → learn → escala.
            </p>
          </motion.div>

          {/* CREAR_01-05 bloques */}
          <div className="space-y-6">
            {[
              {
                num: "CREAR_01",
                title: "INPUT",
                desc: "Partimos del dato del motor: audiencias, ángulos ganadores, LTV por segmento. El brief es un dashboard, no un documento.",
                icon: <Zap className="w-6 h-6" />
              },
              {
                num: "CREAR_02",
                title: "IDEAR",
                desc: "Hooks y ángulos por segmento. El ángulo correcto le gana a la pieza bonita. Generamos clusters: pain-based, curiosity-based, status-based.",
                icon: <Sparkles className="w-6 h-6" />
              },
              {
                num: "CREAR_03",
                title: "PRODUCIR",
                desc: "Sistema modular a escala: static, motion/Reels, UGC-style y carruseles. Templates parametrizadas que cambian copy/color/CTA en minutos.",
                icon: <Grid3x3 className="w-6 h-6" />
              },
              {
                num: "CREAR_04",
                title: "TESTEAR",
                desc: "Matriz hook × formato × oferta. Cada anuncio es una hipótesis; el test decide. Medición server-side de punta a punta.",
                icon: <Target className="w-6 h-6" />
              },
              {
                num: "CREAR_05",
                title: "LEER & ESCALAR",
                desc: "Escalamos las ganadoras, retiramos las fatigadas. El aprendizaje re-alimenta el INPUT. Loop cerrado, mejora continua.",
                icon: <TrendingUp className="w-6 h-6" />
              },
            ].map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-6 md:p-8 rounded-2xl glass-card border border-white/5 bg-white/[0.01] group hover:border-marketnauta-primary/30 transition-colors">
                <div className="flex items-start gap-6">
                  <div className="p-3 rounded-lg bg-marketnauta-primary/10 text-marketnauta-primary shrink-0 group-hover:bg-marketnauta-primary/20 transition">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest font-bold">{step.num}</span>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMATOS + KPIs ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="mb-16">
            <span className="terminal-badge mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
              Escalares
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mt-4 mb-8">
              Formatos y KPIs creativos.
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">

            {/* Panel Formatos */}
            <motion.div variants={cardVariant}
              className="md:col-span-7 p-8 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <h3 className="text-2xl font-display font-bold mb-6 text-white">Formatos de Producción</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">• Static Ads</div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">• Motion / Reels</div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">• UGC-style</div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">• Carruseles</div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">• Hero Systems</div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">• Email/WA Visuals</div>
                </div>
                <p className="mt-6 text-xs text-slate-500 font-mono">Todos parametrizables. Cambian en minutos, no semanas.</p>
              </div>
            </motion.div>

            {/* Panel KPIs */}
            <motion.div variants={cardVariant}
              className="md:col-span-5 p-8 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] group">
              <h3 className="text-2xl font-display font-bold mb-6 text-white">KPIs a Medir</h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span>Thumb-stop rate</span>
                  <span className="text-marketnauta-primary font-mono">3-5%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span>Hook rate (3s)</span>
                  <span className="text-marketnauta-primary font-mono">12-18%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span>CTR</span>
                  <span className="text-marketnauta-primary font-mono">2-4%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span>CVR</span>
                  <span className="text-marketnauta-primary font-mono">1-3%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span>Cost per result</span>
                  <span className="text-marketnauta-primary font-mono">S/. 8-15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ventana fatiga</span>
                  <span className="text-marketnauta-primary font-mono">30-45d</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10" id="faq">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="terminal-badge mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mt-4">
              Preguntas frecuentes.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl glass-card border border-white/5 bg-white/[0.01] cursor-pointer overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 md:p-8 list-none">
                  <h3 className="text-lg font-bold text-white group-open:text-marketnauta-primary transition-colors">
                    {faq.q}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 md:px-8 pb-6 md:pb-8 text-slate-400 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
              ¿Listo para convertir creatividad en crecimiento?
            </h2>
            <p className="text-lg text-slate-400 mb-12 leading-relaxed">
              Diseña anuncios como variables. Mide cada hipótesis. Escala las ganadoras.
            </p>
            <TrackedCTA href="?modal=creativo" eventName="iniciar_estudio_creativo" fromLayer={6}
              className="group inline-flex items-center gap-3 px-10 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:shadow-neon-long transition-all duration-300 active:scale-95">
              Iniciar el estudio creativo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </TrackedCTA>
          </motion.div>
        </div>
      </section>

      {/* ── CONTINÚA LA RUTA ──────────────────────────────────────────────── */}
      <RelatedServices step={6} />

      {/* ── FOOTER (reutilizable) ────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-white/[0.06] bg-abisal-950 text-center text-sm text-slate-600">
        <p>© 2025 Marketnauta. Inteligencia de Growth para Perú.</p>
      </footer>
    </div>
  );
}
