"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Activity } from "lucide-react";

const cases = [
    {
        category: "E-commerce Retail",
        metric: "+340%",
        label: "ROAS INCREMENTAL",
        description: "Centralizamos data en BigQuery para optimizar el presupuesto hacia productos de mayor LTV.",
        stack: ["Meta CAPI", "BigQuery", "Looker"],
        trend: [40, 70, 45, 90, 65, 100],
        color: "from-marketnauta-primary/20"
    },
    {
        category: "SaaS B2B",
        metric: "-45%",
        label: "REDUCCIÓN DE CAC",
        description: "Tracking Server-Side y modelos de atribución que eliminaron el desperdicio en pauta.",
        stack: ["GTM SS", "GA4", "Attribution"],
        trend: [100, 80, 60, 70, 50, 45],
        color: "from-blue-500/20"
    }
];

export default function SuccessCases() {
    return (
        // REDUCIDO: py-16 md:py-24 -> py-10 md:py-16
        <section className="py-10 md:py-16 px-6 relative bg-abisal-950 overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-marketnauta-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* HEADER: mb-16/24 -> mb-10/14 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-marketnauta-primary mb-4 font-mono text-[10px] uppercase tracking-[0.4em]"
                        >
                            <ShieldCheck className="w-4 h-4" /> Performance_Protocol.v2
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-[0.95] tracking-tighter">
                            Resultados <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-300">Sin Fricción.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-start md:items-end bg-white/[0.02] p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4].map(i => (
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

                {/* GRID: gap-10 -> gap-6 md:gap-8 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {cases.map((item, index) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            // COMPACTADO: p-8/12 -> p-7 md:p-10
                            className={`group relative p-7 md:p-10 glass-card rounded-[2.5rem] bg-gradient-to-br ${item.color} to-transparent border border-white/5 hover:border-marketnauta-primary/30 transition-all duration-500 active:scale-[0.98]`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-3">
                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-abisal-950/50 border border-white/10 text-[8px] font-mono text-marketnauta-primary uppercase tracking-widest">
                                        {item.category}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.stack.map(tech => (
                                            <span key={tech} className="text-[7px] font-mono text-slate-500 uppercase">
                                                #{tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-abisal-950 border border-white/10 flex items-center justify-center text-marketnauta-primary shadow-inner">
                                    <Activity className="w-4 h-4" />
                                </div>
                            </div>

                            {/* MÉTRICA: mb-10 -> mb-6 */}
                            <div className="mb-6">
                                <h3 className="text-6xl md:text-7xl font-display font-black text-white mb-1 tracking-tighter leading-none">
                                    {item.metric}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-pulse" />
                                    <p className="text-marketnauta-primary font-mono text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase">
                                        {item.label}
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8 max-w-[90%] font-light">
                                {item.description}
                            </p>

                            {/* MINI-CHART: Más bajo h-10/12 */}
                            <div className="flex items-end gap-1 h-10 md:h-12 w-full opacity-20 group-hover:opacity-100 transition-all duration-1000">
                                {item.trend.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${val}%` }}
                                        className="flex-1 bg-gradient-to-t from-marketnauta-primary to-transparent rounded-t-[1px]"
                                    />
                                ))}
                            </div>

                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-marketnauta-primary" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}