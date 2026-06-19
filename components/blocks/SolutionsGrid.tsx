"use client";

import { motion } from "framer-motion";
import { Database, TrendingUp, Code2, ArrowUpRight, Cpu, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";

const solutions = [
    {
        title: "Auditoría de Datos",
        tag: "ENGINEERING",
        description: "Eliminamos puntos ciegos. Centralizamos tu ecosistema de datos para una trazabilidad absoluta.",
        icon: Database,
        href: "/soluciones/auditoria-de-datos",
        className: "md:col-span-2",
        stats: "100% Traceability",
        accentColor: "rgba(0,229,255,0.1)",
        accentBorder: "rgba(0,229,255,0.4)",
        iconColor: "text-marketnauta-primary",
        layer: 1,
    },
    {
        title: "Growth Pauta",
        tag: "ALGORITHMIC",
        description: "Alta precisión para escalar ROAS.",
        icon: TrendingUp,
        href: "/soluciones/gestion-de-pauta",
        className: "md:col-span-1",
        stats: "+40% Efficiency",
        accentColor: "rgba(0,119,255,0.1)",
        accentBorder: "rgba(0,119,255,0.4)",
        iconColor: "text-marketnauta-secondary",
        layer: 5,
    },
    {
        title: "Infraestructura & Estrategia",
        tag: "INFRASTRUCTURE",
        description: "Ecosistemas web en el Edge diseñados para velocidad extrema y conversión masiva.",
        icon: Code2,
        href: "/soluciones/desarrollo-y-estrategia",
        className: "md:col-span-1",
        stats: "99/100 Core Web Vitals",
        accentColor: "rgba(16,185,129,0.08)",
        accentBorder: "rgba(16,185,129,0.35)",
        iconColor: "text-emerald-400",
        layer: 2,
    },
    {
        title: "Activación & Retención",
        tag: "RETENTION",
        description: "WhatsApp CRM, recuperación de carritos y email por comportamiento sobre tu propio dato.",
        icon: MessageCircle,
        href: "/soluciones/activacion-y-retencion",
        className: "md:col-span-1",
        stats: "Recupera +40% carritos",
        accentColor: "rgba(255,107,53,0.08)",
        accentBorder: "rgba(255,107,53,0.4)",
        iconColor: "text-marketnauta-orange",
        layer: 3,
    },
    {
        title: "Inteligencia Predictiva",
        tag: "PREDICTIVE",
        description: "Modelos de churn, recompra y recomendación con IA. La capa premium sobre tu dato.",
        icon: Sparkles,
        href: "/soluciones/inteligencia-predictiva",
        className: "md:col-span-1",
        stats: "Anticipa la recompra",
        accentColor: "rgba(0,119,255,0.1)",
        accentBorder: "rgba(0,119,255,0.4)",
        iconColor: "text-marketnauta-secondary",
        layer: 4,
    },
];

function SolutionCard({
    item,
    index,
}: {
    item: (typeof solutions)[0];
    index: number;
}) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [glowPos, setGlowPos] = useState({ x: "50%", y: "50%", opacity: 0 });

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPos({ x: `${x}%`, y: `${y}%`, opacity: 1 });
    }, []);

    const onMouseLeave = useCallback(() => {
        setGlowPos((p) => ({ ...p, opacity: 0 }));
    }, []);

    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 1, 0.36, 1] }}
            className={item.className}
        >
            <Link
                ref={cardRef}
                href={item.href}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                data-evt="internal_link_click"
                data-link-position="soluciones-grid"
                data-from-layer={1}
                data-to-layer={item.layer}
                className="group relative h-full border-glow glass-card p-6 md:p-8 rounded-[2rem] bg-white/[0.01] flex flex-col justify-between min-h-[280px] block overflow-hidden active:scale-[0.98] transition-all duration-300"
            >
                {/* Mouse-tracking glow */}
                <div
                    className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] pointer-events-none transition-opacity duration-300"
                    style={{
                        left: glowPos.x,
                        top: glowPos.y,
                        opacity: glowPos.opacity * 0.7,
                        background: item.accentColor.replace("0.1", "1"),
                        backgroundColor: item.accentColor,
                    }}
                />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-abisal-950 border border-white/10 flex items-center justify-center shadow-inner transition-all duration-500 group-hover:shadow-neon-short"
                            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Icon className={`w-5 h-5 ${item.iconColor}`} />
                        </motion.div>
                        <div className="px-2.5 py-1 rounded-full border border-white/10 text-[8px] font-mono text-slate-500 tracking-tighter group-hover:text-white group-hover:border-white/30 transition-colors duration-300">
                            {item.tag}
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-white tracking-tight group-hover:text-white transition-colors duration-300">
                        {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-[95%] font-light">
                        {item.description}
                    </p>
                </div>

                <div className="relative z-10 mt-8 flex items-end justify-between border-t border-white/5 pt-6">
                    <div className="space-y-1">
                        <p className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.2em]">Deployment_Metric</p>
                        <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                            style={{ color: item.accentBorder, background: item.accentColor }}
                        >
                            {item.stats}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-white font-mono text-[8px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                        Explorar Nodo <ArrowUpRight className="w-3 h-3 text-marketnauta-primary" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function SolutionsGrid() {
    return (
        <section className="py-8 md:py-12 px-6 max-w-7xl mx-auto relative overflow-hidden">
            <div className="mb-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-marketnauta-primary mb-4 font-mono text-[10px] uppercase tracking-[0.4em]"
                >
                    <div className="w-8 h-[1px] bg-marketnauta-primary/30" />
                    <span className="flex items-center gap-2">
                        <Cpu className="w-3 h-3" /> Stack de Soluciones
                    </span>
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-display font-bold text-white max-w-3xl leading-[1.1] tracking-tighter">
                    Arquitectura de crecimiento <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-200">
                        basada en evidencia técnica.
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 relative z-10">
                {solutions.map((item, index) => (
                    <SolutionCard key={item.title} item={item} index={index} />
                ))}
            </div>
        </section>
    );
}
