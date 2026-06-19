"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import {
    MessageCircle, ShoppingCart, Mail, Sparkles, ArrowRight, RefreshCw
} from "lucide-react";
import {
    ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Line
} from "recharts";
import Link from "next/link";
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
            <div className="absolute inset-0 opacity-[0.025]" style={{
                backgroundImage: `linear-gradient(rgba(0,229,255,0.8) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(0,229,255,0.8) 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
            }} />
            <motion.div
                className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    left: glowX, top: glowY,
                    background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)",
                }}
            />
            <div className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(0,119,255,0.05) 0%, transparent 65%)" }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)" }} />
        </div>
    );
}

// ─── Retention funnel chart ──────────────────────────────────────────────────
const funnelData = [
    { mes: "Ene", abandonados: 320, recuperados: 48, apertura: 72 },
    { mes: "Feb", abandonados: 410, recuperados: 82, apertura: 80 },
    { mes: "Mar", abandonados: 580, recuperados: 145, apertura: 86 },
    { mes: "Abr", abandonados: 720, recuperados: 230, apertura: 91 },
    { mes: "May", abandonados: 890, recuperados: 356, apertura: 95 },
    { mes: "Jun", abandonados: 1040, recuperados: 489, apertura: 98 },
];

function RetentionFunnelChart() {
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
                        Retention_CRM.analytics
                    </span>
                </div>
                <div className="px-2 py-1 rounded bg-marketnauta-primary/5 border border-marketnauta-primary/20">
                    <span className="text-marketnauta-primary font-mono text-[10px] font-bold">+47% recovery</span>
                </div>
            </div>

            <div className="p-6 pb-2" ref={ref}>
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={inView ? funnelData : []} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="mes" axisLine={false} tickLine={false}
                                tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} dy={6} />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ stroke: "rgba(0,229,255,0.3)", strokeWidth: 1 }}
                                contentStyle={{ backgroundColor: "#030712", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px", color: "#fff" }}
                                itemStyle={{ color: "#00E5FF" }}
                            />
                            <Bar dataKey="abandonados" barSize={18} fill="rgba(255,255,255,0.04)"
                                radius={[3, 3, 0, 0]} animationDuration={1400} />
                            <Area type="monotone" dataKey="recuperados" fill="url(#recoveredGrad)"
                                stroke="#00E5FF" strokeWidth={2} animationDuration={1600} />
                            <Line type="monotone" dataKey="apertura" stroke="rgba(139,92,246,0.7)"
                                strokeWidth={1.5} strokeDasharray="4 3" dot={false} animationDuration={1800} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="px-6 pb-5 grid grid-cols-3 gap-3">
                {[
                    { v: "98%", l: "Apertura WA", c: "text-marketnauta-primary" },
                    { v: "+47%", l: "Recuperación", c: "text-violet-400" },
                    { v: "×0", l: "Pauta extra", c: "text-slate-300" },
                ].map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                        <p className={`text-lg font-bold font-mono ${m.c}`}>{m.v}</p>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">{m.l}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── CARD WIDGETS — animados según propuesta de valor ───────────────────────

// RETENER_01 — WhatsApp CRM: conversación real animada
const chatMessages = [
    { from: "brand", text: "Hola 👋 Dejaste algo en tu carrito", delay: 0.5 },
    { from: "user",  text: "Sí, ¿tienen stock?",                  delay: 1.2 },
    { from: "brand", text: "✅ Stock OK. Te lo guardo 15 min 🛒",  delay: 2.0 },
    { from: "user",  text: "¡Lo compro ahora!",                    delay: 2.8 },
];

function WhatsAppWidget() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <div ref={ref} className="w-full md:w-52 shrink-0 bg-abisal-950 rounded-2xl overflow-hidden border border-white/[0.08] relative z-10 shadow-glass">
            {/* Mock header */}
            <div className="px-3 py-2.5 bg-white/[0.03] flex items-center gap-2 border-b border-white/[0.06]">
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                    <p className="text-[9px] text-white font-semibold font-mono">TiendaRetail</p>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-[8px] text-green-400 font-mono">en línea</p>
                    </div>
                </div>
            </div>
            {/* Bubbles */}
            <div className="p-3 space-y-2 min-h-[148px]">
                {chatMessages.map((m, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ delay: m.delay, duration: 0.35, ease: "easeOut" }}
                        className={`flex ${m.from === "brand" ? "justify-start" : "justify-end"}`}
                    >
                        <span className={`text-[9px] px-2.5 py-1.5 rounded-xl leading-relaxed max-w-[88%] ${
                            m.from === "brand"
                                ? "bg-white/[0.06] text-slate-300"
                                : "bg-green-600/25 text-green-100"
                        }`}>
                            {m.text}
                        </span>
                    </motion.div>
                ))}
            </div>
            {/* Footer rate */}
            <div className="px-3 pb-3 flex items-center justify-between border-t border-white/[0.04] pt-2">
                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Apertura</span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 3.4 }}
                    className="text-[11px] font-bold font-mono text-marketnauta-primary"
                >
                    98%
                </motion.span>
            </div>
        </div>
    );
}

// RETENER_02 — Recuperación de carritos: embudo animado
function RecoveryFunnelWidget() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    const steps = [
        { label: "Abandonan",   pct: 100, color: "bg-slate-600/40",          txt: "text-slate-500",              val: "100%", delay: 0.2 },
        { label: "Impactados",  pct: 72,  color: "bg-marketnauta-primary/35", txt: "text-slate-400",              val: "72%",  delay: 0.8 },
        { label: "Recuperados", pct: 47,  color: "bg-marketnauta-primary",     txt: "text-marketnauta-primary",   val: "+47%", delay: 1.4 },
    ];

    return (
        <div ref={ref} className="mt-6 space-y-3">
            {steps.map((s, i) => (
                <div key={i}>
                    <div className="flex justify-between mb-1.5">
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{s.label}</span>
                        <span className={`text-[9px] font-mono font-bold ${s.txt}`}>{s.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${s.color} rounded-full`}
                            initial={{ width: "0%" }}
                            animate={inView ? { width: `${s.pct}%` } : { width: "0%" }}
                            transition={{ delay: s.delay, duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// RETENER_03 — Email por comportamiento: timeline evento → disparo
function EmailTimelineWidget() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    const steps = [
        { Icon: ShoppingCart, label: "Carrito abandonado",   time: "T+0",    active: false, delay: 0.2 },
        { Icon: RefreshCw,    label: "Trigger detectado",    time: "T+2min", active: true,  delay: 0.8 },
        { Icon: Mail,         label: "Email personalizado",  time: "T+5min", active: true,  delay: 1.4 },
        { Icon: ArrowRight,   label: "Conversión registrada",time: "T+30min",active: true,  delay: 2.0 },
    ];

    return (
        <div ref={ref} className="mt-6 space-y-2.5">
            {steps.map((s, i) => (
                <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: s.delay, duration: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-2.5"
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        s.active
                            ? "bg-marketnauta-primary/10 border-marketnauta-primary/30"
                            : "bg-white/[0.03] border-white/10"
                    }`}>
                        <s.Icon className={`w-3 h-3 ${s.active ? "text-marketnauta-primary" : "text-slate-600"}`} />
                    </div>
                    <span className={`text-[9px] font-mono flex-1 ${s.active ? "text-slate-300" : "text-slate-600"}`}>
                        {s.label}
                    </span>
                    <span className="text-[8px] font-mono text-slate-700 shrink-0 tabular-nums">{s.time}</span>
                </motion.div>
            ))}
        </div>
    );
}

// RETENER_04 — Personalización dinámica: segmentos ciclando en tiempo real
function SegmentWidget() {
    const [active, setActive] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const segments = [
        { label: "Nuevo usuario",      msg: "Descubre nuestra colección",         color: "text-marketnauta-primary" },
        { label: "Cliente recurrente", msg: "Bienvenido de vuelta · Nuevo stock", color: "text-emerald-400" },
        { label: "VIP · Alto LTV",     msg: "Acceso exclusivo antes que nadie",   color: "text-amber-400" },
    ];

    useEffect(() => {
        if (!inView) return;
        const id = setInterval(() => setActive(p => (p + 1) % 3), 2200);
        return () => clearInterval(id);
    }, [inView]);

    return (
        <div ref={ref} className="flex flex-col gap-2 mt-5 mb-4">
            {segments.map((s, i) => (
                <motion.div key={i}
                    animate={{
                        borderColor: active === i ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.05)",
                        backgroundColor: active === i ? "rgba(0,229,255,0.03)" : "rgba(255,255,255,0.01)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="px-3 py-2 rounded-xl border flex items-center gap-2.5"
                >
                    <div className="flex-1 min-w-0">
                        <p className={`text-[8px] font-mono uppercase tracking-widest transition-colors ${active === i ? s.color : "text-slate-600"}`}>
                            {s.label}
                        </p>
                        <motion.p
                            animate={{ opacity: active === i ? 1 : 0.3 }}
                            transition={{ duration: 0.35 }}
                            className="text-[10px] text-white font-medium truncate mt-0.5"
                        >
                            {s.msg}
                        </motion.p>
                    </div>
                    <motion.div
                        animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 0.3 }}
                        transition={{ duration: 0.3 }}
                        className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary shrink-0"
                    />
                </motion.div>
            ))}
        </div>
    );
}

// ─── Framer variants ─────────────────────────────────────────────────────────
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
export default function ActivacionRetencionPageContent({ faqs }: Props) {

    const heroWords = ["El tráfico", "ya lo pagaste.", "Ahora", "recupéralo."];

    return (
        <div className="min-h-screen bg-abisal-950 overflow-x-hidden relative">

            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <div className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden">
                <HeroGrid />

                <Breadcrumbs
                    fromLayer={3}
                    items={[
                    { label: "Inicio", href: "/", toLayer: 1 },
                    { label: "Soluciones", href: "/#soluciones", toLayer: 1 },
                    { label: "Activación & Retención" },
                ]} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-24 grid lg:grid-cols-2 gap-16 items-center w-full">

                    {/* Left col */}
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>

                        {/* Badge */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-neon-short">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
                            </span>
                            <span className="text-[10px] text-violet-400 uppercase tracking-[0.3em] font-mono font-bold">
                                Retention Engine // RETENER · Capa 3
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
                            En Perú el ecommerce convierte cerca del{" "}
                            <span className="text-white font-medium">0,5%</span> y hasta{" "}
                            <span className="text-white font-medium">40%</span> de los carritos se abandona.
                            Activamos tu dato en{" "}
                            <Link href="/soluciones/auditoria-de-datos"
                                data-evt="internal_link_click" data-from-layer={3} data-to-layer={1} data-link-position="hero"
                                className="text-marketnauta-primary underline-offset-4 hover:underline">BigQuery
                            </Link>{" "}
                            para recuperar ventas sin gastar más en pauta.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4">
                            <TrackedCTA href="?modal=auditoria" eventName="diagnostico-retencion" fromLayer={3}
                                className="w-fit group inline-flex items-center gap-3 px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:shadow-neon-long transition-all duration-300 active:scale-95">
                                Diagnóstico de retención
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </TrackedCTA>
                        </motion.div>

                        {/* KPI bar */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                            className="mt-12 flex items-center gap-8 flex-wrap">
                            {[
                                { val: "40%", label: "carritos sin recuperar" },
                                { val: "98%", label: "apertura WhatsApp" },
                                { val: "+47%", label: "tasa de recovery" },
                            ].map((m) => (
                                <div key={m.label} className="text-center">
                                    <p className="text-2xl md:text-3xl font-display font-black text-white">{m.val}</p>
                                    <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1">{m.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right col — chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotateY: 8, rotateX: 4 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 3, rotateX: 0 }}
                        transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
                        className="relative group perspective-1000">
                        <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-65 transition duration-1000"
                            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.25) 0%, rgba(0,229,255,0.1) 100%)" }} />
                        <div className="relative transform transition-transform duration-700">
                            <RetentionFunnelChart />
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

            {/* ── PAIN POINTS ───────────────────────────────────────────────── */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeUp} className="mb-16 pb-6 border-b border-white/[0.07]">
                        <span className="terminal-badge mb-4 inline-flex">
                            <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                            Diagnóstico
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mt-4">
                            ¿Tráfico sin retención?
                        </h2>
                    </motion.div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="grid md:grid-cols-12 gap-6">
                        {[
                            { col: "md:col-span-5", title: "El 40% de carritos se abandona sin recuperar", desc: "Causas internas —velocidad, proceso de pago, precio percibido— que no se resuelven gastando más en adquisición." },
                            { col: "md:col-span-4", title: "Email masivo en el momento incorrecto", desc: "Campañas broadcast con 10% de apertura. El dato de comportamiento existe pero no se usa para disparar mensajes personalizados." },
                            { col: "md:col-span-3", title: "Sin dato propio, dependes de la pauta", desc: "Cada venta no fidelizada es presupuesto perdido. La retención escala el LTV sin escalar el costo de adquisición." },
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
                            Stack de retención
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 title-gradient mt-4">
                            Activa, Retén y Multiplica.
                        </h2>
                        <p className="text-slate-400 text-lg font-light">
                            El dato que ya capturamos para ti se convierte en ventas automatizadas.
                        </p>
                    </motion.div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">

                        {/* RETENER_01 — WhatsApp CRM */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-7 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 relative overflow-hidden group flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            {/* Text */}
                            <div className="flex-1 relative z-10">
                                <MessageCircle className="w-8 h-8 text-marketnauta-primary mb-5" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">RETENER_01 // Core</span>
                                <h3 className="text-2xl font-display font-bold mb-4 text-white">WhatsApp Business como CRM</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    El canal #1 de apertura en Perú convertido en motor de ventas.
                                    Flujos automáticos con intervención humana en cotización, seguimiento y recompra.
                                    Cada conversación registrada sobre tu propio dato.
                                </p>
                            </div>
                            {/* Animated chat widget */}
                            <WhatsAppWidget />
                        </motion.div>

                        {/* RETENER_02 — Recuperación de carritos */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent group">
                            <ShoppingCart className="w-8 h-8 text-white/40 group-hover:text-marketnauta-primary transition-colors duration-300 mb-5" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">RETENER_02</span>
                            <h3 className="text-xl font-bold mb-3 text-white">Recuperación de Carritos</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Secuencias email + WhatsApp segmentadas por intención de compra.
                                Atacamos directo al 40% de abandono por causas internas.
                                Ventas que ya estaban a un clic, sin gastar en pauta.
                            </p>
                            {/* Funnel animado */}
                            <RecoveryFunnelWidget />
                        </motion.div>

                        {/* RETENER_03 — Email por comportamiento */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] group">
                            <Mail className="w-8 h-8 text-white/40 group-hover:text-marketnauta-primary transition-colors duration-300 mb-5" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">RETENER_03</span>
                            <h3 className="text-xl font-bold mb-3 text-white">Email por Comportamiento</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Disparadores por lo que el usuario hace o deja de hacer:
                                bienvenida, post-compra, reactivación. ROI alto porque llegan
                                en el momento exacto. Medido server-side de punta a punta.
                            </p>
                            {/* Timeline animada */}
                            <EmailTimelineWidget />
                        </motion.div>

                        {/* RETENER_04 — Personalización dinámica */}
                        <motion.div variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="md:col-span-7 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/10 bg-abisal-900/60 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-[0.025]" style={{
                                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: "40px 40px",
                            }} />
                            <div className="relative z-10">
                                <Sparkles className="w-8 h-8 text-marketnauta-primary mb-5" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">RETENER_04 // AI</span>
                                <h3 className="text-3xl font-display font-bold mb-3 text-white">Personalización Dinámica</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                    La misma web, distinta para cada visitante. Adaptamos contenido y oferta según
                                    origen, industria y momento del funnel, usando los{" "}
                                    <Link href="/soluciones/inteligencia-predictiva"
                                        data-evt="internal_link_click" data-from-layer={3} data-to-layer={4} data-link-position="content"
                                        className="text-marketnauta-primary underline-offset-4 hover:underline">
                                        segmentos predictivos de la capa ANTICIPAR
                                    </Link>.
                                </p>
                                {/* Segment switcher animado */}
                                <SegmentWidget />
                                <div className="flex flex-wrap gap-2">
                                    {["BigQuery", "WhatsApp API", "Klaviyo / ActiveCampaign"].map(t => (
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
                <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} className="max-w-4xl text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)" }} />
                    <span className="terminal-badge mb-8 inline-flex relative z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                        Listo para comenzar
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10 tracking-tight leading-tight mt-4">
                        Convierte Datos en<br />
                        <span className="text-slate-400">Ingresos Recurrentes.</span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10 font-light">
                        Agenda una sesión de diagnóstico. Analizamos tus tasas de abandono actuales
                        y diseñamos el plan de retención que tu ecommerce necesita.
                    </p>
                    <TrackedCTA href="?modal=auditoria" eventName="activar-plan-retencion" fromLayer={3}
                        className="relative z-10 inline-flex items-center gap-4 px-10 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-lg hover:shadow-neon-long transition-all duration-300 active:scale-95 shadow-neon-short group">
                        Activar plan de retención
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </TrackedCTA>
                </motion.div>
            </section>

            <RelatedServices step={3} />
        </div>
    );
}
