"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-300 py-32 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-marketnauta-primary hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al inicio
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 border border-white/10 rounded-[2rem] bg-white/[0.01]"
                >
                    <Scale className="w-12 h-12 text-marketnauta-primary mb-6" />
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Términos de Servicio</h1>

                    <div className="space-y-6 font-light leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de Términos</h2>
                            <p>Al acceder a los servicios de Marketnauta, el usuario acepta cumplir con las normativas vigentes en materia de protección de datos y propiedad intelectual en el ámbito del marketing digital.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. Alcance de los Servicios</h2>
                            <p>Marketnauta ofrece soluciones de auditoría, implementación técnica y gestión de infraestructura de datos. Los resultados de cada implementación dependen de la veracidad y calidad de los datos origen proporcionados por el cliente.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Propiedad Intelectual</h2>
                            <p>Toda la infraestructura de código, metodologías de auditoría y diseños presentados en este dominio son propiedad exclusiva de Marketnauta o sus licenciantes.</p>
                        </section>

                        <p className="text-sm pt-8 border-t border-white/5 text-slate-500">
                            Marketnauta - Data Engineering & Digital Marketing Agency
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}