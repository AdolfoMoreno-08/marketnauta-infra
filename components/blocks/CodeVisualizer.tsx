"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Layout, Globe, ChevronRight } from "lucide-react";

export default function CodeVisualizer() {
    const lines = [
        { code: "const Marketnauta = () => {", color: "text-marketnauta-primary" },
        { code: "  const performance = useHighScale();", color: "text-slate-400" },
        { code: "  const strategy = deployArchitecture({", color: "text-slate-400" },
        { code: "    framework: 'Next.js 16',", color: "text-marketnauta-primary/70" },
        { code: "    optimization: 'Edge_Runtime',", color: "text-marketnauta-primary/70" },
        { code: "    security: 'AES_256_GCM'", color: "text-marketnauta-primary/70" },
        { code: "  });", color: "text-slate-400" },
        { code: "  return growth.accelerate(strategy);", color: "text-marketnauta-primary" },
        { code: "};", color: "text-marketnauta-primary" }
    ];

    return (
        <div className="w-full h-full flex flex-col font-mono text-[11px] bg-abisal-950/80 backdrop-blur-xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">

            {/* 1. TOP BAR: macOS Style */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] text-slate-400 tracking-widest uppercase">main_core.ts</span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-marketnauta-primary" /> ENGINE: 4.0.1</span>
                    <span className="px-2 py-0.5 rounded border border-marketnauta-primary/20 text-marketnauta-primary bg-marketnauta-primary/5 uppercase tracking-tighter font-bold">Stable Build</span>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden">

                {/* 2. SIDEBAR: Directorio sutil */}
                <div className="hidden lg:flex flex-col border-r border-white/5 p-4 space-y-3 bg-white/[0.01]">
                    <div className="text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-2">Explorer</div>
                    {['src', 'infra', 'lib', 'hooks'].map((folder) => (
                        <div key={folder} className="flex items-center gap-2 text-slate-500 hover:text-marketnauta-primary transition-colors cursor-default">
                            <ChevronRight className="w-3 h-3" />
                            <span className="capitalize">{folder}</span>
                        </div>
                    ))}
                </div>

                {/* 3. EDITOR DE CÓDIGO: Syntax Highlighting real */}
                <div className="lg:col-span-4 p-8 relative group overflow-hidden">
                    {/* El resplandor que sigue al código */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200px] h-[200px] bg-marketnauta-primary/5 blur-[80px] pointer-events-none" />

                    <div className="space-y-2 relative z-10">
                        {lines.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start"
                            >
                                <span className="text-slate-700 mr-8 inline-block w-4 text-right tabular-nums select-none">{i + 1}</span>
                                <span className={`${item.color} tracking-tight font-medium leading-relaxed`}>
                                    {item.code}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* 4. OVERLAY DE INFRAESTRUCTURA: Nodos Flotantes Sophisticated */}
                    <div className="absolute top-8 right-8 flex flex-col gap-4">
                        {[
                            { Icon: Layout, label: "UI.Core" },
                            { Icon: Globe, label: "Edge.Net" },
                            { Icon: Cpu, label: "Data.Sync" }
                        ].map((node, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 + (i * 0.2) }}
                                whileHover={{ scale: 1.05, x: -5 }}
                                className="flex items-center gap-3 bg-abisal-900/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl group cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-marketnauta-primary/10 border border-marketnauta-primary/20 flex items-center justify-center text-marketnauta-primary group-hover:bg-marketnauta-primary group-hover:text-abisal-950 transition-all duration-500">
                                    <node.Icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col pr-2">
                                    <span className="text-[9px] text-white font-bold tracking-wide">{node.label}</span>
                                    <span className="text-[7px] text-marketnauta-primary font-mono opacity-60">Status: Active</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. STATUS BAR: Telemetría final */}
            <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex justify-between items-center text-[9px] text-slate-500 font-mono">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary animate-[pulse_2s_infinite]" />
                        Deployment: Vercel_Edge_Node
                    </span>
                    <span className="hidden sm:inline-block">UTF-8</span>
                    <span className="hidden sm:inline-block text-slate-600">Ln 8, Col 32</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 rounded-full border border-abisal-950 bg-slate-700" />)}
                    </div>
                    <span className="ml-2 font-bold text-slate-400">Deployed 2m ago</span>
                </div>
            </div>
        </div>
    );
}