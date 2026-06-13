"use client";

import { useRef } from 'react'; // 👈 Añadimos useRef
import { motion, useInView } from 'framer-motion'; // 👈 Añadimos useInView
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';

const data = [
    { time: '08:00', value: 4200 },
    { time: '09:00', value: 3800 },
    { time: '10:00', value: 8900 },
    { time: '11:00', value: 7200 },
    { time: '12:00', value: 9100 },
    { time: '13:00', value: 8500 },
    { time: '14:00', value: 11200 },
    { time: '15:00', value: 10500 },
    { time: '16:00', value: 12800 },
];

export default function AuditoriaDashboard() {
    // 👈 1. Creamos la referencia y el detector de visibilidad
    const chartRef = useRef(null);
    const isChartInView = useInView(chartRef, { once: true, margin: "-100px" });

    return (
        <div className="w-full h-full flex flex-col p-6 space-y-6 bg-abisal-950 border border-white/5 shadow-2xl">
            {/* Header: Terminal Style */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-marketnauta-primary rounded-full animate-pulse" />
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono">System.Telemetría_v4.0</p>
                    </div>
                    <div className="text-3xl font-display font-bold text-white tracking-tighter">
                        $43,290.<span className="text-slate-500 text-xl">00</span>
                    </div>
                </div>
                <div className="text-right font-mono">
                    <p className="text-[9px] text-slate-500 uppercase mb-1">Efficiency_Rate</p>
                    <div className="inline-block px-2 py-1 rounded bg-marketnauta-primary/5 border border-marketnauta-primary/20">
                        <span className="text-marketnauta-primary font-bold text-xs">+12.5%</span>
                    </div>
                </div>
            </div>

            {/* Gráfico Estilo High-Precision */}
            {/* 👈 2. Asignamos el ref al contenedor del gráfico */}
            <div className="flex-grow min-h-[220px] w-full" ref={chartRef}>
                <ResponsiveContainer width="100%" height="100%">
                    {/* 👈 3. Condicionamos la inyección de datos: si se ve, pasamos data, si no, pasamos array vacío */}
                    <AreaChart data={isChartInView ? data : []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" vertical={true} />
                        <XAxis dataKey="time" hide={false} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }} />
                        <YAxis hide={false} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 9, fontFamily: 'monospace' }} />
                        <Tooltip
                            cursor={{ stroke: 'rgba(0, 229, 255, 0.4)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}
                            itemStyle={{ color: '#00E5FF' }}
                        />
                        <Area
                            type="linear"
                            dataKey="value"
                            stroke="#00E5FF"
                            strokeWidth={1.5}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={2500}
                            isAnimationActive={true}
                            dot={{ r: 2, fill: '#00E5FF', strokeWidth: 0, opacity: 0.5 }}
                            activeDot={{ r: 4, stroke: '#00E5FF', strokeWidth: 2, fill: '#030712' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer de Consola (se mantiene igual) */}
            <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-5">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">B-Query.Pipeline</p>
                        <span className="text-[9px] text-marketnauta-primary font-mono">85%</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-marketnauta-primary" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Sync.Latency</p>
                        <span className="text-[9px] text-slate-400 font-mono">0.12ms</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "98%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-white/20" />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono text-slate-700 uppercase tracking-tighter">
                <span>Ref_ID: MN-882-AUDIT</span>
                <span className="text-marketnauta-primary opacity-50">Secure_Data_Link: Established</span>
            </div>
        </div>
    );
}