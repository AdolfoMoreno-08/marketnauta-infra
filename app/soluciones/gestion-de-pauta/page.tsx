"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, ArrowRight, Rocket, Activity, BarChart3, Network, Crosshair } from "lucide-react";
import GrowthChart from "@/components/blocks/GrowthChart";
import TrackedCTA from "@/components/blocks/TrackedCTA"; // Importamos el CTA con tracking

export default function GrowthPage() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="min-h-screen bg-[#030712] overflow-x-hidden relative">

            {/* BACKGROUND: Océano de Datos & Resplandores */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-marketnauta-primary/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), 
                                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* 1. HERO: PROPULSIÓN DE RENDIMIENTO */}
            <section className="relative pt-32 pb-24 px-6 z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-marketnauta-primary/5 border border-marketnauta-primary/20 text-marketnauta-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
                            <Rocket className="w-3 h-3 text-marketnauta-primary animate-pulse" />
                            Performance Engine // Scale
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter title-gradient mb-8">
                            Acelera tu Adquisición <br />
                            <span className="text-white relative">
                                Sin Perder el Rumbo.
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-50" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
                            Dejamos atrás la pauta convencional. Utilizamos inteligencia de datos para escalar tu inversión donde el retorno es matemático, no especulativo. <span className="text-white font-medium">Performance diseñado para la escala.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Reemplazamos el button por TrackedCTA */}
                            <TrackedCTA
                                href="?modal=exploracion"
                                eventName="hero_activar_motor_escala"
                                className="group px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 w-fit"
                            >
                                Activar Motor de Escala
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </TrackedCTA>
                        </div>
                    </motion.div>

                    {/* GROWTH TERMINAL CON PERSPECTIVA 3D */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotateY: 10, rotateX: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 5, rotateX: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="relative group perspective-1000"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-l from-marketnauta-primary/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />

                        <div className="relative glass-card rounded-2xl border border-white/10 bg-abisal-900/90 shadow-2xl overflow-hidden transform transition-transform duration-700 group-hover:rotate-y-0">
                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                                <div className="w-2.5 h-2.5 rounded-full bg-marketnauta-primary animate-pulse" />
                                <span className="ml-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Marketnauta_Scaling_Engine.exe</span>
                            </div>
                            <div className="p-2">
                                <GrowthChart />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. PAIN POINTS: ASIMETRÍA DEL COSTO DE INEFICIENCIA */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 border-b border-white/10 pb-6 inline-block">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Anomalías y Techos de Rendimiento</h2>
                    </div>

                    <div className="grid md:grid-cols-12 gap-6">
                        {[
                            { col: "md:col-span-5", icon: <Zap />, title: "Presupuestos Estancados", desc: "Inviertes más, pero el algoritmo se asfixia. El CPA sube proporcionalmente, erosionando tu margen de contribución." },
                            { col: "md:col-span-7", icon: <Target />, title: "Segmentación Genérica", desc: "Tus campañas disparan al montón. Al no nutrir el píxel con datos cualificados (LTV, compras recurrentes), generas volumen sin densidad de valor." },
                            { col: "md:col-span-12", icon: <Activity />, title: "Falta de Experimentación Científica", desc: "La ausencia de A/B testing estructurado y medición de incrementalidad te impide descubrir nuevas rutas de rentabilidad. Solo repites lo que funcionó el mes pasado." }
                        ].map((item, i) => (
                            <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className={`${item.col} p-8 glass-card border border-white/5 bg-white/[0.01] rounded-3xl hover:bg-white/[0.03] transition-colors group flex flex-col md:flex-row gap-6 items-start`}>
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-marketnauta-primary group-hover:bg-marketnauta-primary/10 transition-all duration-500">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight mb-3 opacity-80 group-hover:opacity-100">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm max-w-2xl">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. METODOLOGÍA: BENTO GRID DE CRECIMIENTO */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 title-gradient">Ingeniería de Crecimiento.</h2>
                            <p className="text-slate-400 text-lg font-light">Combinamos ciencia de datos aplicada con ejecución algorítmica de alto impacto.</p>
                        </div>
                        <div className="text-marketnauta-primary font-mono text-[10px] tracking-[0.3em] border-b border-marketnauta-primary/30 pb-2">
                            ESTRATEGIA // PERFORMANCE // ESCALA
                        </div>
                    </div>

                    {/* BENTO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">

                        {/* Bloque 1: Arquitectura (Grande) */}
                        <motion.div {...fadeInUp} className="md:col-span-8 p-10 rounded-[2rem] glass-card border border-white/5 bg-abisal-900/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-marketnauta-primary/5 rounded-full blur-[80px] group-hover:bg-marketnauta-primary/10 transition-colors" />
                            <Network className="w-8 h-8 text-marketnauta-primary mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">PHASE_01</span>
                            <h3 className="text-2xl font-bold mb-4 text-white">Arquitectura de Funnels & Señales</h3>
                            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">No encendemos pauta sin cimientos. Verificamos la calidad del dato que enviamos a Meta/Google, implementamos CAPI y diseñamos rutas de conversión optimizadas específicamente para el *buyer journey* de tu cliente ideal.</p>
                        </motion.div>

                        {/* Bloque 2: Optimización LTV (Cuadrado) */}
                        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="md:col-span-4 p-10 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent group">
                            <Crosshair className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">PHASE_02</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Optimización por LTV</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Entrenamos a los algoritmos para buscar rentabilidad a largo plazo, no conversiones baratas de una sola vez.</p>
                        </motion.div>

                        {/* Bloque 3: Escalamiento e Incrementalidad (Ancho completo) */}
                        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="md:col-span-12 p-10 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 flex flex-col md:flex-row items-center gap-10 group relative overflow-hidden">
                            <div
                                className="absolute inset-0 opacity-[0.02]"
                                style={{
                                    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), 
                                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }}
                            />
                            <div className="flex-1 relative z-10">
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">PHASE_03 // SCALE</span>
                                <h3 className="text-3xl font-display font-bold mb-4 text-white">Escalamiento e Incrementalidad</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">Cuando encontramos la tracción, inyectamos volumen. Expandimos audiencias cruzando datos de retención, utilizamos scripts de automatización para gestión de pujas y testeamos creatividades a escala industrial sin romper el CPA.</p>
                            </div>
                            <div className="w-32 h-32 shrink-0 rounded-full border-[4px] border-marketnauta-primary/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-t-[4px] border-marketnauta-primary animate-spin" style={{ animationDuration: '3s' }} />
                                <TrendingUp className="w-10 h-10 text-marketnauta-primary" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-32 px-6 relative z-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl text-center relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 blur-[100px] pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10">¿Listo para encender <br /> los motores?</h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10">
                        Hablemos de tus objetivos de escala. Analizaremos tu pauta actual y trazaremos la ruta hacia tu siguiente nivel de eficiencia.
                    </p>

                    {/* --- AQUÍ USAMOS TrackedCTA --- */}
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
