"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingDown, Users, Tag, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
import TrackedCTA from "@/components/blocks/TrackedCTA";
import RelatedServices from "@/components/blocks/RelatedServices";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";

interface FaqItem { q: string; a: string; }
interface Props { faqs: FaqItem[]; }

function PredictionModelViz() {
    const entries = [
        { id: "USR_2847", score: 94, label: "RECOMPRA", color: "text-emerald-400", bar: "bg-emerald-400" },
        { id: "USR_1923", score: 62, label: "NEUTRO",   color: "text-yellow-400",  bar: "bg-yellow-400"  },
        { id: "USR_5541", score: 28, label: "CHURN",    color: "text-red-400",     bar: "bg-red-400"     },
        { id: "USR_3302", score: 87, label: "RECOMPRA", color: "text-emerald-400", bar: "bg-emerald-400" },
        { id: "USR_7714", score: 19, label: "CHURN",    color: "text-red-400",     bar: "bg-red-400"     },
    ];
    return (
        <div className="glass-card rounded-[2rem] border border-white/10 bg-abisal-900/90 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-marketnauta-primary animate-pulse" />
                <span className="ml-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Churn_Prediction_Model.py</span>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-[1fr_1.5fr_auto] gap-3 mb-3 px-1">
                    {["Cliente", "Score", "Señal"].map(h => (
                        <span key={h} className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{h}</span>
                    ))}
                </div>
                <div className="flex flex-col">
                    {entries.map((e, i) => (
                        <motion.div
                            key={e.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.4 }}
                            className="grid grid-cols-[1fr_1.5fr_auto] gap-3 items-center py-2.5 border-b border-white/[0.04] last:border-none"
                        >
                            <span className="text-[11px] font-mono text-slate-400 truncate">{e.id}</span>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${e.score}%` }}
                                        transition={{ delay: i * 0.12 + 0.25, duration: 0.7, ease: "easeOut" }}
                                        className={`h-full rounded-full ${e.bar}`}
                                    />
                                </div>
                                <span className="text-[11px] font-mono text-white w-7 text-right">{e.score}</span>
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${e.color} whitespace-nowrap`}>{e.label}</span>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-between px-1 pt-3 border-t border-white/5">
                    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Model Accuracy</span>
                    <span className="text-marketnauta-primary font-mono text-sm font-bold">87.4%</span>
                </div>
            </div>
        </div>
    );
}

export default function InteligenciaPredictivaPageContent({ faqs }: Props) {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="min-h-screen bg-[#030712] overflow-x-hidden relative">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-marketnauta-primary/10 rounded-full blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <Breadcrumbs items={[
                { label: "Inicio", href: "/" },
                { label: "Soluciones", href: "/#soluciones" },
                { label: "Inteligencia Predictiva" },
            ]} />

            {/* HERO */}
            <section className="relative pt-12 pb-24 px-6 z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-marketnauta-primary/5 border border-marketnauta-primary/20 text-marketnauta-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-8">
                            <Brain className="w-3 h-3 text-marketnauta-primary animate-pulse" />
                            Prediction Engine // Anticipate
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter title-gradient mb-8">
                            Deja de reaccionar.<br />
                            <span className="text-white relative">
                                Empieza a anticipar.
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-50" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
                            La capa de mayor margen y la más difícil de copiar: requiere el dato que ya administramos para ti. Sobre tu información en <span className="text-white font-medium">BigQuery</span> construimos modelos que predicen recompra, churn y el siguiente producto —convirtiendo datos en decisiones de negocio.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <TrackedCTA
                                href="?modal=auditoria"
                                eventName="hero_predictiva_cta"
                                className="group px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 w-fit"
                            >
                                Explorar modelos predictivos
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
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-marketnauta-primary/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                        <div className="relative transform transition-transform duration-700">
                            <PredictionModelViz />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PAIN POINTS */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 border-b border-white/10 pb-6 inline-block">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">¿Reaccionas cuando ya es tarde?</h2>
                    </div>
                    <div className="grid md:grid-cols-12 gap-8">
                        {[
                            { col: "md:col-span-4", title: "Reaccionas cuando el cliente ya se fue", desc: "El churn no aparece en el CRM hasta que el cliente dejó de comprar. Para entonces, el costo de reactivación es 5× mayor que el de retención." },
                            { col: "md:col-span-5", title: "Audiencias genéricas, campañas ineficientes", desc: "Sin clustering real de comportamiento las campañas llegan a quien menos las necesita y se pierden en quien más las convertiría." },
                            { col: "md:col-span-3", title: "Precios fijos en un mercado dinámico", desc: "El Black Friday peruano y la competencia online exigen precios en tiempo real. Los precios estáticos dejan margen sobre la mesa." },
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

            {/* FEATURES BENTO */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 title-gradient">Predice, Segmenta y Actúa.</h2>
                        <p className="text-slate-400 text-lg font-light">Tu dato propio en BigQuery como motor de inteligencia competitiva.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">

                        <motion.div {...fadeInUp} className="md:col-span-8 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 relative overflow-hidden group flex flex-col md:flex-row items-center gap-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] group-hover:bg-indigo-600/10 transition-colors" />
                            <div className="flex-1 relative z-10">
                                <Sparkles className="w-8 h-8 text-marketnauta-primary mb-6" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">ANTICIPAR_01 // Core</span>
                                <h3 className="text-2xl font-display font-bold mb-4 text-white">Recomendadores con IA</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Modelos que aprenden del comportamiento real de tus compradores para sugerir el siguiente producto correcto, en la web y en campañas. Cross-sell y up-sell automático sobre el dato de{" "}
                                    <Link href="/soluciones/activacion-y-retencion" data-evt="internal_link_click" data-from-layer={4} data-to-layer={3} data-link-position="content" className="text-marketnauta-primary underline-offset-4 hover:underline">
                                        la capa de Activación
                                    </Link>.
                                </p>
                            </div>
                            <div className="w-full md:w-40 shrink-0 grid gap-4 relative z-10">
                                <div className="p-4 glass-card rounded-2xl text-center border-marketnauta-primary/20 bg-white/[0.02]">
                                    <p className="text-3xl font-bold text-white">2.3×</p>
                                    <p className="text-[9px] text-marketnauta-primary uppercase tracking-widest font-mono mt-1">Ticket Prom.</p>
                                </div>
                                <div className="p-4 glass-card rounded-2xl text-center border-white/5 bg-white/[0.01]">
                                    <p className="text-2xl font-bold text-white">AI</p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">Sobre tu dato</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="md:col-span-4 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent group">
                            <TrendingDown className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">ANTICIPAR_02</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Churn & Recompra</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Scoring de probabilidad de fuga y recompra. Priorizamos la retención donde más vale: el equipo actúa antes de perder al cliente, con precisión del 87%.</p>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] group">
                            <Users className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">ANTICIPAR_03</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Segmentación por Clustering</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Audiencias reales agrupadas por patrón de compra, no por demografía genérica. Insumo directo para campañas y CRM hiperdirigidos que convierten más con menos presupuesto.</p>
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
                                <Tag className="w-8 h-8 text-marketnauta-primary mb-6" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">ANTICIPAR_04 // Pricing</span>
                                <h3 className="text-3xl font-display font-bold mb-4 text-white">Inteligencia Competitiva y de Precios</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">Pricing dinámico para el Black Friday peruano y picos de demanda. Monitoreamos competencia y recomendamos precios por producto según estacionalidad, para escalar margen con el{" "}
                                    <Link href="/soluciones/gestion-de-pauta" data-evt="internal_link_click" data-from-layer={4} data-to-layer={5} data-link-position="content" className="text-marketnauta-primary underline-offset-4 hover:underline">
                                        Motor de Performance
                                    </Link>.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">BigQuery ML</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">Vertex AI</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">Python / dbt</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6 relative z-10 max-w-3xl mx-auto" aria-label="Preguntas frecuentes">
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-10 tracking-tight">Preguntas frecuentes</h2>
                <div className="space-y-5">
                    {faqs.map((f) => (
                        <details key={f.q} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                            <summary className="cursor-pointer text-white font-medium text-base list-none flex justify-between gap-4">
                                {f.q}
                                <span className="text-marketnauta-primary group-open:rotate-45 transition-transform shrink-0">+</span>
                            </summary>
                            <p className="text-slate-400 text-sm font-light leading-relaxed mt-3">{f.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 relative z-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl text-center relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/20 blur-[100px] pointer-events-none" />
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10">Anticipa el Próximo<br />Movimiento de tu Cliente.</h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10">
                        Agenda una sesión de exploración. Construimos el modelo predictivo que convierte tu dato en BigQuery en decisiones de negocio con ventaja competitiva real.
                    </p>
                    <TrackedCTA
                        href="?modal=auditoria"
                        eventName="footer_inteligencia_predictiva"
                        className="relative z-10 group px-12 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,229,255,0.3)] inline-flex items-center gap-3"
                    >
                        Explorar modelos predictivos
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </TrackedCTA>
                </motion.div>
            </section>

            <RelatedServices step={4} />
        </div>
    );
}
