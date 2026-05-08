"use client";

import { motion } from "framer-motion";
import { Database, TrendingUp, Code2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        title: "Auditoría de Datos",
        description: "Eliminamos los puntos ciegos de tu atribución. Centralizamos tu data en BigQuery y Looker Studio para una claridad total.",
        icon: <Database className="w-6 h-6" />,
        href: "/soluciones/auditoria-de-datos",
        className: "md:col-span-2",
    },
    {
        title: "Gestión de Pauta",
        description: "Performance marketing algorítmico diseñado para escalar tu ROAS.",
        icon: <TrendingUp className="w-6 h-6" />,
        href: "/soluciones/gestion-de-pauta",
        className: "md:col-span-1",
    },
    {
        title: "Desarrollo & Estrategia",
        description: "Infraestructura web escalable construida con Next.js y Tailwind CSS.",
        icon: <Code2 className="w-6 h-6" />,
        href: "/soluciones/desarrollo-y-estrategia",
        className: "md:col-span-3",
    },
];

export default function SolutionsGrid() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {solutions.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={item.href}
                            className={`group glass-card p-8 rounded-3xl flex flex-col justify-between h-[300px] hover:border-marketnauta-primary/30 transition-all duration-500 block relative overflow-hidden ${item.className}`}
                        >
                            {/* Efecto de luz interna al hacer hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-marketnauta-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-abisal-900 border border-white/10 flex items-center justify-center text-marketnauta-primary mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-400 max-w-md">{item.description}</p>
                            </div>

                            <div className="flex items-center gap-2 text-marketnauta-primary font-semibold text-sm mt-4">
                                Explorar Solución <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}