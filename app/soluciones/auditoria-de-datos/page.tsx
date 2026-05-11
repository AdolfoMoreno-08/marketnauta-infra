"use client";

import { useState } from "react"; // 1. Importamos useState
import { motion } from "framer-motion";
import {
    Search, Database, BarChart3, ArrowRight, ShieldCheck, Zap, Layers, LineChart
} from "lucide-react";
import AuditoriaDashboard from "@/components/blocks/AuditoriaDashboard";
import ContactModal from "@/components/blocks/ContactForm"; // 2. Importamos tu Modal

// 3. Ya no necesitamos recibir props, la página se manda sola
export default function AuditoriaPage() {
    // 4. Creamos el estado para controlar el modal
    const [isContactOpen, setIsContactOpen] = useState(false);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="min-h-screen bg-[#030712] overflow-x-hidden relative">

            {/* 5. Agregamos el Modal aquí arriba, invisible hasta que isContactOpen sea true */}
            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />

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

            {/* 1. SECCIÓN HERO: EL ESCANEO */}
            <section className="relative pt-32 pb-24 px-6 z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">

                    <motion.div
                        animate={{ y: [0, 500, 0], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-marketnauta-primary/50 to-transparent pointer-events-none hidden lg:block"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-marketnauta-primary/5 border border-marketnauta-primary/20 text-marketnauta-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
                            <Zap className="w-3 h-3 fill-marketnauta-primary animate-pulse" />
                            System.Audit // v2.0
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter title-gradient mb-8">
                            Auditoría de <br />
                            <span className="text-white relative">
                                Integridad y Trazabilidad
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-50" />
                            </span> <br />
                            de Datos.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
                            Tu empresa genera miles de datos por segundo, pero tu atribución sigue a oscuras. Construimos ecosistemas analíticos en <span className="text-white font-medium">BigQuery</span> para que dejes de adivinar y empieces a escalar.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* 6. Actualizamos el onClick del botón del Hero */}
                            <button onClick={() => setIsContactOpen(true)} className="group px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3">
                                Iniciar Auditoría de Sistema
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotateY: -10, rotateX: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: -5, rotateX: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="relative group perspective-1000"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-marketnauta-primary/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                        <div className="relative glass-card rounded-[2.5rem] border border-white/10 bg-abisal-900/90 shadow-2xl overflow-hidden aspect-video flex items-center justify-center transform transition-transform duration-700 group-hover:rotate-y-0">
                            <AuditoriaDashboard />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. PAIN POINTS: EL OCÉANO TURBIO (ASIMÉTRICO) */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 border-b border-white/10 pb-6 inline-block">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">¿Navegando a Ciegas?</h2>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8">
                        {[
                            { col: "md:col-span-4", title: "Fugas de Atribución y Desfase de Señales", desc: "El CPA sube, pero el origen del tráfico rentable es un misterio." },
                            { col: "md:col-span-5", title: "Fragmentación de Esquemas (Data Silos)", desc: "Meta Ads dice una cosa, Google Analytics otra. Tu facturación no cuadra con los reportes." },
                            { col: "md:col-span-3", title: "Incertidumbre en la Toma de Decisiones", desc: "Escalas campañas a ciegas sin ver el impacto real." }
                        ].map((point, i) => (
                            <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.2 }} className={`${point.col} p-6 md:p-8 glass-card border border-white/5 bg-white/[0.01] rounded-3xl hover:bg-white/[0.03] transition-colors group`}>
                                <div className="h-px w-12 bg-marketnauta-primary/50 mb-6 group-hover:w-full transition-all duration-700" />
                                <h3 className="text-xl font-bold text-white tracking-tight mb-3 opacity-80 group-hover:opacity-100">{point.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{point.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. METODOLOGÍA: BENTO GRID DE SALA DE MÁQUINAS */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 title-gradient">Ingesta, Procesamiento y Claridad Absoluta.</h2>
                        <p className="text-slate-400 text-lg font-light">
                            Construimos el motor de inteligencia que tu operación necesita.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">

                        <motion.div {...fadeInUp} className="md:col-span-1 p-6 md:p-8 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-marketnauta-primary/20" />
                            <Search className="w-8 h-8 text-marketnauta-primary mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Paso 01</span>
                            <h3 className="text-2xl font-bold mb-4 text-white">Protocolos de Captura y Data Layer</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">Auditamos tu píxel y conectamos tus ecosistemas. Implementamos tracking server-side para recuperar la visibilidad.</p>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="md:col-span-2 p-6 md:p-12 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1">
                                    <Database className="w-10 h-10 text-marketnauta-primary mb-6" />
                                    <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">Paso 02 // Core</span>
                                    <h3 className="text-3xl font-display font-bold mb-4 text-white">Normalización y Data Warehousing</h3>
                                    <p className="text-slate-400 leading-relaxed">Construimos tu Data Warehouse. Extraemos datos brutos y los unificamos. Un solo océano de verdad centralizada, sin silos, propiedad 100% tuya.</p>
                                </div>
                                <div className="flex-1 w-full h-32 flex flex-col justify-center gap-3 opacity-60">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-marketnauta-primary/50" /></div>
                                    <div className="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-white/30" /></div>
                                    <div className="h-2 w-5/6 bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 1.8, delay: 0.2, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-marketnauta-primary" /></div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="md:col-span-3 p-6 md:p-8 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center gap-8 group">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Paso 03</span>
                                <h3 className="text-2xl font-bold mb-2 text-white">Modelado de BI e Inteligencia de Negocio (Looker Studio)</h3>
                                <p className="text-slate-400 text-sm max-w-3xl">Modelamos los datos para reportar atribución multi-touch, LTV real y ROI. Dashboards premium donde la complejidad matemática se traduce en direcciones claras de negocio.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. CIERRE DE CONVERSIÓN: EL FARO MINIMALISTA */}
            <section className="py-32 px-6 relative z-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl text-center relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-marketnauta-primary/20 blur-[100px] pointer-events-none" />

                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10">Recalibra tu Estrategia Hoy.</h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10">
                        Agenda una sesión de exploración. Analizaremos tu arquitectura actual y trazaremos el mapa hacia la trazabilidad total.
                    </p>

                    {/* 7. Actualizamos el onClick del botón final */}
                    <button onClick={() => setIsContactOpen(true)} className="relative z-10 group px-12 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,229,255,0.3)] inline-flex items-center gap-3">
                        Solicitar Auditoría de Infraestructura
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>
            </section>

        </div>
    );
}