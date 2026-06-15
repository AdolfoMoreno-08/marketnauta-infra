"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Mail, Globe, ArrowUpRight, Cpu, Activity, Shield } from "lucide-react";
import TrackedCTA from "@/components/blocks/TrackedCTA";

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const footerLinks = {
    soluciones: [
        { name: "Auditoría de Datos", href: "/soluciones/auditoria-de-datos" },
        { name: "Gestión de Pauta", href: "/soluciones/gestion-de-pauta" },
        { name: "Desarrollo & Estrategia", href: "/soluciones/desarrollo-y-estrategia" },
    ],
    empresa: [
        { name: "Metodología", href: "/#metodologia", id: "metodologia" },
        { name: "Casos de Éxito", href: "/#casos-exito", id: "casos-exito" },
        { name: "Contacto", href: "trigger-contact" },
    ],
    legal: [
        { name: "Privacidad", href: "/legal/privacidad" },
        { name: "Términos", href: "/legal/terminos" },
    ],
};

export default function Footer() {
    const pathname = usePathname();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string | undefined) => {
        if (!targetId || pathname !== "/") return;
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const offsetPosition = elementRect - bodyRect - offset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <footer className="relative border-t border-white/[0.06] bg-abisal-950 pt-16 pb-10 px-6 overflow-hidden selection:bg-marketnauta-primary/30">
            {/* Top border gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.3) 30%, rgba(0,119,255,0.5) 50%, rgba(0,229,255,0.3) 70%, transparent 100%)",
                }}
            />

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 65%)" }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Branding */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <Compass
                                    className="w-8 h-8 text-marketnauta-primary group-hover:rotate-180 transition-transform duration-1000"
                                    style={{ filter: "drop-shadow(0 0 6px rgba(0,229,255,0.5))" }}
                                />
                                <div className="absolute inset-0 bg-marketnauta-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-display text-2xl font-bold tracking-tighter text-white uppercase">
                                Market<span className="text-marketnauta-primary" style={{ textShadow: "0 0 10px rgba(0,229,255,0.4)" }}>nauta</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-[14px] leading-relaxed max-w-xs font-light">
                            Ingeniería de datos y performance de alta fidelidad. Convertimos complejidad técnica en ventajas competitivas.
                        </p>
                        <div className="flex gap-3">
                            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Marketnauta" className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-400 hover:text-marketnauta-primary hover:border-marketnauta-primary/30 hover:shadow-neon-short transition-all duration-300">
                                <LinkedinIcon className="w-4 h-4" />
                            </Link>
                            <Link href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X de Marketnauta" className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all duration-300">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-white font-mono text-[11px] uppercase tracking-[0.3em] font-bold">Soluciones</p>
                        <ul className="space-y-4">
                            {footerLinks.soluciones.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white text-[14px] transition-all flex items-center group font-light">
                                        {link.name}
                                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <p className="text-white font-mono text-[11px] uppercase tracking-[0.3em] font-bold">Protocolo</p>
                        <ul className="space-y-4">
                            {footerLinks.empresa.map((link) => (
                                <li key={link.name}>
                                    {link.href === "trigger-contact" ? (
                                        <TrackedCTA
                                            href="?modal=exploracion"
                                            eventName="footer_contacto"
                                            className="text-slate-400 hover:text-white text-[14px] transition-all font-light"
                                        >
                                            {link.name}
                                        </TrackedCTA>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={(e) => handleScroll(e, link.id)}
                                            className="text-slate-400 hover:text-white text-[14px] transition-all font-light"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Status panel */}
                    <div className="space-y-5">
                        <p className="text-white font-mono text-[11px] uppercase tracking-[0.3em] font-bold">Infraestructura</p>

                        {/* Enhanced status box */}
                        <div
                            className="p-4 rounded-2xl space-y-3 border"
                            style={{
                                background: "rgba(0,229,255,0.03)",
                                borderColor: "rgba(0,229,255,0.12)",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-60" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                </div>
                                <span className="text-[12px] text-green-400 font-mono uppercase tracking-wide font-bold">
                                    Status: Operational
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono border-t border-white/[0.06] pt-3">
                                <Cpu className="w-3 h-3 text-marketnauta-primary" />
                                <span>AWS_GLOBAL / BIGQ_NODE</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
                                <Activity className="w-3 h-3 text-marketnauta-primary" />
                                <span>GTM_SS / TRACKING_LIVE</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
                                <Shield className="w-3 h-3 text-marketnauta-primary" />
                                <span>CAPI / META_VERIFIED</span>
                            </div>
                        </div>

                        <a
                            href="mailto:enrique@marketnauta.com"
                            className="flex items-center gap-2 text-slate-400 text-[13px] font-mono group hover:text-marketnauta-primary transition-colors"
                        >
                            <Mail className="w-4 h-4 group-hover:shadow-neon-short transition-all" />
                            <span>enrique@marketnauta.com</span>
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                            © 2026 Marketnauta_Core.v2 — Lima, Perú
                        </p>
                        <div className="flex gap-6">
                            {footerLinks.legal.map((link) => (
                                <Link key={link.name} href={link.href} className="text-slate-600 hover:text-white text-[10px] uppercase font-mono tracking-widest transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[10px] font-mono border border-white/[0.08] px-4 py-1.5 rounded-full bg-white/[0.02]">
                        <Globe className="w-3.5 h-3.5 text-marketnauta-primary" />
                        <span className="tracking-tighter">REMOTE_HQ / GMT-5</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
