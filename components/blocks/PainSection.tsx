"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FileX2, TrendingDown, ShieldAlert } from "lucide-react";

interface PainCard {
  icon: React.ReactNode;
  stat: string;
  statSuffix: string;
  label: string;
  title: string;
  description: string;
  color: "orange" | "red" | "yellow";
}

const PAIN_CARDS: PainCard[] = [
  {
    icon: <FileX2 className="w-6 h-6" />,
    stat: "12",
    statSuffix: "h/sem",
    label: "01 // INEFICIENCIA",
    title: "Reportes Manuales",
    description:
      "Tu equipo pasa horas consolidando datos de Google Ads, Meta y GA4 en hojas de cálculo que se desactualizan en el momento en que las cierras.",
    color: "orange",
  },
  {
    icon: <TrendingDown className="w-6 h-6" />,
    stat: "34",
    statSuffix: "%",
    label: "02 // FUGA DE PRESUPUESTO",
    title: "Inversión Perdida",
    description:
      "Sin atribución cross-canal real, el 34% promedio del budget se asigna a canales que no convierten — o peor, se recorta de los que sí lo hacen.",
    color: "red",
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    stat: "60",
    statSuffix: "%",
    label: "03 // DATOS ROTOS",
    title: "Píxeles iOS 14+",
    description:
      "Las restricciones de privacidad de Apple eliminaron hasta el 60% de las conversiones reportadas por Meta. Sin Server-Side Tracking, estás optimizando en la oscuridad.",
    color: "yellow",
  },
];

function AnimatedStat({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-display font-black tabular-nums">
      {count}
      <span className="text-[0.55em] ml-0.5 font-mono font-normal opacity-80">{suffix}</span>
    </span>
  );
}

const colorMap = {
  orange: {
    glow: "rgba(255,107,53,0.12)",
    border: "rgba(255,107,53,0.25)",
    borderHover: "rgba(255,107,53,0.5)",
    text: "text-marketnauta-orange",
    badge: "terminal-badge-orange",
    shadow: "shadow-neon-orange",
    dot: "bg-marketnauta-orange",
  },
  red: {
    glow: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.2)",
    borderHover: "rgba(239,68,68,0.45)",
    text: "text-red-400",
    badge: "terminal-badge-orange",
    shadow: "0 0 15px rgba(239,68,68,0.3)",
    dot: "bg-red-400",
  },
  yellow: {
    glow: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.18)",
    borderHover: "rgba(234,179,8,0.4)",
    text: "text-yellow-400",
    badge: "terminal-badge",
    shadow: "0 0 15px rgba(234,179,8,0.3)",
    dot: "bg-yellow-400",
  },
};

export default function PainSection() {
  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="terminal-badge-orange mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-orange animate-pulse" />
            Diagnóstico del Sistema
          </span>

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mt-4 mb-5">
            El costo de la{" "}
            <span className="text-marketnauta-orange text-glow-orange">ceguera</span>.
          </h2>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Cada día sin infraestructura de datos es un día que tu competencia te saca ventaja
            usando la información que tú estás regalando.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PAIN_CARDS.map((card, i) => {
            const c = colorMap[card.color];
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-7 cursor-default overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(11,19,43,0.7) 0%, ${c.glow} 100%)`,
                  border: `1px solid ${c.border}`,
                  backdropFilter: "blur(12px)",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = c.borderHover;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${c.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = c.border;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Scan line overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
                      animation: "scanLine 3s linear infinite",
                    }}
                  />
                </div>

                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="font-mono text-[0.6rem] tracking-widest uppercase"
                    style={{ color: `${c.glow.replace("0.1", "0.7")}` }}
                  >
                    {card.label}
                  </span>
                  <div
                    className={`p-2 rounded-lg ${c.text}`}
                    style={{ background: c.glow }}
                  >
                    {card.icon}
                  </div>
                </div>

                {/* Stat */}
                <div className={`text-5xl md:text-6xl mb-3 ${c.text}`}>
                  <AnimatedStat
                    target={parseInt(card.stat)}
                    suffix={card.statSuffix}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-display font-bold text-white mb-3">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {card.description}
                </p>

                {/* Bottom glow line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${c.borderHover}, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom connector */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">
            ↓ Calcula exactamente cuánto estás perdiendo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
