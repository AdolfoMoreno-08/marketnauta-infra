"use client";

import { motion } from "framer-motion";

const steps = [
    { id: "01", title: "Exploración de Datos", desc: "Sumergimos nuestro equipo en tu infraestructura actual para identificar fugas de atribución y silos de información." },
    { id: "02", title: "Arquitectura Táctica", desc: "Diseñamos el ecosistema en BigQuery y el stack tecnológico que sostendrá tu escalamiento." },
    { id: "03", title: "Propulsión & Escala", desc: "Encendemos los motores de pauta bajo un monitoreo algorítmico 24/7 centrado en el ROAS real." }
];

export default function Methodology() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-16 title-gradient text-center">Nuestra Metodología</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative p-8 glass-card rounded-[2.5rem] border-white/5 group hover:border-marketnauta-primary/30 transition-all"
                        >
                            <span className="text-8xl font-display font-bold absolute -top-10 -left-4 text-white/[0.03] group-hover:text-marketnauta-primary/10 transition-colors">
                                {step.id}
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed relative z-10">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}