"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap, Grid3X3, Database } from "lucide-react";

const CLIENTS = [
  { name: "Pulday", logo: "/logo-pulday.png", sector: "Alimentación" },
  { name: "Flor de Altura", logo: "/logo-flor-altura.png", sector: "Agricultura" },
  { name: "Los Inkas", logo: "/logo-inkas.png", sector: "Procesamiento" },
  { name: "NYC", logo: "/logo-nyc.png", sector: "Inmobiliario" },
];

export default function ClientLogosCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CLIENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const nextClient = () => {
    setActiveIndex((prev) => (prev + 1) % CLIENTS.length);
    setIsAutoPlay(false);
  };

  const prevClient = () => {
    setActiveIndex((prev) => (prev - 1 + CLIENTS.length) % CLIENTS.length);
    setIsAutoPlay(false);
  };

  return (
    <section className="py-20 md:py-28 px-6 relative bg-gradient-to-b from-abisal-950 via-abisal-900 to-abisal-950 overflow-hidden">
      {/* Grid background effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,229,255,1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Top glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,119,255,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Grid3X3 className="w-5 h-5 text-marketnauta-primary" />
            </motion.div>
            <span className="text-marketnauta-primary font-mono text-[10px] uppercase tracking-[0.4em]">
              Clientes Activos
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight tracking-tighter">
            Confianza en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-marketnauta-primary to-marketnauta-secondary">
              Acción
            </span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            Empresas que transformaron sus datos en ventajas competitivas
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative h-[420px] md:h-[500px] mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {/* Card container */}
              <div className="h-full flex flex-col md:flex-row items-stretch gap-8">
                {/* Logo side */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="flex-1 relative group"
                >
                  <div
                    className="relative h-full rounded-[2rem] border border-marketnauta-primary/20 p-8 md:p-12 flex items-center justify-center overflow-hidden bg-gradient-to-br from-abisal-900 via-abisal-950 to-abisal-900"
                    style={{
                      boxShadow: "0 0 60px rgba(0,229,255,0.1), inset 0 0 40px rgba(0,229,255,0.02)",
                    }}
                  >
                    {/* Grid overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <svg width="100%" height="100%" className="opacity-20">
                        <defs>
                          <pattern id="hover-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,229,255,1)" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hover-grid)" />
                      </svg>
                    </div>

                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      animate={{
                        background: [
                          "radial-gradient(circle at 0% 0%, rgba(0,229,255,0.05) 0%, transparent 50%)",
                          "radial-gradient(circle at 100% 100%, rgba(0,229,255,0.05) 0%, transparent 50%)",
                          "radial-gradient(circle at 0% 0%, rgba(0,229,255,0.05) 0%, transparent 50%)",
                        ],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Logo image */}
                    <motion.img
                      src={CLIENTS[activeIndex].logo}
                      alt={CLIENTS[activeIndex].name}
                      className="relative z-10 max-w-[280px] h-auto max-h-[250px] object-contain drop-shadow-2xl"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-marketnauta-primary/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-marketnauta-primary/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </motion.div>

                {/* Info side */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="flex-1 flex flex-col justify-between py-4 md:py-0"
                >
                  {/* Title + Sector */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-marketnauta-primary"
                        >
                          <Zap className="w-4 h-4" />
                        </motion.div>
                        <span className="text-marketnauta-primary font-mono text-[9px] uppercase tracking-[0.3em]">
                          Cliente Activo
                        </span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        {CLIENTS[activeIndex].name}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-marketnauta-primary to-transparent rounded-full" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-2">
                          Sector
                        </p>
                        <p className="text-xl text-slate-300 font-light">
                          {CLIENTS[activeIndex].sector}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.05]">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-4 h-4 text-marketnauta-primary" />
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                            Transformación
                          </p>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-400 font-light">
                          <li>• Centralización de datos en BigQuery</li>
                          <li>• Tracking Server-Side implementado</li>
                          <li>• Reportes en tiempo real activados</li>
                          <li>• ROI optimizado constantemente</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2 pt-6 border-t border-white/[0.05]">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow"
                    />
                    <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">
                      En Producción
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevClient}
              className="w-10 h-10 rounded-full border border-marketnauta-primary/30 bg-abisal-950/80 backdrop-blur-md flex items-center justify-center text-marketnauta-primary hover:border-marketnauta-primary/60 hover:bg-abisal-900 transition-all duration-300 font-bold"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextClient}
              className="w-10 h-10 rounded-full border border-marketnauta-primary/30 bg-abisal-950/80 backdrop-blur-md flex items-center justify-center text-marketnauta-primary hover:border-marketnauta-primary/60 hover:bg-abisal-900 transition-all duration-300 font-bold"
            >
              →
            </motion.button>
          </div>
        </div>

        {/* Indicators + Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Indicator dots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 md:gap-3"
          >
            {CLIENTS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  setIsAutoPlay(false);
                }}
                animate={{
                  width: activeIndex === i ? 28 : 8,
                  backgroundColor: activeIndex === i ? "rgb(0, 229, 255)" : "rgba(0, 229, 255, 0.2)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
              />
            ))}
          </motion.div>

          {/* Stats */}
          {[
            { label: "Clientes Activos", value: CLIENTS.length, icon: "🏢" },
            { label: "Países", value: "LATAM", icon: "🌍" },
            { label: "Uptime", value: "99.9%", icon: "📈" },
            { label: "Estado", value: "En Vivo", icon: "🔴" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border border-white/[0.06] bg-gradient-to-br from-abisal-900 to-abisal-950 hover:border-marketnauta-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{stat.icon}</span>
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
              <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
