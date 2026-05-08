"use client";

import Link from 'next/link';
import { Compass } from 'lucide-react';

// Definimos la interfaz para las props del Navbar
interface NavbarProps {
    onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
    return (
        <nav className="glass-nav px-6 py-4 flex items-center justify-between">
            {/* Lado Izquierdo: Branding */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="text-marketnauta-primary">
                    {/* El icono rota suavemente al pasar el mouse por el nombre */}
                    <Compass className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
                </div>
                <span className="font-display text-xl font-bold tracking-wider title-gradient uppercase">
                    Marketnauta
                </span>
            </Link>

            {/* Centro: Links de Navegación (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
                {[
                    { name: 'Auditoría', href: '/soluciones/auditoria-de-datos' },
                    { name: 'Growth', href: '/soluciones/gestion-de-pauta' },
                    { name: 'Estrategia', href: '/soluciones/desarrollo-y-estrategia' },
                ].map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm font-medium text-slate-400 hover:text-marketnauta-primary transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Lado Derecho: CTA vinculado al Modal */}
            <button
                onClick={onContactClick}
                className="px-5 py-2 rounded-full bg-marketnauta-primary/10 border border-marketnauta-primary/20 text-marketnauta-primary text-sm font-semibold hover:bg-marketnauta-primary hover:text-abisal-950 transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.1)] active:scale-95"
            >
                Agendar Exploración
            </button>
        </nav>
    );
}