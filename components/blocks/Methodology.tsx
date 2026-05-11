"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Zap, Activity } from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Exploración de Datos",
        label: "Data Discovery",
        desc: "Identificamos fugas de atribución y silos de información en tu infraestructura.",
        icon: <Search className="w-5 h-5" />,
        status: "Analyze"
    },
    {
        id: "02",
        title: "Arquitectura Táctica",
        label: "Cloud Engine",
        desc: "Diseñamos el ecosistema en BigQuery que sostendrá tu escalamiento.",
        icon: <PenTool className="w-5 h-5" />,
        status: "Build"
    },
    {
        id: "03",
        title: "Propulsión & Escala",
        label: "Growth Matrix",
        desc: "Encendemos motores de pauta bajo monitoreo algorítmico 24/7.",
        icon: <Zap className="w-5 h-5" />,
        status: "Scale"
    }
];

export default function Methodology() {
    return (
        // AJUSTADO: py-8 md:py-14 para integrarse con el ritmo de la Home
        <section className="py-8 md:py-14 px-6 relative overflow-hidden bg-abisal-950">
            <div className="max-w-7xl mx-auto relative">

                {/* Cabecera: mb-12 -> mb-10 (Mobile) / mb-24 -> mb-16 (Desktop) */}
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 text-marketnauta-primary mb-3 font-mono text-[10px] uppercase tracking-[0.4em]">
                        <Activity className="w-4 h-4" /> Protocolo de Trabajo
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                        Nuestro proceso de <br className="md:hidden" />
                        <span className="text-marketnauta-primary">Ingeniería.</span>
                    </h2>
                </div>

                {/* LÍNEAS DE CONEXIÓN CALIBRADAS */}
                {/* Horizontal (Desktop): Ajustada a top-[65%] para el nuevo tamaño de card */}
                <div className="hidden md:block absolute top-[65%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

                {/* Vertical (Mobile): Ajustada para empezar y terminar justo en el flujo */}
                <div className="md:hidden absolute left-12 top-44 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-marketnauta-primary/20 to-transparent z-0" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            className="group relative"
                        >
                            {/* Card: p-6 md:p-8 -> p-6 md:p-7 / rounded-[2.5rem] -> rounded-[2rem] */}
                            <div className="p-6 md:p-7 glass-card rounded-[2rem] border-white/5 h-full flex flex-col hover:border-marketnauta-primary/20 transition-all duration-500 bg-abisal-900/30 backdrop-blur-sm">

                                <div className="flex justify-between items-start mb-6 md:mb-8">
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-abisal-950 border border-white/10 flex items-center justify-center text-marketnauta-primary shadow-inner">
                                        {step.icon}
                                    </div>
                                    <span className="font-mono text-3xl md:text-4xl leading-none font-bold text-white/5 group-hover:text-marketnauta-primary/10 transition-colors">
                                        {step.id}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <span className="text-[8px] font-mono text-marketnauta-primary uppercase tracking-[0.2em] mb-1.5 block">
                                        [{step.label}]
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-marketnauta-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-marketnauta-primary animate-pulse" />
                                        <span className="text-[9px] font-mono text-slate-500 uppercase">{step.status}</span>
                                    </div>
                                    <div className="text-[8px] font-mono text-slate-700 hidden sm:block tracking-tighter">
                                        LOG_SYSTEM_OK
                                    </div>
                                </div>
                            </div>

                            {/* Punto de conexión (Desktop): Alineado con la línea horizontal */}
                            <div className="hidden md:flex absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-abisal-950 border border-white/20 group-hover:border-marketnauta-primary transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}