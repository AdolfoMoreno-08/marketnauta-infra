"use client";

import { useState, useEffect, useRef } from "react";
// 1. IMPORTANTE: Agregamos useSearchParams, useRouter y usePathname
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, X, Terminal, AlertCircle, Fuel, ShieldCheck } from "lucide-react";
import SubmitButton from "@/components/blocks/SubmitButton";
import * as fbq from "@/lib/fpixel";
import * as gtm from "@/lib/gtm";

type FormStatus = "idle" | "sending" | "success" | "error";

interface StepConfig {
    title: string;
    description: string;
}

const STEP_METADATA: Record<number, StepConfig> = {
    1: { title: "Fase 01 // Calibración", description: "¿Qué área presenta el mayor punto ciego?" },
    2: { title: "Fase 02 // Dimensionamiento", description: "Configuración de escala y recursos proyectados." },
    3: { title: "Fase 03 // Enlace Directo", description: "Establece los parámetros de transmisión." }
};

// 2. YA NO RECIBE PROPS. El componente se gestiona solo.
export default function ContactForm() {
    // 3. Lógica de URL (El "Cerebro")
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const modalType = searchParams.get("modal"); // Lee ?modal=loquesea de la URL

    // Si hay un parámetro 'modal', el formulario está abierto.
    const isOpen = !!modalType;

    const nameInputRef = useRef<HTMLInputElement>(null);
    const isMounted = useRef(true);

    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<FormStatus>("idle");
    const [loadingText, setLoadingText] = useState("Iniciando secuencia...");
    const [localError, setLocalError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        challenge: "",
        volume: "",
        budget: "",
        name: "",
        company: "",
        email: "",
        phone: "",
        url: "",
        botField: ""
    });

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // 4. Si el modalType (la URL) trae "auditoria", auto-seleccionamos el primer paso
    useEffect(() => {
        if (modalType === "auditoria") {
            setFormData(prev => ({ ...prev, challenge: "Trazabilidad y Visualización de Datos" }));
        } else if (modalType === "exploracion") {
            setFormData(prev => ({ ...prev, challenge: "Escalabilidad en Pauta (Growth)" }));
        }
    }, [modalType]);

    useEffect(() => {
        setLocalError(null);
    }, [step]);

    // 5. Cierre mediante URL
    const closeForm = () => {
        router.replace(pathname, { scroll: false }); // Quita el ?modal=... sin recargar la página
        // Resetear el estado después de que la animación termine
        setTimeout(() => {
            setStep(1);
            setStatus("idle");
            setFormData({ challenge: "", volume: "", budget: "", name: "", company: "", email: "", phone: "", url: "", botField: "" });
        }, 500);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleCloseIntent();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, step, formData]);

    useEffect(() => {
        if (step === 3 && status === "idle") {
            const timer = setTimeout(() => nameInputRef.current?.focus(), 150);
            return () => clearTimeout(timer);
        }
    }, [step, status]);

    const handleBack = () => {
        if (status === "idle") setStep((prev) => Math.max(1, prev - 1));
    };

    const handleCloseIntent = () => {
        const hasInteracted = !!(formData.challenge || formData.volume || formData.budget || formData.name || formData.email);
        if (hasInteracted && step < 3 && status === "idle") {
            if (window.confirm("¿Seguro que deseas cerrar la terminal? Se perderá el progreso actual de calibración.")) {
                closeForm();
            }
        } else {
            closeForm();
        }
    };

    const handleStepNavigation = (next: boolean) => {
        if (!next) {
            handleBack();
            return;
        }

        if (step === 1) {
            if (!formData.challenge) {
                setLocalError("Selecciona una opción táctica o presiona [Omitir Fase].");
                return;
            }
            setStep(2);
        }

        if (step === 2) {
            if (!formData.budget) {
                setLocalError("Falta la Asignación Mensual. Por favor, define este criterio o selecciona [Omitir Fase].");
                return;
            }
            setStep(3);
        }
    };

    const skipStep = () => {
        if (step === 1) {
            setFormData(prev => ({ ...prev, challenge: "No especificado" }));
            setStep(2);
        } else if (step === 2) {
            setFormData(prev => ({
                ...prev,
                volume: prev.volume || "No especificado",
                budget: "No especificado"
            }));
            setStep(3);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "sending") return;

        const cleanName = formData.name.trim();
        const cleanCompany = formData.company.trim();
        const cleanEmail = formData.email.trim();
        const cleanPhone = formData.phone.trim();
        const cleanUrl = formData.url.trim();

        if (!cleanName || !cleanPhone) {
            setLocalError("Error de Enlace: Nombre y WhatsApp son coordenadas obligatorias.");
            return;
        }

        if (cleanEmail !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanEmail)) {
                setLocalError("Sintaxis inválida: Por favor ingresa un Email corporativo válido.");
                return;
            }
        }

        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\s/0-9]*$/;
        if (cleanPhone.length < 6 || !phoneRegex.test(cleanPhone)) {
            setLocalError("Sintaxis inválida: WhatsApp de enlace no parece un número de contacto válido.");
            return;
        }

        setStatus("sending");
        const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const phases = ["Estableciendo conexión segura...", "Encriptando metadatos...", "Transmitiendo señal a Marketnauta..."];

        const payload = {
            ...formData,
            volume: formData.volume || "No especificado",
            name: cleanName,
            company: cleanCompany,
            email: cleanEmail,
            phone: cleanPhone,
            url: cleanUrl,
            eventId,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"
        };

        try {
            const apiCall = fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            for (const phase of phases) {
                if (!isMounted.current) return;
                setLoadingText(phase);
                await new Promise(res => setTimeout(res, 500));
            }

            const response = await apiCall;
            if (!isMounted.current) return;

            if (response.ok) {
                setStatus("success");

                // Tu excelente configuración de Tracking se mantiene intacta
                fbq.event('Lead', {
                    content_name: payload.challenge,
                    value: 0.00,
                    currency: 'USD',
                    eventID: eventId
                });

                if (typeof window !== "undefined") {
                    const w = window as any;
                    w.dataLayer = w.dataLayer || [];
                    w.dataLayer.push({
                        event: 'form_send',
                        event_id: eventId,
                        form_type: 'contact_modal',
                        lead_challenge: payload.challenge,
                        lead_budget: payload.budget,
                        status: 'success'
                    });
                }

                gtm.pushToDataLayer({
                    event: 'lead_conversion',
                    event_id: eventId,
                    lead_type: payload.challenge,
                    lead_budget_range: payload.budget,
                    lead_company_size: payload.volume,
                    lead_location: 'Web_Terminal_v1'
                });
            } else {
                setStatus("error");
            }
        } catch {
            if (isMounted.current) setStatus("error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleCloseIntent} className="absolute inset-0 bg-abisal-950/80 backdrop-blur-xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl border border-white/10 bg-abisal-900/95 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.12)] flex flex-col justify-between min-h-[560px]"
            >
                <div>
                    <div className="grid grid-cols-3 h-1.5 w-full bg-white/5 gap-1" role="progressbar" aria-valuenow={(step / 3) * 100} aria-valuemin={0} aria-valuemax={100}>
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="relative w-full h-full bg-white/5 overflow-hidden">
                                <motion.div
                                    className="h-full bg-marketnauta-primary"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: step >= s ? "0%" : "-100%" }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="p-8 pb-0 flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="flex items-center gap-2 text-marketnauta-primary font-mono text-[10px] uppercase tracking-[0.25em]">
                                <Terminal className="w-3.5 h-3.5" /> {STEP_METADATA[step].title}
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{STEP_METADATA[step].description}</h3>
                        </div>
                        <button onClick={handleCloseIntent} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5" aria-label="Cerrar terminal">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-8 flex-grow flex flex-col justify-center py-6">
                    {localError && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {localError}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {(status === "idle" || status === "sending") && (
                            <form onSubmit={handleSubmit} className="w-full" noValidate>
                                <div className="hidden" aria-hidden="true">
                                    <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" value={formData.botField} onChange={e => setFormData({ ...formData, botField: e.target.value })} />
                                </div>

                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -15 }} className="space-y-3">
                                        {["Trazabilidad y Visualización de Datos", "Escalabilidad en Pauta (Growth)", "Infraestructura Web y Performance"].map((t) => (
                                            <button
                                                key={t} type="button"
                                                onClick={() => { setFormData({ ...formData, challenge: t }); setStep(2); }}
                                                className={`w-full p-4 rounded-xl border text-left flex justify-between items-center group transition-all duration-200 ${formData.challenge === t ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/20'}`}
                                            >
                                                <span className="text-sm font-medium">{t}</span>
                                                <ChevronRight className="w-4 h-4 text-marketnauta-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -15 }} className="space-y-6">
                                        <div className="space-y-3">
                                            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wider block">Escala de Operación (Opcional)</span>
                                            <div className="grid grid-cols-3 gap-2">
                                                {["Startup", "Pyme / Mediana", "Corporativa"].map((v) => (
                                                    <button key={v} type="button" onClick={() => { setFormData(prev => ({ ...prev, volume: v })); setLocalError(null); }} className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${formData.volume === v ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10'}`}>
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wider block flex items-center gap-1.5"><Fuel className="w-3 h-3" /> Asignación Mensual</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Menos de S/ 2,500", "S/ 2,500 - S/ 6,000", "Más de S/ 6,000", "No invierto actualmente"].map((b) => (
                                                    <button key={b} type="button" onClick={() => { setFormData(prev => ({ ...prev, budget: b })); setLocalError(null); }} className={`py-2.5 px-4 rounded-lg border text-left text-xs transition-all ${formData.budget === b ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-marketnauta-primary/10'}`}>
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { id: "name", label: "Responsable *", type: "text", k: "name", col: "md:col-span-1", auto: "name", req: true },
                                                { id: "company", label: "Compañía (Opcional)", type: "text", k: "company", col: "md:col-span-1", auto: "organization", req: false },
                                                { id: "email", label: "Email (Opcional)", type: "email", k: "email", col: "md:col-span-2", auto: "email", req: false },
                                                { id: "phone", label: "WhatsApp de Enlace *", type: "tel", k: "phone", col: "md:col-span-1", auto: "tel", req: true },
                                                { id: "url", label: "URL del Sitio (Opcional)", type: "text", k: "url", col: "md:col-span-1", auto: "url", req: false }
                                            ].map((field) => (
                                                <div key={field.id} className={`relative ${field.col}`}>
                                                    <input
                                                        ref={field.id === "name" ? nameInputRef : null}
                                                        type={field.type} id={field.id} placeholder=" "
                                                        required={field.req}
                                                        autoComplete={field.auto}
                                                        value={formData[field.k as keyof typeof formData]}
                                                        onChange={e => setFormData({ ...formData, [field.k]: e.target.value })}
                                                        className="peer block w-full bg-transparent border-b border-white/10 py-1.5 text-sm text-white outline-none focus:border-marketnauta-primary transition-colors"
                                                    />
                                                    <label htmlFor={field.id} className="absolute left-0 top-1.5 text-slate-500 text-xs transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-marketnauta-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px]">
                                                        {field.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4">
                                            <SubmitButton status={status} loadingText={loadingText} />
                                            <span className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-600 uppercase tracking-wider mt-3">
                                                <ShieldCheck className="w-3.5 h-3.5 text-marketnauta-primary/60" /> Transmisión bajo protocolo cifrado SSL
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        )}

                        {status === "success" && (
                            <motion.div key="success-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-marketnauta-primary/10 border border-marketnauta-primary/30 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-marketnauta-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Transmisión Exitosa</h3>
                                <p className="text-xs text-slate-400 mt-2 max-w-sm">Nuestra terminal ha decodificado tus coordenadas corporativas. Activando protocolos de sincronización.</p>
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

                {status === "idle" && (
                    <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between min-h-[73px]">
                        <div>
                            {step > 1 && (
                                <button type="button" onClick={() => handleStepNavigation(false)} className="flex items-center gap-1.5 text-slate-500 hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors">
                                    <ChevronLeft className="w-3.5 h-3.5" /> Atrás
                                </button>
                            )}
                        </div>
                        <div>
                            {step < 3 && (
                                <div className="flex items-center gap-4">
                                    <button type="button" onClick={skipStep} className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-wider">
                                        [ Omitir Fase ]
                                    </button>
                                    <button type="button" onClick={() => handleStepNavigation(true)} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider rounded-lg border border-white/5 transition-all flex items-center gap-1">
                                        Siguiente <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
