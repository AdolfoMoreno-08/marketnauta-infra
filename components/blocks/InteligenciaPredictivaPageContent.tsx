"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
    Sparkles, TrendingDown, Users, Tag, ArrowRight, Brain
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts";
import Link from "next/link";
import TrackedCTA from "@/components/blocks/TrackedCTA";
import RelatedServices from "@/components/blocks/RelatedServices";

interface FaqItem { q: string; a: string; }
interface Props { faqs: FaqItem[]; }

// ─── Prediction dashboard chart ─────────────────────────────────────────────
const predData = [
    { semana: "W1", recompra: 72, neutro: 55, churn: 28 },
    { semana: "W2", recompra: 76, neutro: 60, churn: 22 },
    { semana: "W3", recompra: 81, neutro: 57, churn: 18 },
    { semana: "W4", recompra: 85, neutro: 62, churn: 14 },
    { semana: "W5", recompra: 88, neutro: 58, churn: 11 },
    { semana: "W6", recompra: 91, neutro: 63, churn: 8 },
];

function PredictionDashboard() {
    const [mounted, setMounted] = useState(false);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return <div className="min-h-[340px]" />;

    return (
        <div className="glass-card rounded-[2rem] border border-white/10 bg-abisal-900/90 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        <div className="w-2.5 h-2.5 rounded-full bg-marketnauta-primary animate-pulse" />
                    </div>
                    <span className="ml-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Churn_Prediction_Model.py
                    </span>
                </div>
                <div className="px-2 py-1 rounded bg-marketnauta-primary/5 border border-marketnauta-primary/20">
                    <span className="text-marketnauta-primary font-mono text-[10px] font-bold">87.4% accuracy</span>
                </div>
            </div>

            <div className="p-6 pb-2" ref={ref}>
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={inView ? predData : []} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="recompraGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="neutroGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="semana" axisLine={false} tickLine={false}
                                tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} dy={6} />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                cursor={{ stroke: "rgba(0,229,255,0.3)", strokeWidth: 1 }}
                                contentStyle={{ backgroundColor: "#030712", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px", color: "#fff" }}
                                itemStyle={{ color: "#00E5FF" }}
                            />
                            <Area type="monotone" dataKey="churn" fill="url(#churnGrad)"
                                stroke="#f87171" strokeWidth={1.5} animationDuration={1800} />
                            <Area type="monotone" dataKey="neutro" fill="url(#neutroGrad)"
                                stroke="#94a3b8" strokeWidth={1.5} animationDuration={1600} />
                            <Area type="monotone" dataKey="recompra" fill="url(#recompraGrad)"
                                stroke="#00E5FF" strokeWidth={2} animationDuration={1400} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="px-6 pb-5 grid grid-cols-3 gap-3">
                {[
                    { v: "RECOMPRA", l: "Señal alta", c: "text-marketnauta-primary" },
                    { v: "NEUTRO",   l: "Señal media", c: "text-slate-400" },
                    { v: "CHURN",   l: "Señal de fuga", c: "text-red-400" },
                ].map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                        <p className={`text-sm font-bold font-mono ${m.c}`}>{m.v}</p>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">{m.l}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Framer variants ────────────────────────────────────────────────────────
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

// ─── Main component ─────────────────────────────────────────────────────────
export default function InteligenciaPredictivaPageContent({ faqs }: Props) {

    const heroLines = ["Deja de reaccionar.", "Empieza a anticipar."];

    return (
        <div className="min-h-screen bg-abisal-950 overflow-x-hidden relative">

            {/* ── PAGE BACKGROUND ───────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-marketnauta-primary/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-marketnauta-secondary/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }} />
            </div>

            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-24 px-6 z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">

                    {/* Scan line decorativa */}
                    <motion.div
                        animate={{ y: [0, 500, 0], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-marketnauta-primary/50 to-transparent pointer-events-none hidden lg:block"
                    />

                    {/* Left col */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Badge — alineado al patrón del sitio */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-marketnauta-primary/5 border border-marketnauta-primary/20 text-marketnauta-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-8"
                        >
                            <Brain className="w-3 h-3 text-marketnauta-primary animate-pulse" />
                            Prediction Engine // ANTICIPAR · Capa 4
                        </motion.div>

                        {/* H1 con stagger — patrón title-gradient + text-white del sitio */}
                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter mb-8">
                            {heroLines.map((line, i) => (
                                <motion.span key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 + i * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className="block"
                                >
                                    {i === 0
                                        ? <span className="title-gradient">{line}</span>
                                        : <span className="text-white relative">
                                            {line}
                                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-50" />
                                          </span>
                                    }
                                </motion.span>
                            ))}
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.95, duration: 0.8 }}
                            className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl"
                        >
                            La capa de mayor margen y la más difícil de copiar: requiere el dato que ya
                            administramos para ti. Sobre tu información en{" "}
                            <span className="text-white font-medium">BigQuery</span> construimos modelos que
                            predicen recompra, churn y el siguiente producto —convirtiendo datos en
                            decisiones, no en reportes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <TrackedCTA
                                href="?modal=auditoria"
                                eventName="hero_predictiva_cta"
                                className="group px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 w-fit"
                            >
                                Explorar modelos predictivos
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </TrackedCTA>
                        </motion.div>
                    </motion.div>

                    {/* Right col — chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotateY: -10, rotateX: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: -5, rotateX: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="relative group perspective-1000"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-marketnauta-primary/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                        <div className="relative transform transition-transform duration-700">
                            <PredictionDashboard />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS STRIP ───────────────────────────────────────────────── */}
            <section className="py-12 px-6 relative z-10 border-y border-white/[0.06]">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp}
                        className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]"
                    >
                        {[
                            { val: "87.4%",    label: "Precisión del modelo de churn" },
                            { val: "2.3×",     label: "Incremento de ticket con recomendadores IA" },
                            { val: "<30 días", label: "Tiempo al primer modelo calibrado" },
                        ].map((s) => (
                            <div key={s.label} className="py-8 px-10 text-center">
                                <p className="text-4xl md:text-5xl font-display font-black text-white mb-2">{s.val}</p>
                                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── PAIN POINTS ───────────────────────────────────────────────── */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="mb-16 pb-6 border-b border-white/[0.07]">
                        <span className="terminal-badge mb-4 inline-flex">
                            <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                            Diagnóstico
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mt-4">
                            ¿Reaccionas cuando ya es tarde?
                        </h2>
                    </motion.div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="grid md:grid-cols-12 gap-6">
                        {[
                            { col: "md:col-span-4", title: "Reaccionas cuando el cliente ya se fue", desc: "El churn no aparece en el CRM hasta que el cliente dejó de comprar. Para entonces, el costo de reactivación es 5× mayor que el de retención." },
                            { col: "md:col-span-5", title: "Audiencias genéricas, campañas ineficientes", desc: "Sin clustering real de comportamiento, las campañas llegan a quien menos las necesita y se pierden en quien más las convertiría." },
                            { col: "md:col-span-3", title: "Precios fijos en mercado dinámico", desc: "El Black Friday peruano exige precios en tiempo real. Los precios estáticos dejan margen sobre la mesa en los picos de mayor demanda." },
                        ].map((point, i) => (
                            <motion.div key={i} variants={cardVariant}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={`${point.col} p-6 md:p-8 glass-card rounded-3xl border border-white/5 bg-white/[0.01] cursor-default group`}>
                                <div className="h-px w-12 bg-marketnauta-primary/50 mb-6 group-hover:w-full transition-all duration-700" />
                                <h3 className="text-xl font-bold text-white tracking-tight mb-3">{point.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{point.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURES BENTO ────────────────────────────────────────────── */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-20">
                        <span className="terminal-badge mb-6 inline-flex">
                            <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                            Stack predictivo
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 title-gradient mt-4">
                            Predice, Segmenta y Actúa.
                        </h2>
                        <p className="text-slate-400 text-lg font-light">
                            Tu dato propio en BigQuery como motor de inteligencia competitiva.
                        </p>
                    </motion.div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">

                        {/* ANTICIPAR_01 — Recomendadores IA (large) */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-8 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 relative overflow-hidden group flex flex-col md:flex-row items-center gap-10">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="flex-1 relative z-10">
                                <Sparkles className="w-8 h-8 text-marketnauta-primary mb-5" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">ANTICIPAR_01 // Core</span>
                                <h3 className="text-2xl font-display font-bold mb-4 text-white">Recomendadores con IA</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Modelos que aprenden del comportamiento real de tus compradores para sugerir el siguiente producto correcto, en la web y en campañas. Cross-sell y up-sell automático sobre el dato de{" "}
                                    <Link href="/soluciones/activacion-y-retencion"
                                        data-evt="internal_link_click" data-from-layer={4} data-to-layer={3} data-link-position="content"
                                        className="text-marketnauta-primary underline-offset-4 hover:underline">la capa de Activación</Link>.
                                </p>
                            </div>
                            <div className="w-full md:w-40 shrink-0 grid gap-3 relative z-10">
                                <div className="p-4 glass-card rounded-2xl text-center border border-marketnauta-primary/20">
                                    <p className="text-3xl font-bold text-white font-mono">2.3×</p>
                                    <p className="text-[9px] text-marketnauta-primary uppercase tracking-widest font-mono mt-1">Ticket Prom.</p>
                                </div>
                                <div className="p-4 glass-card rounded-2xl text-center border border-white/5">
                                    <p className="text-2xl font-bold text-white font-mono">AI</p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">Sobre tu dato</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ANTICIPAR_02 — Churn & Recompra */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-4 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent group">
                            <TrendingDown className="w-8 h-8 text-white/40 group-hover:text-marketnauta-primary transition-colors duration-300 mb-5" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">ANTICIPAR_02</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Churn & Recompra</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Scoring de probabilidad de fuga y recompra. Priorizamos la retención donde más vale: el equipo actúa antes de perder al cliente.</p>
                            <div className="mt-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-mono text-emerald-400">87.4% precisión</span>
                            </div>
                        </motion.div>

                        {/* ANTICIPAR_03 — Clustering */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] group">
                            <Users className="w-8 h-8 text-white/40 group-hover:text-marketnauta-primary transition-colors duration-300 mb-5" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">ANTICIPAR_03</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Segmentación por Clustering</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Audiencias reales agrupadas por patrón de compra, no por demografía genérica. Insumo directo para campañas y CRM hiperdirigidos que convierten más con menos presupuesto.</p>
                        </motion.div>

                        {/* ANTICIPAR_04 — Price intelligence */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-7 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/10 bg-abisal-900/60 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-[0.025]" style={{
                                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: "40px 40px",
                            }} />
                            <div className="relative z-10">
                                <Tag className="w-8 h-8 text-marketnauta-primary mb-5" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">ANTICIPAR_04 // Pricing</span>
                                <h3 className="text-3xl font-display font-bold mb-4 text-white">Inteligencia Competitiva y de Precios</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">
                                    Pricing dinámico para el Black Friday peruano y picos de demanda. Monitoreamos competencia y recomendamos precios por producto según estacionalidad, para escalar margen con el{" "}
                                    <Link href="/soluciones/gestion-de-pauta"
                                        data-evt="internal_link_click" data-from-layer={4} data-to-layer={5} data-link-position="content"
                                        className="text-marketnauta-primary underline-offset-4 hover:underline">Motor de Performance</Link>.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["BigQuery ML", "Vertex AI", "Python / dbt"].map(t => (
                                        <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────────── */}
            <section className="py-16 px-6 relative z-10 max-w-3xl mx-auto" aria-label="Preguntas frecuentes">
                <motion.div {...fadeUp}>
                    <span className="terminal-badge mb-6 inline-flex">
                        <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                        FAQ
                    </span>
                    <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-10 tracking-tight mt-4">
                        Preguntas frecuentes
                    </h2>
                </motion.div>
                <div className="space-y-4">
                    {faqs.map((f, i) => (
                        <motion.details key={f.q}
                            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/10 transition-colors">
                            <summary className="cursor-pointer text-white font-medium text-base list-none flex justify-between gap-4">
                                {f.q}
                                <span className="text-marketnauta-primary group-open:rotate-45 transition-transform shrink-0">+</span>
                            </summary>
                            <p className="text-slate-400 text-sm font-light leading-relaxed mt-3">{f.a}</p>
                        </motion.details>
                    ))}
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────────── */}
            <section className="py-32 px-6 relative z-10 flex justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} className="max-w-4xl text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-marketnauta-primary/20 blur-[100px] pointer-events-none" />
                    <span className="terminal-badge mb-8 inline-flex relative z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                        Listo para comenzar
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10 tracking-tight leading-tight mt-4">
                        Anticipa el Próximo<br />
                        <span className="text-slate-400">Movimiento de tu Cliente.</span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10 font-light">
                        Agenda una sesión de exploración. Construimos el modelo predictivo que convierte
                        tu dato en BigQuery en decisiones de negocio con ventaja competitiva real.
                    </p>
                    <TrackedCTA href="?modal=auditoria" eventName="footer_inteligencia_predictiva"
                        className="relative z-10 group px-12 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,229,255,0.3)] inline-flex items-center gap-3">
                        <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Explorar modelos predictivos
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </TrackedCTA>
                </motion.div>
            </section>

            <RelatedServices step={4} />
        </div>
    );
}
