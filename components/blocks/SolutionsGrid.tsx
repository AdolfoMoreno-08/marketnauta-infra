"use client";

import { motion } from "framer-motion";
import { Database, TrendingUp, Code2, ArrowUpRight, Cpu, BarChart3 } from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        title: "Auditoría de Datos",
        tag: "ENGINEERING",
        description: "Eliminamos puntos ciegos. Centralizamos tu ecosistema de datos para una trazabilidad absoluta.",
        icon: <Database className="w-5 h-5" />,
        href: "/soluciones/auditoria-de-datos",
        className: "md:col-span-2",
        stats: "100% Traceability",
        accent: "group-hover:bg-marketnauta-primary/10"
    },
    {
        title: "Growth Pauta",
        tag: "ALGORITHMIC",
        description: "Alta precisión para escalar ROAS.",
        icon: <TrendingUp className="w-5 h-5" />,
        href: "/soluciones/gestion-de-pauta",
        className: "md:col-span-1",
        stats: "+40% Efficiency",
        accent: "group-hover:bg-blue-500/10"
    },
    {
        title: "Infraestructura & Estrategia",
        tag: "INFRASTRUCTURE",
        description: "Ecosistemas web en el Edge diseñados para velocidad extrema y conversión masiva.",
        icon: <Code2 className="w-5 h-5" />,
        href: "/soluciones/desarrollo-y-estrategia",
        className: "md:col-span-3",
        stats: "99/100 Core Web Vitals",
        accent: "group-hover:bg-emerald-500/10"
    },
];

export default function SolutionsGrid() {
    return (
        // REDUCIDO: py-16 md:py-24 -> py-8 md:py-12 (El page.tsx ya pone el resto)
        <section className="py-8 md:py-12 px-6 max-w-7xl mx-auto relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
            {/* REDUCIDO: mb-16 -> mb-10 */}
            <div className="mb-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-marketnauta-primary mb-4 font-mono text-[10px] uppercase tracking-[0.4em]"
                >
                    <div className="w-8 h-[1px] bg-marketnauta-primary/30" />
                    <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Stack de Soluciones</span>
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-display font-bold text-white max-w-3xl leading-[1.1] tracking-tighter">
                    Arquitectura de crecimiento <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-200">basada en evidencia técnica.</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 relative z-10">
                {solutions.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 1, 0.36, 1] }}
                        className={item.className}
                    >
                        <Link
                            href={item.href}
                            // COMPACTADO: p-8 md:p-10 -> p-6 md:p-8
                            className="group relative h-full glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col justify-between min-h-[280px] transition-all duration-700 block overflow-hidden active:scale-[0.98]"
                        >
                            <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] rounded-full transition-all duration-1000 pointer-events-none opacity-0 group-hover:opacity-100 ${item.accent}`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-abisal-950 border border-white/10 flex items-center justify-center text-marketnauta-primary shadow-[inset_0_0_15px_rgba(0,229,255,0.05)] group-hover:border-marketnauta-primary/50 transition-all duration-500">
                                        {item.icon}
                                    </div>
                                    <div className="px-2.5 py-1 rounded-full border border-white/10 text-[8px] font-mono text-slate-500 tracking-tighter group-hover:text-marketnauta-primary transition-colors">
                                        {item.tag}
                                    </div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-display font-bold mb-3 text-white tracking-tight group-hover:text-marketnauta-primary transition-colors duration-500">
                                    {item.title}
                                </h3>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-[95%] font-light">
                                    {item.description}
                                </p>
                            </div>

                            <div className="relative z-10 mt-8 flex items-end justify-between border-t border-white/5 pt-6">
                                <div className="space-y-1">
                                    <p className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.2em]">Deployment_Metric</p>
                                    <span className="text-[10px] font-mono text-marketnauta-primary font-bold bg-marketnauta-primary/5 px-2 py-0.5 rounded">
                                        {item.stats}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-white font-mono text-[8px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500">
                                    Explorar Nodo <ArrowUpRight className="w-3 h-3 text-marketnauta-primary" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}