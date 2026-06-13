"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrackedCTA from "@/components/blocks/TrackedCTA"; // <-- Importamos el nuevo componente

// Eliminamos la interfaz NavbarProps ya que no necesitamos onContactClick

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Auditoría', href: '/soluciones/auditoria-de-datos' },
        { name: 'Growth', href: '/soluciones/gestion-de-pauta' },
        { name: 'Estrategia', href: '/soluciones/desarrollo-y-estrategia' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled
                ? 'py-4 bg-abisal-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
                : 'py-6 md:py-10 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* BRANDING */}
                <Link href="/" aria-label="Volver al inicio - Marketnauta" className="flex items-center gap-3 group relative z-[110]">
                    <div className="relative">
                        <Compass className="w-8 h-8 text-marketnauta-primary group-hover:rotate-180 transition-transform duration-1000 ease-[0.22,1,0.36,1]" />
                        <div className="absolute inset-0 bg-marketnauta-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-display text-xl md:text-2xl font-bold tracking-[-0.02em] text-white">
                        Market<span className="text-marketnauta-primary">nauta</span>
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[13px] font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-marketnauta-primary transition-all duration-500 ease-out group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* ACCIONES */}
                <div className="flex items-center gap-5 relative z-[110]">
                    {/* --- NUEVO: TrackedCTA en Desktop --- */}
                    <TrackedCTA
                        href="?modal=exploracion"
                        eventName="nav_agendar_exploracion"
                        className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-abisal-950 text-[11px] font-bold uppercase tracking-wider hover:bg-marketnauta-primary transition-all duration-300 active:scale-95 shadow-lg"
                    >
                        Agendar Exploración
                        <ArrowRight className="w-3 h-3" />
                    </TrackedCTA>

                    <button
                        className="md:hidden text-white p-2 bg-white/5 rounded-full border border-white/10 active:scale-90 transition-all"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 w-full h-screen bg-abisal-950 flex flex-col justify-center px-10 md:hidden"
                    >
                        <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), 
                                                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        />

                        <div className="flex flex-col gap-12 relative z-10">
                            <p className="text-[10px] font-mono text-marketnauta-primary tracking-[0.5em] uppercase opacity-50">
                                Menu_Principal
                            </p>

                            <div className="flex flex-col gap-8">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-5xl font-display font-bold text-white hover:text-marketnauta-primary transition-colors flex items-center justify-between"
                                        >
                                            {link.name}
                                            <span className="text-marketnauta-primary/20 text-2xl font-mono">0{i + 1}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* --- NUEVO: TrackedCTA en Mobile --- */}
                            <TrackedCTA
                                href="?modal=exploracion"
                                eventName="mobile_menu_contacto"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-10 flex justify-center items-center w-full py-6 rounded-2xl bg-marketnauta-primary text-abisal-950 font-black uppercase text-xs tracking-[0.2em] shadow-2xl"
                            >
                                Contactar Ahora
                            </TrackedCTA>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
