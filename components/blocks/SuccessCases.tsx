"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity, TrendingUp, TrendingDown } from "lucide-react";

const cases = [
    {
        category: "E-commerce Retail",
        metric: "+340%",
        label: "ROAS INCREMENTAL",
        description: "Centralizamos data en BigQuery para optimizar el presupuesto hacia productos de mayor LTV.",
        stack: ["Meta CAPI", "BigQuery", "Looker"],
        trend: [40, 52, 45, 70, 65, 88, 100],
        direction: "up",
        color: "rgba(0,229,255,0.08)",
        borderColor: "rgba(0,229,255,0.12)",
        borderHover: "rgba(0,229,255,0.35)",
        metricColor: "text-marketnauta-primary",
        glowClass: "text-glow-cyan",
        lineColor: "#00E5FF",
    },
    {
        category: "SaaS B2B",
        metric: "-45%",
        label: "REDUCCIÓN DE CAC",
        description: "Tracking Server-Side y modelos de atribución que eliminaron el desperdicio en pauta.",
        stack: ["GTM SS", "GA4", "Attribution"],
        trend: [100, 85, 75, 68, 58, 50, 45],
        direction: "down",
        color: "rgba(0,119,255,0.06)",
        borderColor: "rgba(0,119,255,0.12)",
        borderHover: "rgba(0,119,255,0.35)",
        metricColor: "text-marketnauta-secondary",
        glowClass: "text-glow-cyan",
        lineColor: "#0077FF",
    }
];

function SparkLine({ data, color, direction }: { data: number[]; color: string; direction: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const h = 40;
    const w = 100;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    });
    const pathD = `M ${pts.join(" L ")}`;

    return (
        <div className="relative h-10">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`fill-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={`${pathD} L ${w},${h} L 0,${h} Z`}
                    fill={`url(#fill-${color.replace(/[^a-z0-9]/gi, "")})`}
                />
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {/* Terminal dot */}
                <motion.circle
                    cx={w}
                    cy={direction === "up" ? 0 : h}
                    r="2.5"
                    fill={color}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.4, duration: 0.3 }}
                />
            </svg>
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-ping"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
        </div>
    );
}

export default function SuccessCases() {
    return (
        <section className="py-10 md:py-16 px-6 relative bg-abisal-950 overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 text-marketnauta-primary mb-4 font-mono text-[10px] uppercase tracking-[0.4em]"
                        >
                            <ShieldCheck className="w-4 h-4" /> Performance_Protocol.v2
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-[0.95] tracking-tighter">
                            Resultados <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-300">
                                Sin Fricción.
                            </span>
                        </h2>
                    </div>

                    {/* Live indicator */}
                    <div className="flex flex-col items-start md:items-end bg-white/[0.02] p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-1 h-3 bg-marketnauta-primary/20 rounded-full" />
                            ))}
                            <motion.div
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1 h-3 bg-marketnauta-primary rounded-full"
                            />
                        </div>
                        <p className="text-slate-500 font-mono text-[8px] tracking-[0.2em] uppercase font-bold">
                            Auditoría_2026
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {cases.map((item, index) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                            whileHover={{ y: -4 }}
                            className="group relative p-7 md:p-10 rounded-[2.5rem] overflow-hidden cursor-default"
                            style={{
                                background: `linear-gradient(135deg, rgba(11,19,43,0.85) 0%, ${item.color} 100%)`,
                                border: `1px solid ${item.borderColor}`,
                                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = item.borderHover;
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.4)`;
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = item.borderColor;
                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                            }}
                        >
                            {/* Radar ring on hover */}
                            <div
                                className="absolute top-10 right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ border: `1px solid ${item.borderHover}` }}
                            >
                                <div
                                    className="absolute inset-3 rounded-full"
                                    style={{ border: `1px solid ${item.borderColor}` }}
                                />
                                <div
                                    className="absolute inset-6 rounded-full"
                                    style={{ border: `1px solid ${item.borderColor}` }}
                                />
                                <div
                                    className="absolute inset-0 rounded-full animate-radar-spin"
                                    style={{
                                        background: `conic-gradient(from 0deg, transparent 0deg, ${item.lineColor}22 60deg, transparent 60deg)`,
                                    }}
                                />
                            </div>

                            <div className="relative z-10">
                                {/* Top row */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-3">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-abisal-950/60 border border-white/10 text-[8px] font-mono text-marketnauta-primary uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.stack.map((tech) => (
                                                <span key={tech} className="text-[7px] font-mono text-slate-500 uppercase">
                                                    #{tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-abisal-950 border border-white/10 flex items-center justify-center text-marketnauta-primary">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Main metric */}
                                <div className="mb-6">
                                    <h3
                                        className={`text-6xl md:text-7xl font-display font-black mb-1 tracking-tighter leading-none ${item.metricColor} ${item.glowClass}`}
                                    >
                                        {item.metric}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                                            style={{ background: item.lineColor }}
                                        />
                                        <p className="font-mono text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: item.lineColor }}>
                                            {item.label}
                                        </p>
                                        {item.direction === "up" ? (
                                            <TrendingUp className="w-3 h-3 ml-1" style={{ color: item.lineColor }} />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 ml-1" style={{ color: item.lineColor }} />
                                        )}
                                    </div>
                                </div>

                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8 max-w-[90%] font-light">
                                    {item.description}
                                </p>

                                {/* Line chart sparkline */}
                                <div className="opacity-30 group-hover:opacity-100 transition-all duration-700">
                                    <SparkLine data={item.trend} color={item.lineColor} direction={item.direction} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
