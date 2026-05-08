"use client";

import { useState } from "react"; // 1. Importamos useState
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import SolutionsGrid from "@/components/blocks/SolutionsGrid";
import Methodology from "@/components/blocks/Methodology";
import SuccessCases from "@/components/blocks/SuccessCases";
import ContactModal from "@/components/blocks/ContactForm"; // 2. Importamos el Modal

// 3. Quitamos las props, el Home se maneja solo
export default function Home() {
  // 4. Creamos el estado para controlar el modal
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Función para manejar el scroll suave y profesional
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#030712] overflow-x-hidden">

      {/* 5. Agregamos el Formulario Modal aquí arriba */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 1. HERO SECTION: EL CENTRO DE MANDO */}
      <div className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 overflow-hidden z-10">

        {/* BACKGROUND: Océano de Datos Profundo (Multicapa) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-marketnauta-primary/5 rounded-full blur-[150px]" />
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center relative z-10 w-full max-w-5xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-marketnauta-primary animate-pulse" />
            <span className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-mono">Status: Navegando Océanos de Datos</span>
          </div>

          <h1 className="text-6xl md:text-[7rem] lg:text-[8.5rem] font-display font-bold leading-[0.95] tracking-tighter title-gradient mb-8">
            Navega el Océano <br />
            <span className="text-white relative">
              de Datos.
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-marketnauta-primary/50 to-transparent opacity-50" />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-400 mb-12 font-light leading-relaxed">
            Transformamos el ruido digital en infraestructuras de crecimiento. No gestionamos campañas; <span className="text-white font-medium">construimos ventajas competitivas.</span>
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href="#soluciones"
              onClick={(e) => scrollToSection(e, 'soluciones')}
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-abisal-950 font-bold text-lg hover:bg-marketnauta-primary transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              Iniciar Exploración
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#metodologia"
              onClick={(e) => scrollToSection(e, 'metodologia')}
              className="inline-block px-10 py-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-all cursor-pointer"
            >
              Ver Metodología
            </a>
          </div>
        </motion.div>
      </div>

      {/* 2. SECCIONES CORE (Modulares) */}
      <div className="relative z-10 bg-[#030712]">
        <section id="casos-exito">
          <SuccessCases />
        </section>

        <section id="soluciones" className="scroll-mt-24">
          <SolutionsGrid />
        </section>

        <section id="metodologia" className="scroll-mt-24">
          <Methodology />
        </section>
      </div>

      {/* 3. CTA FINAL: EL FARO DE CONVERSIÓN */}
      <section className="py-32 px-6 relative z-10 flex justify-center border-t border-white/5 bg-abisal-900/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl text-center relative w-full"
        >
          {/* El resplandor magnético de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-marketnauta-primary/15 blur-[120px] pointer-events-none" />

          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 relative z-10 tracking-tight">
            ¿Listo para dejar <br /> de adivinar?
          </h2>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto relative z-10">
            Despliega tu infraestructura de datos hoy. Nuestro equipo analizará tu caso y trazará tu ruta de crecimiento.
          </p>

          {/* 6. Conectamos el botón al estado que abre el modal */}
          <button
            onClick={() => setIsContactOpen(true)}
            className="relative z-10 group inline-flex items-center gap-3 px-12 py-6 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-xl hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(0,229,255,0.3)]"
          >
            <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
            SOLICITAR AUDITORÍA TÁCTICA
          </button>
        </motion.div>
      </section>

    </div>
  );
}