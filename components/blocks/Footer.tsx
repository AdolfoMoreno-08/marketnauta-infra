"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Necesario para saber dónde estamos
import { Compass, Mail, X, Globe, ArrowUpRight } from "lucide-react";
const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
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
    const router = useRouter();

    // Función de Scroll Suave Premium
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string | undefined, href: string) => {
        if (!targetId) return; // Si no es un link interno con ID, dejamos que el Link funcione normal

        if (pathname === "/") {
            // Si ya estamos en el Home, interceptamos y hacemos scroll suave
            e.preventDefault();
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
            // Si estamos en otra página, el <Link> de Next.js hará su trabajo de llevarnos al Home con el hash
            // (Opcional: podrías forzar el router.push(href) aquí si quisieras)
        }
    };

    return (
        <footer className="relative border-t border-white/5 bg-abisal-950 pt-20 pb-10 px-6 overflow-hidden">
            {/* Luz ambiental sutil */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-marketnauta-primary/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Columna 1: Branding */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Compass className="w-8 h-8 text-marketnauta-primary group-hover:rotate-45 transition-transform duration-500" />
                            <span className="font-display text-2xl font-bold tracking-wider uppercase title-gradient">
                                Marketnauta
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Navegando el océano de datos para encontrar el crecimiento de tu empresa mediante ingeniería y performance.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://linkedin.com/company/marketnauta" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-500 hover:text-marketnauta-primary hover:border-marketnauta-primary/20 transition-all">
                                <LinkedinIcon className="w-4 h-4" />
                            </Link>
                            <Link href="https://twitter.com/marketnauta" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-500 hover:text-marketnauta-primary hover:border-marketnauta-primary/20 transition-all">
                                <X className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Columna Soluciones */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Soluciones</h4>
                        <ul className="space-y-4">
                            {footerLinks.soluciones.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-500 hover:text-white text-sm transition-colors flex items-center group">
                                        {link.name}
                                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna Empresa */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Empresa</h4>
                        <ul className="space-y-4">
                            {footerLinks.empresa.map((link) => (
                                <li key={link.name}>
                                    {link.href === "trigger-contact" ? (
                                        <button
                                            onClick={onContactClick}
                                            className="text-slate-500 hover:text-white text-sm transition-colors text-left cursor-pointer"
                                        >
                                            {link.name}
                                        </button>
                                    ) : (
                                        // Aquí aplicamos la lógica de scroll suave a los enlaces internos
                                        <Link
                                            href={link.href}
                                            onClick={(e) => handleScroll(e, link.id, link.href)}
                                            className="text-slate-500 hover:text-white text-sm transition-colors cursor-pointer"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna Status */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest font-mono text-[10px]">Infrastructure</h4>
                        <div className="glass-card p-4 rounded-2xl border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] text-slate-300 font-mono uppercase tracking-tighter">Systems: Operational</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono leading-tight">
                                AWS / BigQuery / Vercel Node
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Mail className="w-4 h-4 text-marketnauta-primary" />
                            <span className="font-mono">hola@marketnauta.com</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
                        © 2026 MARKETNAUTA_CORE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.name} href={link.href} className="text-slate-600 hover:text-white text-[10px] uppercase font-mono transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-mono">
                        <Globe className="w-3 h-3" />
                        <span>OPS: LIMA, PE / GLOBAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}