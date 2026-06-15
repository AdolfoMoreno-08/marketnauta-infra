"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, X, Terminal, AlertCircle, Fuel, ShieldCheck, WifiOff, XCircle, CalendarClock } from "lucide-react";
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

const STORAGE_KEY = "marketnauta_lead_draft";

export default function ContactForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const modalType = searchParams.get("modal");

    const isOpen = !!modalType;
    const isMounted = useRef(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Estados Core
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<FormStatus>("idle");
    const [loadingText, setLoadingText] = useState("Iniciando secuencia...");

    // Estados de UX Avanzada
    const [localError, setLocalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [shakeKey, setShakeKey] = useState(0); // Disparador de animación de error
    const [isOffline, setIsOffline] = useState(false);

    const [formData, setFormData] = useState({
        challenge: "", volume: "", budget: "", name: "", company: "", email: "", phone: "", url: "", botField: ""
    });

    // 1. Detección de Montaje y Estado de Red
    useEffect(() => {
        isMounted.current = true;
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            isMounted.current = false;
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // 1.b Bloqueo de scroll del fondo mientras el modal está abierto
    // (evita scroll-chaining / rubber-banding del body detrás del backdrop en iOS)
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    // 2. Recuperación de Local Storage (Auto-Guardado)
    useEffect(() => {
        if (isOpen && isMounted.current) {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const { data, timestamp } = JSON.parse(saved);
                    // Expiración de 24 horas para evitar datos rancios
                    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                        setFormData(prev => ({ ...prev, ...data }));
                    } else {
                        localStorage.removeItem(STORAGE_KEY);
                    }
                } catch (e) {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }

            // Precarga por URL param
            if (modalType === "auditoria" && !formData.challenge) {
                setFormData(prev => ({ ...prev, challenge: "Trazabilidad y Visualización de Datos" }));
            } else if (modalType === "exploracion" && !formData.challenge) {
                setFormData(prev => ({ ...prev, challenge: "Escalabilidad en Pauta (Growth)" }));
            }
        }
    }, [isOpen, modalType]);

    // 3. Sincronización a Local Storage (Throttled)
    useEffect(() => {
        const hasData = !!(formData.challenge || formData.volume || formData.name || formData.email || formData.phone);
        if (hasData && status !== "success") {
            const timeout = setTimeout(() => {
                const { botField, ...safeData } = formData; // No guardamos spam-trap
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: safeData, timestamp: Date.now() }));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [formData, status]);

    // Lógica de Cierre
    const closeForm = useCallback(() => {
        setShowConfirm(false);
        router.replace(pathname, { scroll: false });
        setTimeout(() => {
            if (isMounted.current) {
                setStep(1);
                setStatus("idle");
                setFieldErrors({});
                setLocalError(null);
                setFormData({ challenge: "", volume: "", budget: "", name: "", company: "", email: "", phone: "", url: "", botField: "" });
            }
        }, 500);
    }, [pathname, router]);

    const handleCloseIntent = useCallback(() => {
        const hasInteracted = !!(formData.challenge || formData.volume || formData.budget || formData.name || formData.email || formData.phone);
        if (hasInteracted && (status === "idle" || status === "error")) {
            setShowConfirm(true);
        } else {
            closeForm();
        }
    }, [formData, status, closeForm]);

    // 4. Protección contra abandono (BeforeUnload & PopState)
    useEffect(() => {
        if (!isOpen) return;

        // Protección 1: Refresh o Cierre de pestaña
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasInteracted = !!(formData.challenge || formData.name || formData.phone || formData.email);
            if (hasInteracted && status !== "success") {
                e.preventDefault();
                e.returnValue = "Se perderán tus coordenadas de enlace. ¿Deseas salir?";
            }
        };

        // Protección 2: Tecla Escape
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleCloseIntent();
        };

        // Protección 3: Botón 'Atrás' del móvil (PopState Trap)
        window.history.pushState({ modal: true }, "");
        const handlePopState = (e: PopStateEvent) => {
            const hasInteracted = !!(formData.challenge || formData.name || formData.phone || formData.email);
            if (hasInteracted && status !== "success") {
                window.history.pushState({ modal: true }, ""); // Volver a atrapar
                setShowConfirm(true);
            } else {
                closeForm();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isOpen, formData, status, handleCloseIntent, closeForm]);

    // Focus Automático en Fase 3
    useEffect(() => {
        if (step === 3 && status === "idle") {
            const timer = setTimeout(() => nameInputRef.current?.focus(), 300);
            return () => clearTimeout(timer);
        }
        setLocalError(null);
    }, [step, status]);

    const getGoogleClientId = (): string | null => {
        try {
            const match = document.cookie.split(';').find(c => c.trim().startsWith('_ga='));
            if (match) {
                const parts = match.trim().split('=')[1].split('.');
                if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
            }
        } catch { }
        return null;
    };

    const triggerErrorShake = (msg: string) => {
        setLocalError(msg);
        setShakeKey(prev => prev + 1);
        if (typeof window !== "undefined") window.navigator.vibrate?.(200); // Haptic feedback en móvil
    };

    // 5. Validaciones Inline (OnBlur)
    const validateField = (field: keyof typeof formData, value: string) => {
        let error = "";
        if (field === "email" && value.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) error = "Email corporativo inválido.";
        }
        if (field === "phone" && value.trim() !== "") {
            const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\s/0-9]*$/;
            if (value.length < 6 || !phoneRegex.test(value)) error = "Formato de WhatsApp inválido.";
        }
        setFieldErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleStepNavigation = (next: boolean) => {
        if (!next) {
            if (status === "idle") setStep(prev => Math.max(1, prev - 1));
            return;
        }

        if (step === 1 && !formData.challenge) return triggerErrorShake("Selecciona una opción táctica para continuar.");
        if (step === 2 && !formData.budget) return triggerErrorShake("Define la asignación mensual para calcular escala.");

        setStep(prev => Math.min(3, prev + 1));
    };

    const skipStep = () => {
        if (step === 1) { setFormData(prev => ({ ...prev, challenge: "No especificado" })); setStep(2); }
        else if (step === 2) { setFormData(prev => ({ ...prev, volume: prev.volume || "No especificado", budget: "No especificado" })); setStep(3); }
    };

    // 6. Submit con Analítica Consistente
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "sending" || isOffline) return;

        const cleanName = formData.name.trim();
        const cleanPhone = formData.phone.trim();
        const cleanEmail = formData.email.trim();

        if (!cleanName || !cleanPhone) return triggerErrorShake("Nombre y WhatsApp son coordenadas obligatorias.");
        if (fieldErrors.email || fieldErrors.phone) return triggerErrorShake("Corrige los errores en los campos antes de enlazar.");

        setStatus("sending");

        // Generación de ID justo en el momento exacto
        const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const phases = ["Estableciendo conexión segura...", "Encriptando metadatos...", "Transmitiendo señal a Marketnauta..."];

        const payload = {
            ...formData,
            volume: formData.volume || "No especificado",
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            eventId,
            googleClientId: getGoogleClientId(),
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"
        };

        try {
            const apiCall = fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            // CRM (HubSpot) — fire-and-forget en paralelo. No bloquea el éxito
            // del formulario; si el CRM falla, el lead igual llega por email.
            fetch('/api/crm/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    company: formData.company,
                    url: formData.url,
                    challenge: formData.challenge,
                    budget: formData.budget,
                    volume: payload.volume,
                    source: 'contact_modal',
                    botField: formData.botField,
                }),
            }).catch(() => { /* silencioso: el CRM es complementario */ });

            for (const phase of phases) {
                if (!isMounted.current) return;
                setLoadingText(phase);
                await new Promise(res => setTimeout(res, 600));
            }

            const response = await apiCall;
            if (!isMounted.current) return;

            if (response.ok) {
                setStatus("success");
                localStorage.removeItem(STORAGE_KEY); // Limpiar draft

                fbq.event('Lead', { content_name: payload.challenge, value: 0.00, currency: 'USD', eventID: eventId });
                if (typeof window !== "undefined") {
                    const w = window as any;
                    w.dataLayer = w.dataLayer || [];
                    w.dataLayer.push({
                        event: 'form_send', event_id: eventId, form_type: 'contact_modal',
                        lead_challenge: payload.challenge, lead_budget: payload.budget, status: 'success'
                    });
                }
                gtm.pushToDataLayer({
                    event: 'lead_conversion', event_id: eventId, lead_type: payload.challenge,
                    lead_budget_range: payload.budget, lead_company_size: payload.volume, lead_location: 'Web_Terminal_v1'
                });
            } else {
                throw new Error("API Error");
            }
        } catch {
            if (isMounted.current) {
                setStatus("error");
                triggerErrorShake("Falla de Enlace. Revisa tu conexión o intenta de nuevo.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleCloseIntent} className="absolute inset-0 bg-abisal-950/80 backdrop-blur-xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl border border-white/10 bg-abisal-900/95 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.1)] flex flex-col max-h-[90vh] min-h-[min(560px,90vh)]"
            >
                {/* Modal de Advertencia de Cierre */}
                <AnimatePresence>
                    {showConfirm && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] bg-abisal-900/98 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                            <AlertCircle className="w-14 h-14 text-yellow-500 mb-5 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white mb-2">¿Abortar conexión?</h3>
                            <p className="text-slate-400 mb-8 max-w-sm">Los parámetros que ya calibramos se perderán si cierras la terminal ahora.</p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                                <button onClick={() => setShowConfirm(false)} className="w-full px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/15 border border-white/10 font-medium transition-all">Seguir Calibrando</button>
                                <button onClick={closeForm} className="w-full px-6 py-3 rounded-full text-red-400 hover:bg-red-500/10 transition-all font-mono text-xs uppercase tracking-widest">Abortar</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Banner Modo Offline */}
                <AnimatePresence>
                    {isOffline && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-400 flex items-center justify-center py-2 px-4 gap-2 text-xs font-mono">
                            <WifiOff className="w-3.5 h-3.5" /> Señal de red perdida. Acciones suspendidas temporalmente.
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header & Progreso */}
                <div className="flex-shrink-0">
                    <div className="grid grid-cols-3 h-1.5 w-full bg-white/5" role="progressbar" aria-valuenow={(step / 3) * 100} aria-valuemin={0} aria-valuemax={100}>
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="relative w-full h-full bg-white/5 overflow-hidden">
                                <motion.div className="h-full bg-marketnauta-primary" initial={{ x: "-100%" }} animate={{ x: step >= s ? "0%" : "-100%" }} transition={{ duration: 0.4, ease: "circOut" }} />
                            </div>
                        ))}
                    </div>
                    <div className="p-6 sm:p-8 pb-0 flex justify-between items-start">
                        <div className="space-y-1.5">
                            <span className="flex items-center gap-2 text-marketnauta-primary font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
                                <Terminal className="w-3.5 h-3.5" /> {STEP_METADATA[step].title}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{STEP_METADATA[step].description}</h3>
                        </div>
                        <button onClick={handleCloseIntent} className="text-slate-500 hover:text-white transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/5 ml-2" aria-label="Cerrar terminal"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Body (Scrollable para Móvil) */}
                <div className="px-6 sm:px-8 flex-grow flex flex-col justify-center py-6 overflow-y-auto scrollbar-hide">
                    {/* Error global con animación de shake */}
                    <AnimatePresence>
                        {localError && (
                            <motion.div key={shakeKey} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0, x: [0, -5, 5, -5, 5, 0] }} transition={{ duration: 0.4 }} className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] sm:text-xs font-mono text-red-400 flex items-center gap-2.5" role="alert">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {localError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {(status === "idle" || status === "sending") && (
                            <motion.form key={`form-step-${step}`} onSubmit={handleSubmit} className="w-full flex-grow flex flex-col justify-center" noValidate>
                                <div className="hidden" aria-hidden="true">
                                    <input type="text" name="hp_field" tabIndex={-1} value={formData.botField} onChange={e => setFormData({ ...formData, botField: e.target.value })} />
                                </div>

                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -20, filter: "blur(4px)" }} className="space-y-3">
                                        {["Trazabilidad y Visualización de Datos", "Escalabilidad en Pauta (Growth)", "Infraestructura Web y Performance"].map((t) => (
                                            <button key={t} type="button" onClick={() => { setFormData({ ...formData, challenge: t }); setLocalError(null); setStep(2); }} className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex justify-between items-center group transition-all duration-300 ${formData.challenge === t ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/5'}`}>
                                                <span className="text-sm font-medium">{t}</span>
                                                <ChevronRight className={`w-4 h-4 transition-all duration-300 ${formData.challenge === t ? 'text-marketnauta-primary opacity-100 translate-x-1' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`} />
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -20, filter: "blur(4px)" }} className="space-y-8">
                                        <div className="space-y-4">
                                            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wider block">Escala de Operación (Opcional)</span>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                                {["Startup", "Pyme / Mediana", "Corporativa"].map((v) => (
                                                    <button key={v} type="button" onClick={() => { setFormData(prev => ({ ...prev, volume: v })); setLocalError(null); }} className={`py-3 px-4 rounded-xl border text-xs font-medium transition-all ${formData.volume === v ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10'}`}>
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" /> Asignación Mensual a Pauta</span>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                {["Menos de S/ 2,500", "S/ 2,500 - S/ 6,000", "Más de S/ 6,000", "No invierto actualmente"].map((b) => (
                                                    <button key={b} type="button" onClick={() => { setFormData(prev => ({ ...prev, budget: b })); setLocalError(null); }} className={`py-3.5 px-5 rounded-xl border text-left text-xs font-medium transition-all ${formData.budget === b ? 'border-marketnauta-primary bg-marketnauta-primary/10 text-white' : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-marketnauta-primary/10 hover:border-marketnauta-primary/30'}`}>
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                                            {[
                                                { id: "name", label: "Responsable *", type: "text", k: "name", col: "sm:col-span-1", max: 60 },
                                                { id: "company", label: "Compañía (Opcional)", type: "text", k: "company", col: "sm:col-span-1", max: 80 },
                                                { id: "email", label: "Email (Opcional)", type: "email", k: "email", col: "sm:col-span-2", max: 100 },
                                                { id: "phone", label: "WhatsApp de Enlace *", type: "tel", k: "phone", col: "sm:col-span-1", max: 20 },
                                                { id: "url", label: "URL del Sitio (Opcional)", type: "text", k: "url", col: "sm:col-span-1", max: 150 }
                                            ].map((field) => (
                                                <div key={field.id} className={`relative ${field.col}`}>
                                                    <input
                                                        ref={field.id === "name" ? nameInputRef : null}
                                                        type={field.type} id={field.id} placeholder=" "
                                                        maxLength={field.max}
                                                        disabled={status === "sending"}
                                                        value={formData[field.k as keyof typeof formData]}
                                                        onChange={e => setFormData({ ...formData, [field.k]: e.target.value })}
                                                        onBlur={() => validateField(field.k as keyof typeof formData, formData[field.k as keyof typeof formData])}
                                                        className={`peer block w-full bg-transparent border-b py-2 text-[15px] text-white outline-none transition-colors ${fieldErrors[field.k] ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-marketnauta-primary'}`}
                                                        aria-invalid={!!fieldErrors[field.k]}
                                                    />
                                                    <label htmlFor={field.id} className="absolute left-0 top-2 text-slate-500 text-sm transition-all pointer-events-none peer-focus:-top-5 peer-focus:text-[10px] peer-focus:text-marketnauta-primary peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-[10px]">
                                                        {field.label}
                                                    </label>
                                                    {/* FeedBack Visual Inline */}
                                                    {formData[field.k as keyof typeof formData] && !fieldErrors[field.k] && (field.k === "email" || field.k === "phone") && (
                                                        <CheckCircle2 className="absolute right-0 top-2.5 w-4 h-4 text-green-500 animate-in fade-in zoom-in" />
                                                    )}
                                                    {fieldErrors[field.k] && (
                                                        <span className="absolute right-0 top-2.5 flex items-center gap-2">
                                                            <span className="text-[9px] text-red-400 font-mono hidden sm:inline">{fieldErrors[field.k]}</span>
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-6">
                                            <SubmitButton status={status} loadingText={loadingText} disabled={isOffline || Object.values(fieldErrors).some(err => err !== "")} />
                                            <span className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-[0.1em] mt-4 opacity-80">
                                                <ShieldCheck className="w-3.5 h-3.5 text-marketnauta-primary" /> Transmisión bajo protocolo cifrado SSL
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.form>
                        )}

                        {status === "success" && (
                            <motion.div key="success-ui" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
                                <div className="w-20 h-20 rounded-full bg-marketnauta-primary/10 border border-marketnauta-primary/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,229,255,0.2)]">
                                    <CheckCircle2 className="w-10 h-10 text-marketnauta-primary" />
                                </div>
                                <h3 className="text-3xl font-bold text-white tracking-tight mb-3">Enlace Exitoso</h3>
                                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">Nuestra terminal ha decodificado tus coordenadas corporativas. Un especialista iniciará el protocolo de sincronización pronto.</p>

                                {/* Agendamiento de llamada (Google Appointment Scheduling).
                                    Solo se muestra si NEXT_PUBLIC_BOOKING_URL está configurada. */}
                                {process.env.NEXT_PUBLIC_BOOKING_URL && (
                                    <>
                                        <a
                                            href={process.env.NEXT_PUBLIC_BOOKING_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                try {
                                                    gtm.pushToDataLayer({ event: "schedule_call_click", source: "contact_modal_success" });
                                                } catch { }
                                            }}
                                            className="mt-8 inline-flex items-center gap-2.5 px-7 py-4 min-h-[48px] rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-sm hover:shadow-neon-long transition-all duration-300 active:scale-95"
                                        >
                                            <CalendarClock className="w-5 h-5" />
                                            Agendar llamada con Enrique
                                        </a>
                                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.15em] mt-3">
                                            Reunión vía Google Meet · confirmación por email a ambos
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div key="error-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 flex flex-col items-center">
                                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-3">Falla de Transmisión</h3>
                                <p className="text-sm text-slate-400 mb-8 max-w-xs">El servidor rechazó el enlace. La conexión podría ser inestable.</p>
                                <button onClick={() => setStatus("idle")} className="px-6 py-2.5 border border-white/10 rounded-full text-white font-mono text-xs uppercase tracking-widest hover:bg-white/5 hover:border-white/20 transition-all">
                                    Reintentar Conexión
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer (Fijo al final) */}
                {status === "idle" && (
                    <div className="p-4 sm:p-6 bg-abisal-950/40 border-t border-white/5 flex items-center justify-between shrink-0">
                        <div>
                            {step > 1 && (
                                <button type="button" onClick={() => handleStepNavigation(false)} className="flex items-center gap-1.5 text-slate-500 hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors px-3 py-2.5 min-h-[44px]">
                                    <ChevronLeft className="w-3.5 h-3.5" /> Atrás
                                </button>
                            )}
                        </div>
                        <div>
                            {step < 3 && (
                                <div className="flex items-center gap-3 sm:gap-5">
                                    <button type="button" onClick={skipStep} className="text-[9px] sm:text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest hidden sm:block">
                                        [ Omitir Fase ]
                                    </button>
                                    <button type="button" onClick={() => handleStepNavigation(true)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest rounded-xl border border-white/5 transition-all flex items-center gap-1.5 shadow-sm">
                                        Siguiente <ChevronRight className="w-3.5 h-3.5 text-marketnauta-primary" />
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
