"use client";

import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, Mail, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import TrackedCTA from "@/components/blocks/TrackedCTA";
import RelatedServices from "@/components/blocks/RelatedServices";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";

interface FaqItem { q: string; a: string; }
interface Props { faqs: FaqItem[]; }

function WhatsAppCrmViz() {
    const steps = [
        { icon: ShoppingCart, label: "Carrito abandonado", meta: "40% sin recuperar", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
        { icon: MessageCircle, label: "WhatsApp automático", meta: "Disparo en < 30 min", color: "text-marketnauta-primary", bg: "bg-marketnauta-primary/10 border-marketnauta-primary/20" },
        { icon: RefreshCw, label: "Venta recuperada", meta: "+15% tasa típica", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    ];
    return (
        <div className="glass-card rounded-[2rem] border border-white/10 bg-abisal-900/90 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-marketnauta-primary animate-pulse" />
                <span className="ml-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest">Retention_CRM.flow</span>
            </div>
            <div className="p-6 flex flex-col gap-1.5">
                {steps.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i}>
                            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${s.bg}`}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 shrink-0">
                                    <Icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">{s.label}</p>
                                    <p className={`text-[11px] font-mono mt-0.5 ${s.color}`}>{s.meta}</p>
                                </div>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="flex justify-center my-1">
                                    <motion.span
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                                        className="text-slate-600 text-sm font-mono"
                                    >↓</motion.span>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                        { v: "98%", l: "Apertura WA" },
                        { v: "+15%", l: "Recuperación" },
                        { v: "×0", l: "Pauta extra" },
                    ].map((m, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                            <p className="text-lg font-bold text-marketnauta-primary">{m.v}</p>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">{m.l}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ActivacionRetencionPageContent({ faqs }: Props) {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 }
    };

    return (
        <div className="min-h-screen bg-[#030712] overflow-x-hidden relative">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[150px]" />
                <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] bg-marketnauta-primary/10 rounded-full blur-[150px]" />
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
                { label: "Activación & Retención" },
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
                            <MessageCircle className="w-3 h-3 text-marketnauta-primary animate-pulse" />
                            Retention Engine // Activate
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-bold leading-[1.05] tracking-tighter title-gradient mb-8">
                            El tráfico ya<br />
                            lo pagaste.<br />
                            <span className="text-white relative">
                                Ahora recupéralo.
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary to-transparent opacity-50" />
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-xl">
                            En Perú el ecommerce convierte cerca del <span className="text-white font-medium">0,5%</span> y hasta <span className="text-white font-medium">40%</span> de los carritos se abandona. Activamos tu dato propio —en{" "}
                            <Link href="/soluciones/auditoria-de-datos" data-evt="internal_link_click" data-from-layer={3} data-to-layer={1} data-link-position="hero" className="text-marketnauta-primary underline-offset-4 hover:underline">
                                BigQuery
                            </Link>
                            — para recuperar ventas con WhatsApp y email, sin gastar más en pauta.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <TrackedCTA
                                href="?modal=auditoria"
                                eventName="hero_activacion_cta"
                                className="group px-8 py-5 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-lg hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 w-fit"
                            >
                                Diagnóstico de retención
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </TrackedCTA>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotateY: 10, rotateX: 5 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 5, rotateX: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="relative group perspective-1000"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-l from-violet-600/20 to-marketnauta-primary/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                        <div className="relative transform transition-transform duration-700">
                            <WhatsAppCrmViz />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* PAIN POINTS */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 border-b border-white/10 pb-6 inline-block">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">¿Tráfico sin retención?</h2>
                    </div>
                    <div className="grid md:grid-cols-12 gap-8">
                        {[
                            { col: "md:col-span-5", title: "El 40% de carritos se abandona sin recuperar", desc: "Causas internas —velocidad, proceso de pago, precio percibido— que no se resuelven gastando más en adquisición." },
                            { col: "md:col-span-4", title: "Email masivo que llega en el momento incorrecto", desc: "Campañas broadcast con tasas de apertura del 10%. El dato de comportamiento existe pero no se usa para disparar mensajes." },
                            { col: "md:col-span-3", title: "Sin dato propio, dependes de la pauta para retener", desc: "Cada venta que no fidelizas es presupuesto perdido. La retención escala el LTV sin escalar el costo de adquisición." },
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
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 title-gradient">Activa, Retén y Multiplica.</h2>
                        <p className="text-slate-400 text-lg font-light">El dato que ya capturamos para ti se convierte en ventas automatizadas.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">

                        <motion.div {...fadeInUp} className="md:col-span-7 p-6 md:p-10 rounded-[2rem] glass-card border border-marketnauta-primary/20 bg-abisal-900/60 relative overflow-hidden group flex flex-col md:flex-row items-center gap-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] group-hover:bg-violet-600/10 transition-colors" />
                            <div className="flex-1 relative z-10">
                                <MessageCircle className="w-8 h-8 text-marketnauta-primary mb-6" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">RETENER_01 // Core</span>
                                <h3 className="text-2xl font-display font-bold mb-4 text-white">WhatsApp Business como CRM</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">El canal #1 de apertura en Perú convertido en motor de ventas. Flujos automatizados con intervención humana en los momentos críticos: cotización, seguimiento y recompra. Cada conversación queda registrada sobre tu propio dato.</p>
                            </div>
                            <div className="w-full md:w-40 shrink-0 grid gap-4 relative z-10">
                                <div className="p-4 glass-card rounded-2xl text-center border-marketnauta-primary/20 bg-white/[0.02]">
                                    <p className="text-3xl font-bold text-white">98%</p>
                                    <p className="text-[9px] text-marketnauta-primary uppercase tracking-widest font-mono mt-1">Apertura WA</p>
                                </div>
                                <div className="p-4 glass-card rounded-2xl text-center border-white/5 bg-white/[0.01]">
                                    <p className="text-2xl font-bold text-white">#1</p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">Canal Perú</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent group">
                            <ShoppingCart className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">RETENER_02</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Recuperación de Carritos</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Secuencias email + WhatsApp segmentadas por intención de compra. Atacamos directo al 40% de abandono por causas internas. Ventas que ya estaban a un clic, recuperadas sin gastar un sol más en pauta.</p>
                        </motion.div>

                        <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="md:col-span-5 p-6 md:p-10 rounded-[2rem] glass-card border border-white/5 bg-white/[0.01] group">
                            <Mail className="w-8 h-8 text-white opacity-50 group-hover:opacity-100 group-hover:text-marketnauta-primary transition-all mb-6" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">RETENER_03</span>
                            <h3 className="text-xl font-bold mb-4 text-white">Email por Comportamiento</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Disparadores según lo que el usuario hace o deja de hacer: bienvenida, post-compra, reactivación. ROI alto porque llegan en el momento correcto. Medido server-side de punta a punta.</p>
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
                                <Sparkles className="w-8 h-8 text-marketnauta-primary mb-6" />
                                <span className="text-[10px] font-mono text-marketnauta-primary uppercase tracking-widest block mb-2">RETENER_04 // AI</span>
                                <h3 className="text-3xl font-display font-bold mb-4 text-white">Personalización Dinámica</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">La misma web, distinta para cada visitante. Adaptamos contenido y oferta según origen de tráfico, industria y momento del funnel, aprovechando los{" "}
                                    <Link href="/soluciones/inteligencia-predictiva" data-evt="internal_link_click" data-from-layer={3} data-to-layer={4} data-link-position="content" className="text-marketnauta-primary underline-offset-4 hover:underline">
                                        segmentos predictivos de la capa ANTICIPAR
                                    </Link>.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">BigQuery</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">WhatsApp API</span>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-slate-300">Klaviyo / ActiveCampaign</span>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/20 blur-[100px] pointer-events-none" />
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white relative z-10">Convierte Datos en<br />Ingresos Recurrentes.</h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto relative z-10">
                        Agenda una sesión de diagnóstico. Analizamos tus tasas de abandono actuales y diseñamos el plan de retención que tu ecommerce necesita.
                    </p>
                    <TrackedCTA
                        href="?modal=auditoria"
                        eventName="footer_activacion_retencion"
                        className="relative z-10 group px-12 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,229,255,0.3)] inline-flex items-center gap-3"
                    >
                        Activar plan de retención
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </TrackedCTA>
                </motion.div>
            </section>

            <RelatedServices step={3} />
        </div>
    );
}
