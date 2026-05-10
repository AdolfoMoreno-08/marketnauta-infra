"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, X, Terminal, AlertCircle, Fuel } from "lucide-react";
import SubmitButton from "@/components/blocks/SubmitButton";
import * as fbq from "@/lib/fpixel";
import * as gtm from "@/lib/gtm";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<FormStatus>("idle");
    const [loadingText, setLoadingText] = useState("Iniciando secuencia...");

    const [formData, setFormData] = useState({
        challenge: "",
        volume: "",
        budget: "",
        name: "",
        company: "",
        email: "",
        phone: "",
        url: "",
        botField: "" // 1. Campo Honeypot en el estado
    });

    const handleBack = () => {
        if (status === "idle") setStep((prev) => Math.max(1, prev - 1));
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Backspace" && step > 1) {
                if (document.activeElement?.tagName !== "INPUT") handleBack();
            }
            if (step === 1 && ["1", "2", "3"].includes(e.key)) {
                const options = ["Trazabilidad y Visualización de Datos", "Escalabilidad en Pauta (Growth)", "Infraestructura Web y Performance"];
                handleSelection("challenge", options[parseInt(e.key) - 1], 2);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, step, onClose]);

    useEffect(() => {
        if (step === 3 && status === "idle") {
            setTimeout(() => nameInputRef.current?.focus(), 150);
        }
    }, [step, status]);

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setStatus("idle");
                    setStep(1);
                    setFormData({
                        challenge: "", volume: "", budget: "", name: "",
                        company: "", email: "", phone: "", url: "", botField: ""
                    });
                }, 500);
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [status, onClose]);

    const handleSelection = (field: string, value: string, nextStep: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setStep(nextStep);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        const getGoogleClientId = () => {
            try {
                const match = document.cookie.match(/_ga=(.+?);/);
                return match && match[1] ? match[1].split('.').slice(-2).join('.') : null;
            } catch { return null; }
        };

        const googleClientId = getGoogleClientId();
        const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const phases = ["Estableciendo conexión segura...", "Encriptando metadatos...", "Transmitiendo señal a Marketnauta..."];

        try {
            const apiCall = fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    eventId,
                    googleClientId,
                    userAgent: navigator.userAgent
                }),
            });

            for (const phase of phases) {
                setLoadingText(phase);
                await new Promise(res => setTimeout(res, 800));
            }

            const response = await apiCall;

            if (response.ok) {
                setStatus("success");
                fbq.event('Lead', {
                    content_name: formData.challenge,
                    value: 0.00,
                    currency: 'USD',
                    eventID: eventId
                });
                gtm.pushToDataLayer({
                    event: 'lead_conversion',
                    event_id: eventId,
                    lead_type: formData.challenge,
                    lead_budget_range: formData.budget,
                    lead_company_size: formData.volume,
                    lead_location: 'Web_Terminal_v1'
                });
            } else { setStatus("error"); }
        } catch { setStatus("error"); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-abisal-950/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-2xl glass-card rounded-[2rem] border border-white/10 bg-abisal-900/95 overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col">

                <div className="h-1 w-full bg-white/5">
                    <motion.div className="h-full bg-marketnauta-primary" initial={{ width: "33%" }} animate={{ width: status === "success" ? "100%" : `${(step / 3) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>

                <div className="p-8 md:p-12">
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
                        <AnimatePresence>
                            {step > 1 && status === "idle" && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-slate-500 hover:text-marketnauta-primary transition-colors font-mono text-[10px] uppercase tracking-widest"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Volver
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <button onClick={onClose} className="ml-auto text-slate-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {(status === "idle" || status === "sending") && (
                            <form onSubmit={handleSubmit} key="form-ui">

                                {/* 2. INPUT HONEYPOT: Invisible para humanos, trampa para bots */}
                                <div className="hidden" aria-hidden="true">
                                    <input
                                        type="text"
                                        name="hp_field"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={formData.botField}
                                        onChange={e => setFormData({ ...formData, botField: e.target.value })}
                                    />
                                </div>

                                {step === 1 && (
                                    <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="min-h-[400px]">
                                        <div className="flex items-center gap-2 text-marketnauta-primary mt-4 mb-4 font-mono text-[10px] uppercase tracking-[0.3em]">
                                            <Terminal className="w-4 h-4" /> Fase 01 // Calibración
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">¿Qué área presenta el mayor punto ciego?</h3>
                                        <div className="space-y-3">
                                            {["Trazabilidad y Visualización de Datos", "Escalabilidad en Pauta (Growth)", "Infraestructura Web y Performance"].map((t, i) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => handleSelection("challenge", t, 2)}
                                                    className={`w-full p-5 rounded-2xl border text-left flex justify-between items-center group transition-all ${formData.challenge === t
                                                        ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white'
                                                        : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-marketnauta-primary/10'
                                                        }`}
                                                >
                                                    <span><span className="text-xs font-mono text-slate-500 mr-4">[{i + 1}]</span>{t}</span>
                                                    <ChevronRight className={`w-4 h-4 text-marketnauta-primary transition-all ${formData.challenge === t ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                {step === 2 && (
                                    <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="min-h-[400px]">
                                        <div className="flex items-center gap-2 text-marketnauta-primary mt-4 mb-4 font-mono text-[10px] uppercase tracking-[0.3em]">
                                            <Terminal className="w-4 h-4" /> Fase 02 // Dimensionamiento
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <label className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4 block">Escala de Operación</label>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {["Startup", "Pyme / Mediana", "Corporativa"].map((v) => (
                                                        <button key={v} type="button" onClick={() => setFormData({ ...formData, volume: v })} className={`py-3 px-4 rounded-xl border text-sm transition-all ${formData.volume === v ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-400'}`}>
                                                            {v}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4 block flex items-center gap-2">
                                                    <Fuel className="w-3 h-3" /> Asignación de Recursos Mensuales
                                                </label>
                                                <div className="space-y-2">
                                                    {["Menos de S/ 2,500", "S/ 2,500 - S/ 6,000", "Más de S/ 6,000", "No invierto actualmente"].map((b) => (
                                                        <button
                                                            key={b}
                                                            type="button"
                                                            onClick={() => handleSelection("budget", b, 3)}
                                                            className={`w-full py-3 px-6 rounded-full border text-left text-sm transition-all ${formData.budget === b
                                                                ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white'
                                                                : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-marketnauta-primary/10'
                                                                }`}
                                                        >
                                                            {b}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {step === 3 && (
                                    <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="min-h-[450px] mt-4 flex flex-col">
                                        <div className="mb-10">
                                            <div className="flex items-center gap-2 text-marketnauta-primary mb-3 font-mono text-[10px] uppercase tracking-[0.3em]">
                                                <Terminal className="w-4 h-4" /> Fase 03 // Enlace
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Datos de Transmisión</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 flex-grow">
                                            {[
                                                { id: "name", label: "Responsable", type: "text", k: "name", col: "md:col-span-1" },
                                                { id: "company", label: "Compañía", type: "text", k: "company", col: "md:col-span-1" },
                                                { id: "email", label: "Email Corporativo", type: "email", k: "email", col: "md:col-span-2" },
                                                { id: "phone", label: "WhatsApp de Enlace", type: "tel", k: "phone", col: "md:col-span-1" },
                                                { id: "url", label: "URL del Sitio", type: "url", k: "url", col: "md:col-span-1" }
                                            ].map((field) => (
                                                <div key={field.id} className={`relative group ${field.col}`}>
                                                    <input ref={field.id === "name" ? nameInputRef : null} type={field.type} id={field.id} placeholder=" " required={field.id !== "url"} value={formData[field.k as keyof typeof formData]} onChange={e => setFormData({ ...formData, [field.k]: e.target.value })} className="peer block w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-marketnauta-primary transition-all duration-300" />
                                                    <label htmlFor={field.id} className="absolute left-0 top-2 text-slate-500 text-sm transition-all duration-300 pointer-events-none font-sans peer-focus:-top-7 peer-focus:text-[10px] peer-focus:text-marketnauta-primary peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:font-mono peer-[:not(:placeholder-shown)]:-top-7 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-marketnauta-primary peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:font-mono">
                                                        {field.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-12">
                                            <SubmitButton status={status} loadingText={loadingText} />
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        )}
                        {status === "success" && (
                            <motion.div key="success-ui" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-12 px-6">
                                <div className="relative mb-8">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full bg-marketnauta-primary/30" />
                                    <div className="relative w-20 h-20 rounded-full bg-marketnauta-primary/10 border border-marketnauta-primary/40 flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-marketnauta-primary" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-display font-bold text-white mb-4">Señal Decodificada.</h3>
                                <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-left">
                                    <div className="flex justify-between text-slate-500 mb-2"><span>Status: Confirmed</span><span>{new Date().toLocaleTimeString()}</span></div>
                                    <div className="text-marketnauta-primary/70 break-all">TX_HASH: {Math.random().toString(36).substring(2, 15).toUpperCase()}</div>
                                </div>
                                <p className="mt-8 text-[9px] text-slate-600 uppercase tracking-widest animate-pulse">Cerrando Terminal...</p>
                            </motion.div>
                        )}
                        {status === "error" && (
                            <motion.div key="error-ui" className="text-center py-12 flex flex-col items-center">
                                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-4">Falla de Enlace</h3>
                                <button onClick={() => setStatus("idle")} className="text-marketnauta-primary font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">[ Reintentar Transmisión ]</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}