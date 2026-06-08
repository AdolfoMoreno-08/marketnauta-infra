"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Activity, ShieldCheck } from "lucide-react";
import SolutionsGrid from "@/components/blocks/SolutionsGrid";
import Methodology from "@/components/blocks/Methodology";
import SuccessCases from "@/components/blocks/SuccessCases";
import TrackedCTA from "@/components/blocks/TrackedCTA";



export default function Home() {
  // Scroll suave compensando la altura del Navbar
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-abisal-950 overflow-x-hidden">

      {/* 1. HERO SECTION: Optimizado para Mobile-First */}
      <div className="relative min-h-[100svh] md:min-h-[95vh] flex flex-col items-center justify-center px-6 overflow-hidden pt-20 md:pt-24">

        {/* BACKGROUND: Océano de Datos (Escalado dinámico) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            // En móvil el brillo es más pequeño para no lavar el contraste
            className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-marketnauta-primary/10 rounded-full blur-[80px] md:blur-[150px]"
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
            }}
          />        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10 w-full max-w-6xl"
        >
          {/* Status Badge: Más compacto en móvil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 md:mb-10 inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-neon-short"
          >
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marketnauta-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-marketnauta-primary"></span>
            </span>
            <span className="text-[9px] md:text-[10px] text-marketnauta-primary uppercase tracking-[0.2em] md:tracking-[0.4em] font-mono font-bold">
              System: Operativo // Océano de Datos
            </span>
          </motion.div>

          {/* TITULAR: Cambio drástico de escala para móvil */}
          <h1 className="text-[2.75rem] sm:text-6xl md:text-[6.5rem] lg:text-[8rem] font-display font-bold leading-[1.1] md:leading-[0.9] tracking-tighter mb-8 md:mb-10">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              Navega el Océano
            </span>
            <br className="hidden sm:block" />
            <span className="relative inline-block text-white mt-2 md:mt-0">
              de Datos.
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute -bottom-2 md:-bottom-4 left-0 h-[2px] bg-gradient-to-r from-marketnauta-primary via-marketnauta-primary/50 to-transparent"
              />
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-xl text-slate-400 mb-10 md:mb-14 font-light leading-relaxed px-2 md:px-0">
            Transformamos el ruido digital en <span className="text-white border-b border-marketnauta-primary/20">infraestructuras de crecimiento</span>.
            No gestionamos pauta; construimos <span className="text-marketnauta-primary/90 font-mono">ventajas competitivas</span>.
          </p>

          {/* BOTONES: Stacked en móvil para facilitar el pulgar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <a
              href="#soluciones"
              onClick={(e) => scrollToSection(e, 'soluciones')}
              className="w-full sm:w-auto group relative px-8 py-4 md:px-10 md:py-5 rounded-full bg-white text-abisal-950 font-bold text-base md:text-lg transition-all duration-500 hover:shadow-neon-long overflow-hidden flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Iniciar Exploración
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                whileHover={{ x: "100%" }}
                className="absolute inset-0 bg-marketnauta-primary -translate-x-full transition-transform duration-500"
              />
            </a>

            <a
              href="#metodologia"
              onClick={(e) => scrollToSection(e, 'metodologia')}
              className="w-full sm:w-auto group px-8 py-4 md:px-10 md:py-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-medium hover:border-marketnauta-primary/50 transition-all duration-300 text-center active:scale-95"
            >
              Ver Metodología
            </a>
          </div>
        </motion.div>
      </div>

      {/* 2. SECCIONES CORE: Paddings reducidos en móvil */}
      <div className="relative z-10 bg-abisal-950">
        <section id="casos-exito" className="py-10 md:py-12">
          <SuccessCases />
        </section>

        <section id="soluciones" className="scroll-mt-20 py-1 md:py-12">
          <SolutionsGrid />
        </section>

        <section id="metodologia" className="scroll-mt-20 py-1 md:py-12">
          <Methodology />
        </section>
      </div>

      {/* 3. CTA FINAL: Optimización Mobile */}
      <section className="py-16 md:py-40 px-6 relative z-10 flex justify-center border-t border-white/5 bg-abisal-900/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl text-center relative w-full"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[500px] h-[280px] md:h-[500px] bg-marketnauta-primary/10 blur-[80px] md:blur-[120px] pointer-events-none" />

          <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 relative z-10 tracking-tight leading-tight">
            ¿Listo para dejar <br /> <span className="text-slate-500">de adivinar?</span>
          </h2>

          <p className="text-base md:text-xl text-slate-400 mb-12 max-w-xl mx-auto relative z-10 font-light">
            Nuestro equipo de ingeniería trazará tu ruta de crecimiento basada en evidencia técnica y datos reales.
          </p>

          <TrackedCTA
            href="?modal=auditoria"
            eventName="home_footer_auditoria_tactica"
            className="w-full sm:w-auto relative z-10 group inline-flex items-center justify-center gap-4 px-8 md:px-12 py-5 md:py-7 rounded-full bg-marketnauta-primary text-abisal-950 font-black text-lg md:text-xl hover:shadow-neon-long transition-all duration-300 active:scale-95 shadow-neon-short"
          >
            <Compass className="w-6 h-6 group-hover:rotate-90 transition-transform duration-700" />
            AUDITORÍA TÁCTICA
          </TrackedCTA>

          <div className="mt-12 flex items-center justify-center gap-8 opacity-30 grayscale">
            <ShieldCheck className="w-6 h-6 text-white" />
            <Activity className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      </section>

    </div>
  );
}
