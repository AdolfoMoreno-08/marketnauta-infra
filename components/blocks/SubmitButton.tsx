"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SubmitButtonProps {
    status: "idle" | "sending" | "success" | "error";
    loadingText?: string;
}

export default function SubmitButton({ status, loadingText = "Procesando..." }: SubmitButtonProps) {
    return (
        <motion.button
            type="submit"
            disabled={status === "sending" || status === "success"}
            // Animación de Glow Exterior (Se aplica al botón para que no se corte)
            animate={{
                boxShadow:
                    status === "success"
                        ? "0 0 30px 2px rgba(16, 185, 129, 0.6)" // Glow Esmeralda potente
                        : status === "error"
                            ? "0 0 20px 2px rgba(239, 68, 68, 0.3)"  // Glow Rojo sutil
                            : "0 0 0px rgba(0,0,0,0)",             // Sin glow
                scale: status === "success" ? 1.02 : 1,        // Ligera expansión al triunfar
            }}
            transition={{ duration: 0.5 }}
            className="relative w-full py-5 rounded-xl font-bold text-lg transition-all duration-500 overflow-hidden group border border-white/5"
        >
            {/* Fondo dinámico según estado */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{
                    backgroundColor:
                        status === "success" ? "#10b981" : // Esmeralda
                            status === "error" ? "#ef4444" :   // Rojo
                                "#00E5FF",                         // Cian Marketnauta
                }}
            />

            {/* Efecto de Brillo en Hover (Sweep) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10" />

            <div className="relative z-20 flex items-center justify-center gap-3 text-abisal-950">
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3"
                        >
                            Transmitir Señal
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.div>
                    )}

                    {status === "sending" && (
                        <motion.div
                            key="sending"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3"
                        >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {loadingText}
                        </motion.div>
                    )}

                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 text-white"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Señal Recibida
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 text-white"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Fallo en la Red
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
}