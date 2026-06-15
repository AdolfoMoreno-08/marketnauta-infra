"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Tag, Database, BarChart3, Activity } from "lucide-react";

const steps = [
    {
        id: "01",
        title: "GTM Server-Side",
        label: "SERVER_TRACKING",
        desc: "Desplegamos GTM en infraestructura propia para capturar el 100% de eventos, bypassing las restricciones de iOS 14+ y adblockers. Server-to-server CAPI para Meta y GA4.",
        icon: Tag,
        status: "Deploy",
        tech: ["GTM SS", "Cloud Run", "Meta CAPI", "GA4 MP"],
        accentColor: "rgba(0,229,255,0.12)",
        accentBorder: "rgba(0,229,255,0.3)",
        metricLabel: "Recuperación de señal",
        metricValue: "+68%",
    },
    {
        id: "02",
        title: "BigQuery Data Warehouse",
        label: "DATA_WAREHOUSE",
        desc: "Centralizamos todas las fuentes de datos (GA4, Meta, Google Ads, CRM) en BigQuery. Modelos de atribución personalizada con ventanas de conversión reales.",
        icon: Database,
        status: "Build",
        tech: ["BigQuery", "Looker Studio", "dbt", "Python"],
        accentColor: "rgba(0,119,255,0.10)",
        accentBorder: "rgba(0,119,255,0.3)",
        metricLabel: "Fuentes integradas",
        metricValue: "10+",
    },
    {
        id: "03",
        title: "Looker Studio + Alertas",
        label: "INTELLIGENCE_LAYER",
        desc: "Dashboards en tiempo real conectados al warehouse. Alertas automáticas de anomalías en ROAS, CPL y CAC. Tu equipo toma decisiones en horas, no en semanas.",
        icon: BarChart3,
        status: "Scale",
        tech: ["Looker Studio", "BigQuery ML", "Slack", "Email"],
        accentColor: "rgba(16,185,129,0.08)",
        accentBorder: "rgba(16,185,129,0.3)",
        metricLabel: "Time-to-insight",
        metricValue: "<2h",
    },
];

function ConnectorLine({ active }: { active: boolean }) {
    return (
        <div className="hidden md:flex absolute top-1/2 -right-3 w-6 -translate-y-1/2 z-20 items-center">
            <motion.div
                className="h-px w-full"
                style={{ background: "rgba(0,229,255,0.3)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#00E5FF", boxShadow: "0 0 8px rgba(0,229,255,0.8)" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }}
                transition={{ delay: 0.6 }}
            />
        </div>
    );
}

export default function Methodology() {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} className="py-8 md:py-14 px-6 relative overflow-hidden bg-abisal-950">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(0,119,255,0.06) 0%, transparent 65%)" }} />
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-marketnauta-primary mb-3 font-mono text-[10px] uppercase tracking-[0.4em]"
                    >
                        <Activity className="w-4 h-4" /> Protocolo de Trabajo
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                        Stack técnico de{" "}
                        <span className="text-marketnauta-primary text-glow-cyan">
                            Ingeniería de Datos.
                        </span>
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base mt-4 font-light max-w-xl mx-auto">
                        Tres capas que transforman datos crudos en decisiones de negocio — en horas, no en meses.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 relative z-10">
                    {/* Horizontal connector (desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-[16.5%] right-[16.5%] h-px z-0 -translate-y-1/2">
                        <motion.div
                            className="h-full"
                            style={{
                                background: "linear-gradient(90deg, rgba(0,229,255,0.3), rgba(0,119,255,0.3), rgba(16,185,129,0.3))",
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: inView ? 1 : 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                        />
                    </div>

                    {/* Vertical connector (mobile) */}
                    <div className="md:hidden absolute left-11 top-44 bottom-16 w-px z-0">
                        <motion.div
                            className="w-full h-full"
                            style={{
                                background: "linear-gradient(180deg, rgba(0,229,255,0.3), rgba(0,119,255,0.2), rgba(16,185,129,0.2))",
                            }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: inView ? 1 : 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                        />
                    </div>

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.18, duration: 0.6 }}
                                className="group relative"
                            >
                                <div
                                    className="p-6 md:p-7 rounded-[2rem] h-full flex flex-col border transition-all duration-500"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(11,19,43,0.7) 0%, ${step.accentColor} 100%)`,
                                        borderColor: step.accentBorder.replace("0.3", "0.12"),
                                        backdropFilter: "blur(12px)",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = step.accentBorder;
                                        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 30px ${step.accentColor}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = step.accentBorder.replace("0.3", "0.12");
                                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-6 md:mb-8">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:shadow-neon-short"
                                            style={{
                                                background: "rgba(3,7,18,0.8)",
                                                borderColor: step.accentBorder.replace("0.3", "0.2"),
                                                color: step.accentBorder,
                                            }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-mono text-3xl md:text-4xl leading-none font-bold text-white/[0.04] group-hover:text-white/10 transition-colors">
                                            {step.id}
                                        </span>
                                    </div>

                                    <div className="mb-6 flex-1">
                                        <span
                                            className="text-[8px] font-mono uppercase tracking-[0.2em] mb-1.5 block"
                                            style={{ color: step.accentBorder }}
                                        >
                                            [{step.label}]
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-display">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light">
                                            {step.desc}
                                        </p>
                                    </div>

                                    {/* Tech stack chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {step.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="text-[7px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest"
                                                style={{
                                                    background: step.accentColor,
                                                    border: `1px solid ${step.accentBorder.replace("0.3", "0.2")}`,
                                                    color: step.accentBorder,
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Metric bar */}
                                    <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                                style={{ background: step.accentBorder }}
                                            />
                                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                                                {step.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">
                                                {step.metricLabel}
                                            </p>
                                            <p
                                                className="text-sm font-mono font-bold"
                                                style={{ color: step.accentBorder }}
                                            >
                                                {step.metricValue}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Inter-card connector dot (desktop) */}
                                {i < steps.length - 1 && <ConnectorLine active={inView} />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
