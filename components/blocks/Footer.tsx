"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Mail, Globe, ArrowUpRight, Cpu } from "lucide-react";

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

interface FooterProps {
    onContactClick?: () => void;
}

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

export default function Footer({ onContactClick }: FooterProps) {
    const pathname = usePathname();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string | undefined) => {
        if (!targetId || pathname !== "/") return;
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <footer className="relative border-t border-white/10 bg-abisal-950 pt-16 pb-10 px-6 overflow-hidden selection:bg-marketnauta-primary/30">
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-marketnauta-primary/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Branding: Descripción más clara */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <Compass className="w-8 h-8 text-marketnauta-primary group-hover:rotate-180 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-marketnauta-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-display text-2xl font-bold tracking-tighter text-white uppercase">
                                Market<span className="text-marketnauta-primary">nauta</span>
                            </span>
                        </Link>
                        {/* Subimos de text-sm a text-[15px] y slate-400 */}
                        <p className="text-slate-300 text-[15px] leading-relaxed max-w-xs font-light">
                            Ingeniería de crecimiento y performance de alta fidelidad. Convertimos la complejidad técnica en ventajas competitivas.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="w-10 h-10 rounded-xl border border-white/20 bg-white/[0.03] flex items-center justify-center text-slate-300 hover:text-marketnauta-primary hover:border-marketnauta-primary/30 transition-all duration-300">
                                <LinkedinIcon className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-xl border border-white/20 bg-white/[0.03] flex items-center justify-center text-slate-300 hover:text-white hover:border-white/40 transition-all duration-300">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Columnas de Links: Subimos a text-[15px] y slate-400 */}
                    <div className="space-y-6">
                        <h4 className="text-white font-mono text-[12px] uppercase tracking-[0.3em] font-bold">Soluciones</h4>
                        <ul className="space-y-4">
                            {footerLinks.soluciones.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-white text-[15px] transition-all flex items-center group font-light">
                                        {link.name}
                                        <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-mono text-[12px] uppercase tracking-[0.3em] font-bold">Protocolo</h4>
                        <ul className="space-y-4">
                            {footerLinks.empresa.map((link) => (
                                <li key={link.name}>
                                    {link.href === "trigger-contact" ? (
                                        <button onClick={onContactClick} className="text-slate-400 hover:text-white text-[15px] transition-all font-light">
                                            {link.name}
                                        </button>
                                    ) : (
                                        <Link href={link.href} onClick={(e) => handleScroll(e, link.id)} className="text-slate-400 hover:text-white text-[15px] transition-all font-light">
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Infraestructura: Ajuste de legibilidad */}
                    <div className="space-y-6">
                        <h4 className="text-white font-mono text-[12px] uppercase tracking-[0.3em] font-bold">Infraestructura</h4>
                        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </div>
                                <span className="text-[12px] text-slate-200 font-mono uppercase tracking-tighter">Status: Operational</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono border-t border-white/10 pt-3">
                                <Cpu className="w-4 h-4" />
                                <span>AWS_GLOBAL / BIGQ_NODE</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-[14px] font-mono group cursor-pointer hover:text-marketnauta-primary transition-colors">
                            <Mail className="w-4 h-4" />
                            <span>hola@marketnauta.com</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Legal - Subimos a text-[11px] y slate-500 */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-slate-500 text-[11px] font-mono uppercase tracking-[0.2em]">
                            © 2026 Marketnauta_Core.v2
                        </p>
                        <div className="flex gap-6">
                            {footerLinks.legal.map((link) => (
                                <Link key={link.name} href={link.href} className="text-slate-500 hover:text-white text-[11px] uppercase font-mono tracking-widest transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono border border-white/10 px-4 py-1.5 rounded-full bg-white/[0.03]">
                        <Globe className="w-4 h-4 text-marketnauta-primary" />
                        <span className="tracking-tighter">LIMA, PERÚ / REMOTE_HQ</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}