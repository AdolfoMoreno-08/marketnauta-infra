"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacidadPage() {
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
                    <ShieldCheck className="w-12 h-12 text-marketnauta-primary mb-6" />
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Política de Privacidad</h1>

                    <div className="space-y-6 font-light leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Recolección de Datos</h2>
                            <p>En Marketnauta, recolectamos información necesaria para la gestión de pauta y auditoría de datos, incluyendo identificadores de dispositivos y comportamiento de navegación a través de Google Analytics 4 bajo protocolos de consentimiento estricto.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. Uso de la Información</h2>
                            <p>Los datos obtenidos se utilizan exclusivamente para optimizar la trazabilidad de campañas y mejorar la experiencia de usuario. No vendemos ni compartimos datos con terceros para fines comerciales ajenos a la operación de la agencia.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. Almacenamiento y Seguridad</h2>
                            <p>Toda la información es procesada en infraestructuras seguras de Google Cloud Platform y BigQuery, garantizando la integridad y confidencialidad mediante cifrado de extremo a extremo.</p>
                        </section>

                        <p className="text-sm pt-8 border-t border-white/5 text-slate-500">
                            Última actualización: Mayo 2026
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}