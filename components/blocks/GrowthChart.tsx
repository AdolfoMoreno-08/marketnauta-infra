"use client";

import { useState, useEffect } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { month: 'Ene', investment: 1200, revenue: 3200, roas: 2.6 },
    { month: 'Feb', investment: 1500, revenue: 4800, roas: 3.2 },
    { month: 'Mar', investment: 1800, revenue: 7200, roas: 4.0 },
    { month: 'Abr', investment: 2400, revenue: 10800, roas: 4.5 },
    { month: 'May', investment: 3200, revenue: 16000, roas: 5.0 },
    { month: 'Jun', investment: 4000, revenue: 22000, roas: 5.5 },
];

export default function GrowthChart() {
    const [mounted, setMounted] = useState(false);

    // Solución para errores de hidratación en Next.js
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-[300px]" />;

    return (
        <div className="w-full h-full min-h-[350px] flex flex-col p-6 bg-abisal-900/50 font-sans">
            {/* Header Técnico */}
            <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-marketnauta-primary animate-pulse" />
                        <span className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold font-mono">Scaling Terminal v2.4</span>
                    </div>
                    <h4 className="text-xl font-display font-bold text-white tracking-tight">Performance Analytics</h4>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-mono">Avg. Efficiency</p>
                    <p className="text-lg font-mono font-bold text-marketnauta-primary">4.8x ROAS</p>
                </div>
            </div>

            {/* Contenedor con altura definida para Recharts */}
            <div className="flex-grow w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <defs>
                            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                            dy={10}
                        />
                        <YAxis hide={true} />
                        <Tooltip
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                            contentStyle={{
                                backgroundColor: '#030712',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '11px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#00E5FF' }}
                        />
                        <Bar
                            dataKey="investment"
                            barSize={20}
                            fill="rgba(255,255,255,0.05)"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            fill="url(#growthGradient)"
                            stroke="#00E5FF"
                            strokeWidth={2}
                            animationDuration={1500}
                        />
                        <Line
                            type="monotone"
                            dataKey="roas"
                            stroke="#ffffff"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            dot={false}
                            animationDuration={1500}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Leyenda */}
            <div className="mt-6 flex justify-between items-center text-[9px] font-mono tracking-tighter text-slate-500 uppercase border-t border-white/5 pt-4">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-marketnauta-primary" /> Revenue</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white/10 rounded-sm" /> Investment</span>
                </div>
                <span className="text-marketnauta-primary animate-pulse">Encrypted Data Link [OK]</span>
            </div>
        </div>
    );
}