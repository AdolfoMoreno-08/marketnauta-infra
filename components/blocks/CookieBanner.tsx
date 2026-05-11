"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");

        // Si no hay decisión tomada, mostramos el banner
        if (!consent) {
            setShowBanner(true);
        } else {
            // Si ya existe consentimiento, reforzamos el update por si el default del layout falló
            updateGTMConsent(consent as "granted" | "denied");
        }
    }, []);

    const updateGTMConsent = (status: "granted" | "denied") => {
        if (typeof window !== "undefined") {
            const gtag = (window as any).gtag;
            const dataLayer = (window as any).dataLayer;

            if (gtag) {
                gtag("consent", "update", {
                    ad_storage: status,
                    ad_user_data: status,
                    ad_personalization: status,
                    analytics_storage: status,
                });
            }

            if (dataLayer) {
                dataLayer.push({
                    event: "consent_updated",
                    consent_status: status,
                });
            }
        }
    };

    const handleConsent = (status: "granted" | "denied") => {
        localStorage.setItem("cookie_consent", status);
        updateGTMConsent(status);
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[110]"
                >
                    <div className="glass-card bg-abisal-900/95 border border-white/10 p-6 rounded-2xl shadow-2xl">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-marketnauta-primary/10 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-marketnauta-primary" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-white font-display font-bold text-sm mb-2">
                                    Privacidad de Datos
                                </h4>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                    Para optimizar tu experiencia y la precisión de nuestras señales,
                                    Marketnauta utiliza cookies técnicas y de análisis.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleConsent("granted")}
                                        className="flex-grow py-2.5 bg-marketnauta-primary text-abisal-950 text-xs font-bold rounded-lg hover:brightness-110 transition-all"
                                    >
                                        Aceptar Todo
                                    </button>
                                    <button
                                        onClick={() => handleConsent("denied")}
                                        className="px-4 py-2.5 border border-white/10 text-slate-400 text-xs font-medium rounded-lg hover:bg-white/5 transition-all"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}