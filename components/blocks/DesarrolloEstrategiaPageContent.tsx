"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Globe, Zap, ArrowRight, Layers, Layout, Database, ShieldCheck } from "lucide-react";
import CodeVisualizer from "@/components/blocks/CodeVisualizer";
import TrackedCTA from "@/components/blocks/TrackedCTA";

export default function DesarrolloEstrategiaPageContent() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="min-h-screen bg-[#030712] overflow-x-hidden relative">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-marketnauta-primary/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <section className="relative pt-32 pb-24 px-6 z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-marketnauta-primary/5 border border-marketnauta-primary/20 text-marketnauta-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
                            <Code2 className="w-3 h-3 text-marketnauta-primary animate-pulse" />
                            High-Performance Engineering
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter title-gradient mb-8">
                            Sistemas que <br />
                            <span className="text-white relative">
                                Escalan tu Lógica.
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-50" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
                            No construimos sitios web convencionales. Desarrollamos infraestructuras digitales ultra-rápidas bajo estándares <span className="text-white font-medium">SaaS Enterprise</span>, optimizadas para conversión masiva y escalabilidad global.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <TrackedCTA
                                href="?modal=exploracion"
                                eventName="hero_desplegar_arquitectura"
                                className="group px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 w-fit"
                            >
                                Desplegar Arquitectura
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </TrackedCTA>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotateY: -10, rotateX: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: -5, rotateX: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="relative group perspective-1000"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-marketnauta-primary/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                        <div className="relative rounded-[2rem] transform transition-transform duration-700 group-hover:rotate-y-0 shadow-2xl">
                            <CodeVisualizer />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 title-gradient">Ingeniería que <br /> Multiplica Ingresos.</h2>
                            <p className="text-slate-400 text-lg font-light">Nuestra ventaja no es solo escribir código, es entender la estrategia de datos que hay detrás de cada componente.</p>
                        </div>
                        <div className="text-marketnauta-primary font-mono text-[10px] tracking-[0.3em] border-b border-marketnauta-primary/30 pb-2">
                            CODE // SPEED // CONVERSION
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">

                        <motion.div {...fadeInUp} className="md:col-span-8 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-abisal-900/40 relative overflow-hidden group flex flex-col md:flex-row items-center gap-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-marketnauta-primary/5 rounded-full blur-[80px] group-hover:bg-marketnauta-primary/10 transition-colors" />
                            <div className="flex-1 relative z-10">
                                <Zap className="w-8 h-8 text-marketnauta-primary mb-6" />
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">INFRA_01</span>
                                <h3 className="text-2xl font-bold mb-4 text-white">Velocidad Crítica & Edge Runtime</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Optimizamos milimétricamente para dominar los Core Web Vitals. Utilizamos arquitecturas Serverless y Edge Computing (Vercel) para garantizar tiempos de respuesta inferiores a 0.5s, eliminando latencias de renderizado.</p>
                            </div>
                            <div className="w-full md:w-40 shrink-0 grid gap-4 relative z-10">
                                <div className="p-4 glass-card rounded-2xl text-center border-marketnauta-primary/20 bg-white/[0.02]">
                                    <p className="text-3xl font-bold text-white">100</p>
                                    <p className="text-[9px] text-marketnauta-primary uppercase tracking-widest font-mono mt-1">Lighthouse</p>
                                </div>
                                <div className="p-4 glass-card rounded-2xl text-center border-white/5 bg-white/[0.01]">
                                    <p className="text-2xl font-bold text-white">&lt;0.8s</p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">LCP Core</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="md:col-span-4 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent group">
                            <Globe className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">INFRA_02</span>
                            <h3 className="text-xl font-bold mb-4 text-white">SEO de Ingeniería</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">No dependemos de plugins mágicos. Estructuramos el DOM, aplicamos Server-Side Rendering (SSR) y schemas avanzados para que el rastreo de Google sea impecable.</p>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] group">
                            <Database className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">INFRA_03</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Data-Ready Stack</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Interoperabilidad y Flujo de Datos. Lo desarrollamos con integraciones nativas para BigQuery, GA4 y Meta CAPI (Server-Side Tracking). Datos limpios desde la primera línea de código.</p>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="md:col-span-7 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/10 bg-abisal-900/60 relative overflow-hidden group">
                            <div
                                className="absolute inset-0 opacity-[0.02]"
                                style={{
                                    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }}
                            />
                            <div className="relative z-10">
                                <Layout className="w-8 h-8 text-marketnauta-primary mb-6" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">INFRA_04 // UI</span>
                                <h3 className="text-3xl font-display font-bold mb-4 text-white">Interfaces Orientadas a Objetivos</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">El código más rápido del mundo no sirve si el diseño no convierte. Aplicamos metodologías CRO (Conversion Rate Optimization) para diseñar interfaces magnéticas y sin fricciones, reduciendo la carga cognitiva del usuario hasta el momento del pago o registro.</p>
                                <div className="flex flex-wrap gap-4">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">Next.js 14+</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">TailwindCSS</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">Framer Motion</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-32 px-6 relative z-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl text-center relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-600/20 blur-[100px] pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10">Construye el Futuro <br /> de tu Plataforma.</h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10">
                        Hablemos de tu próximo desafío técnico. Diseñamos la infraestructura inquebrantable que sostendrá tu crecimiento por los próximos 5 años.
                    </p>

                    <TrackedCTA
                        href="?modal=exploracion"
                        eventName="footer_consultar_factibilidad"
                        className="relative z-10 group px-12 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,229,255,0.3)] inline-flex items-center gap-3"
                    >
                        Consultar Factibilidad Técnica
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </TrackedCTA>
                </motion.div>
            </section>
        </div>
    );
}
