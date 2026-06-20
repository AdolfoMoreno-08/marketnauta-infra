"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Brain, Zap, Activity, BarChart3, Users, Tag, ChevronRight, Cpu, RefreshCw } from "lucide-react";

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type EngineState = "idle" | "parsing" | "thinking" | "tool" | "streaming" | "complete" | "error";

type StreamEvent =
  | { t: "start" }
  | { t: "status"; s: string }
  | { t: "text"; d: string }
  | { t: "tool_start"; n: string; label: string }
  | { t: "tool_end"; n: string; summary: string }
  | { t: "done"; stats: { tokens: number; ms: number; tools: string[] } }
  | { t: "error"; msg: string };

interface ToolCall {
  name: string;
  label: string;
  summary?: string;
  status: "running" | "done";
}

interface EngineStats {
  tokens: number;
  ms: number;
  tools: string[];
}

// ─── PROMPTS DEMO ─────────────────────────────────────────────────────────────

const DEMO_PROMPTS = [
  {
    id: "roas",
    label: "Analizar ROAS",
    prompt: "Analiza el ROAS de mis campañas en los últimos 30 días y dime cómo mejorarlo.",
    icon: BarChart3,
    color: "rgba(0,229,255,0.12)",
    borderColor: "rgba(0,229,255,0.3)",
    activeAgent: "data",
  },
  {
    id: "attr",
    label: "Pérdida de atribución",
    prompt: "Detecta fugas de atribución por iOS 14+ y cuánto revenue estamos perdiendo sin reportar.",
    icon: Activity,
    color: "rgba(255,107,53,0.10)",
    borderColor: "rgba(255,107,53,0.3)",
    activeAgent: "data",
  },
  {
    id: "lead",
    label: "Calificar un lead",
    prompt: "Califica a un lead de e-commerce con presupuesto $5K mensual en pauta digital.",
    icon: Users,
    color: "rgba(0,119,255,0.10)",
    borderColor: "rgba(0,119,255,0.3)",
    activeAgent: "lead",
  },
  {
    id: "report",
    label: "Reporte de campañas",
    prompt: "Genera un reporte ejecutivo del rendimiento de mis campañas digitales esta semana.",
    icon: Tag,
    color: "rgba(16,185,129,0.10)",
    borderColor: "rgba(16,185,129,0.3)",
    activeAgent: "data",
  },
];

// ─── ESTADO POR FASE ──────────────────────────────────────────────────────────

const STATE_CONFIG: Record<EngineState, { label: string; color: string; dot: string }> = {
  idle:      { label: "IDLE — Esperando instrucción",   color: "text-slate-500", dot: "bg-slate-600" },
  parsing:   { label: "PARSING — Analizando prompt",    color: "text-yellow-400", dot: "bg-yellow-400" },
  thinking:  { label: "THINKING — Seleccionando agente", color: "text-blue-400", dot: "bg-blue-400" },
  tool:      { label: "TOOL_USE — Consultando datos",   color: "text-marketnauta-orange", dot: "bg-marketnauta-orange" },
  streaming: { label: "STREAMING — Generando respuesta", color: "text-marketnauta-primary", dot: "bg-marketnauta-primary" },
  complete:  { label: "COMPLETE — Análisis listo",      color: "text-green-400", dot: "bg-green-400" },
  error:     { label: "ERROR — Ver consola",            color: "text-red-400", dot: "bg-red-400" },
};

// ─── RED NEURONAL SVG ─────────────────────────────────────────────────────────

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sublabel: string;
  active?: boolean;
}

const NODES: NeuralNode[] = [
  { id: "cs",    x: 60,  y: 90,  label: "Customer", sublabel: "Service" },
  { id: "core",  x: 200, y: 80,  label: "Marketnauta", sublabel: "Core" },
  { id: "tools", x: 200, y: 25,  label: "Tools",    sublabel: "GA4 · Meta" },
  { id: "data",  x: 340, y: 50,  label: "Data",     sublabel: "Analyst" },
  { id: "lead",  x: 340, y: 120, label: "Lead",     sublabel: "Qualifier" },
];

const CONNECTIONS = [
  { from: "cs",    to: "core",  id: "cs-core" },
  { from: "tools", to: "core",  id: "tools-core" },
  { from: "core",  to: "data",  id: "core-data" },
  { from: "core",  to: "lead",  id: "core-lead" },
];

function getNode(id: string) {
  return NODES.find((n) => n.id === id)!;
}

function NeuralNetwork({
  engineState,
  activeAgent,
  activeTools,
}: {
  engineState: EngineState;
  activeAgent: string;
  activeTools: string[];
}) {
  const isActive = engineState !== "idle" && engineState !== "complete";
  const isPulsing = engineState === "tool" || engineState === "streaming";

  const toolToNode: Record<string, string> = {
    query_ga4: "tools",
    query_ads: "tools",
    analyze_attribution: "tools",
  };

  const activeNodeIds = new Set<string>(["core"]);
  if (engineState !== "idle" && engineState !== "complete") {
    if (activeAgent === "lead") {
      activeNodeIds.add("lead");
    } else {
      activeNodeIds.add("data");
    }
  }
  activeTools.forEach((t) => {
    const n = toolToNode[t];
    if (n) activeNodeIds.add(n);
  });

  return (
    <div className="relative w-full h-36 overflow-hidden">
      <svg
        viewBox="0 0 400 150"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated gradient for data flow */}
          <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,229,255,0)" />
            <stop offset="50%" stopColor="rgba(0,229,255,0.8)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0)" />
          </linearGradient>
        </defs>

        {/* Connections */}
        {CONNECTIONS.map((conn) => {
          const from = getNode(conn.from);
          const to = getNode(conn.to);
          if (!from || !to) return null;
          const isConnActive = activeNodeIds.has(conn.from) && activeNodeIds.has(conn.to);

          return (
            <g key={conn.id}>
              {/* Base line */}
              <line
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              {/* Active line */}
              {isConnActive && (
                <motion.line
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  stroke="rgba(0,229,255,0.5)"
                  strokeWidth="1.5"
                  filter="url(#glow-filter)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {/* Data packet dot traveling along the line */}
              {isPulsing && isConnActive && (
                <motion.circle
                  r="3"
                  fill="#00E5FF"
                  filter="url(#glow-filter)"
                  animate={{
                    cx: [from.x, to.x, from.x],
                    cy: [from.y, to.y, from.y],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 1.5,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isNodeActive = activeNodeIds.has(node.id);
          const isCoreNode = node.id === "core";

          return (
            <g key={node.id}>
              {/* Outer pulse ring */}
              {isNodeActive && isPulsing && (
                <motion.circle
                  cx={node.x} cy={node.y}
                  r="16"
                  fill="none"
                  stroke="rgba(0,229,255,0.3)"
                  strokeWidth="1"
                  animate={{ r: [14, 22], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Node circle */}
              <motion.circle
                cx={node.x} cy={node.y}
                r={isCoreNode ? 14 : 10}
                fill={isNodeActive ? "rgba(0,229,255,0.15)" : "rgba(11,19,43,0.9)"}
                stroke={
                  isNodeActive
                    ? isCoreNode
                      ? "#00E5FF"
                      : "rgba(0,229,255,0.6)"
                    : "rgba(255,255,255,0.08)"
                }
                strokeWidth={isCoreNode ? 2 : 1}
                filter={isNodeActive ? "url(#glow-filter)" : undefined}
                animate={{
                  scale: isNodeActive && isPulsing ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Brain icon for Core node */}
              {isCoreNode && (
                <foreignObject x={node.x - 7} y={node.y - 7} width="14" height="14">
                  <div
                    style={{
                      color: isActive ? "#00E5FF" : "rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                      <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                    </svg>
                  </div>
                </foreignObject>
              )}

              {/* Labels */}
              <text
                x={node.x}
                y={node.y + (isCoreNode ? 24 : 20)}
                textAnchor="middle"
                fontSize="7"
                fontFamily="monospace"
                fill={isNodeActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"}
                fontWeight="bold"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + (isCoreNode ? 32 : 28)}
                textAnchor="middle"
                fontSize="5.5"
                fontFamily="monospace"
                fill="rgba(255,255,255,0.2)"
              >
                {node.sublabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── RENDERIZADO DE MARKDOWN SIMPLE ──────────────────────────────────────────

function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="text-marketnauta-primary font-mono font-bold text-sm mt-3 mb-1">
              # {line.slice(3)}
            </p>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="text-white font-bold text-xs my-0.5">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="text-slate-300 text-xs my-0.5 pl-2">
              → {line.slice(2)}
            </p>
          );
        }
        if (line === "") return <br key={i} />;
        // Replace **bold** inline
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-slate-300 text-xs leading-relaxed my-0.5">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <span key={j} className="text-white font-semibold">
                  {part.slice(2, -2)}
                </span>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function ClaudeEngineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true });

  const [engineState, setEngineState] = useState<EngineState>("idle");
  const [statusText, setStatusText] = useState("Esperando instrucción del operador...");
  const [outputText, setOutputText] = useState("");
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [stats, setStats] = useState<EngineStats | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<(typeof DEMO_PROMPTS)[0] | null>(null);
  const [activeAgent, setActiveAgent] = useState("data");
  const [activeToolNames, setActiveToolNames] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputText, toolCalls]);

  const reset = useCallback(() => {
    setEngineState("idle");
    setStatusText("Esperando instrucción del operador...");
    setOutputText("");
    setToolCalls([]);
    setStats(null);
    setActiveToolNames([]);
    setSelectedPrompt(null);
    setIsRunning(false);
  }, []);

  const runEngine = useCallback(
    async (p: (typeof DEMO_PROMPTS)[0]) => {
      if (isRunning) return;
      setIsRunning(true);
      setSelectedPrompt(p);
      setActiveAgent(p.activeAgent);
      setOutputText("");
      setToolCalls([]);
      setStats(null);

      setEngineState("parsing");
      setStatusText("Parseando intención...");

      try {
        const res = await fetch("/api/agents/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: p.prompt }),
        });

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const event = JSON.parse(line) as StreamEvent;

              if (event.t === "start") {
                setEngineState("thinking");
                setStatusText("Activando agente...");
              } else if (event.t === "status") {
                setStatusText(event.s);
              } else if (event.t === "tool_start") {
                setEngineState("tool");
                setActiveToolNames((prev) => [...new Set([...prev, event.n])]);
                setStatusText(event.label);
                setToolCalls((prev) => [
                  ...prev,
                  { name: event.n, label: event.label, status: "running" },
                ]);
              } else if (event.t === "tool_end") {
                setToolCalls((prev) =>
                  prev.map((tc) =>
                    tc.name === event.n && tc.status === "running"
                      ? { ...tc, status: "done", summary: event.summary }
                      : tc
                  )
                );
              } else if (event.t === "text") {
                setEngineState("streaming");
                setStatusText("Generando respuesta...");
                setOutputText((prev) => prev + event.d);
              } else if (event.t === "done") {
                setEngineState("complete");
                setStatusText("Análisis completado");
                setStats(event.stats);
                setIsRunning(false);
              } else if (event.t === "error") {
                setEngineState("error");
                setStatusText(`Error: ${event.msg}`);
                setIsRunning(false);
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error de conexión";
        setEngineState("error");
        setStatusText(msg);
        setIsRunning(false);
      }
    },
    [isRunning]
  );

  const stateConfig = STATE_CONFIG[engineState];

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-6 overflow-hidden border-t border-white/[0.04]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(0,119,255,0.06) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="terminal-badge mb-6 inline-flex gap-2">
            <Brain className="w-3.5 h-3.5 text-marketnauta-primary" />
            Motor Marketnauta // Agentes en Vivo
          </span>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mt-4 mb-4">
            Inteligencia que trabaja{" "}
            <span className="text-marketnauta-primary text-glow-cyan">en tiempo real.</span>
          </h2>

          <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
            Observa cómo nuestros agentes Marketnauta procesan, razonan y actúan sobre tus datos de marketing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-card rounded-3xl overflow-hidden border border-white/[0.06]"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-abisal-900/40">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-marketnauta-primary" />
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                Marketnauta AI Engine v2.0
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${stateConfig.dot} ${
                  engineState !== "idle" && engineState !== "complete" && engineState !== "error"
                    ? "animate-pulse"
                    : ""
                }`}
              />
              <span className={`font-mono text-[10px] uppercase tracking-wider ${stateConfig.color}`}>
                {stateConfig.label}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_1.4fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {/* Left panel: Neural network + controls */}
            <div className="p-6 space-y-6">
              {/* Neural Network */}
              <div>
                <p className="font-mono text-[9px] text-slate-600 uppercase tracking-widest mb-3">
                  // Arquitectura de Agentes
                </p>
                <NeuralNetwork
                  engineState={engineState}
                  activeAgent={activeAgent}
                  activeTools={activeToolNames}
                />
              </div>

              {/* Prompt selector */}
              <div>
                <p className="font-mono text-[9px] text-slate-600 uppercase tracking-widest mb-3">
                  // Seleccionar Instrucción
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PROMPTS.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selectedPrompt?.id === p.id;
                    return (
                      <motion.button
                        key={p.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => !isRunning && runEngine(p)}
                        disabled={isRunning}
                        className="relative flex flex-col items-start gap-1.5 p-3 rounded-xl text-left transition-all duration-200 disabled:opacity-40"
                        style={{
                          background: isSelected ? p.color : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isSelected ? p.borderColor : "rgba(255,255,255,0.06)"}`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: isSelected ? p.borderColor : "rgba(255,255,255,0.3)" }}
                        />
                        <span
                          className="text-[11px] font-mono font-bold leading-tight"
                          style={{ color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}
                        >
                          {p.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => selectedPrompt && !isRunning && runEngine(selectedPrompt)}
                  disabled={!selectedPrompt || isRunning}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-30"
                  style={{
                    background: selectedPrompt
                      ? "rgba(0,229,255,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedPrompt ? "rgba(0,229,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                    color: selectedPrompt ? "#00E5FF" : "rgba(255,255,255,0.2)",
                  }}
                >
                  {isRunning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </motion.div>
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Ejecutar Agente
                    </>
                  )}
                </button>

                {engineState !== "idle" && !isRunning && (
                  <button
                    onClick={reset}
                    className="py-3 px-3 rounded-xl transition-all duration-200"
                    style={{
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                    title="Reiniciar"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Right panel: Terminal output */}
            <div className="flex flex-col">
              {/* Terminal header */}
              <div className="px-5 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/20" />
                  <span className="font-mono text-[9px] text-slate-600 ml-2 tracking-widest">
                    agent.output.stream
                  </span>
                </div>
                {stats && (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-slate-600">
                      {stats.tokens} tokens
                    </span>
                    <span className="font-mono text-[9px] text-slate-600">
                      {(stats.ms / 1000).toFixed(1)}s
                    </span>
                    <span
                      className="font-mono text-[9px] text-green-400"
                      style={{ textShadow: "0 0 8px rgba(74,222,128,0.5)" }}
                    >
                      ✓ DONE
                    </span>
                  </div>
                )}
              </div>

              {/* Output area */}
              <div
                ref={outputRef}
                className="flex-1 p-5 font-mono text-xs overflow-y-auto"
                style={{
                  minHeight: "320px",
                  maxHeight: "420px",
                  background: "rgba(3,7,18,0.6)",
                }}
              >
                {/* Idle state */}
                {engineState === "idle" && (
                  <div className="flex flex-col gap-1 text-slate-700">
                    <p>SISTEMA// DATOS.MOTOR_MARKETNAUTA v2.0</p>
                    <p>────────────────────────────────────────</p>
                    <p className="mt-2 text-slate-600">
                      ← Selecciona una instrucción y pulsa{" "}
                      <span className="text-slate-500">Ejecutar Agente</span>
                    </p>
                    <br />
                    <p className="text-slate-700">Agentes disponibles:</p>
                    {["Customer Service", "Data Analyst", "Lead Qualifier"].map((a) => (
                      <p key={a} className="text-slate-700 pl-2">
                        · {a}{" "}
                        <span className="text-green-700/50">[ONLINE]</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Status line */}
                {engineState !== "idle" && (
                  <div className="mb-4">
                    <p className="text-slate-600 text-[10px]">
                      SISTEMA// DATOS.MOTOR_MARKETNAUTA v2.0
                    </p>
                    <p className="text-slate-700 text-[10px]">────────────────────────────────────────</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] uppercase tracking-wider ${stateConfig.color}`}
                      >
                        {statusText}
                      </span>
                      {isRunning && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                          className="text-marketnauta-primary"
                        >
                          ▋
                        </motion.span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tool calls */}
                <AnimatePresence>
                  {toolCalls.map((tc, i) => (
                    <motion.div
                      key={`${tc.name}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-3 rounded-lg overflow-hidden"
                      style={{
                        border: "1px solid rgba(255,107,53,0.2)",
                        background: "rgba(255,107,53,0.04)",
                      }}
                    >
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
                        <ChevronRight
                          className={`w-3 h-3 ${
                            tc.status === "running"
                              ? "text-marketnauta-orange animate-pulse"
                              : "text-green-400"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            tc.status === "running" ? "text-marketnauta-orange" : "text-green-400"
                          }`}
                        >
                          {tc.status === "running" ? "▶ " : "✓ "}
                          {tc.label}
                        </span>
                      </div>
                      {tc.summary && (
                        <p className="px-3 py-2 text-[10px] text-slate-400">{tc.summary}</p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Streaming text output */}
                {outputText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">
                      // Respuesta del Agente
                    </p>
                    <SimpleMarkdown text={outputText} />
                    {engineState === "streaming" && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-marketnauta-primary font-bold"
                      >
                        ▋
                      </motion.span>
                    )}
                  </motion.div>
                )}

                {/* Error */}
                {engineState === "error" && (
                  <div className="mt-2 text-red-400 text-[11px]">
                    ✗ {statusText}
                  </div>
                )}
              </div>

              {/* Stats footer */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-5 text-[10px] font-mono"
                  style={{ background: "rgba(0,229,255,0.02)" }}
                >
                  <span className="text-slate-600">
                    Tokens: <span className="text-slate-400">{stats.tokens}</span>
                  </span>
                  <span className="text-slate-600">
                    Latencia: <span className="text-slate-400">{(stats.ms / 1000).toFixed(1)}s</span>
                  </span>
                  <span className="text-slate-600">
                    Herramientas:{" "}
                    <span className="text-marketnauta-primary">
                      {stats.tools.length > 0 ? stats.tools.join(", ") : "ninguna"}
                    </span>
                  </span>
                  <span className="ml-auto text-slate-700">
                    claude-haiku-4-5
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-slate-600 text-xs font-mono mt-6 tracking-wider"
        >
          // Los datos son reales cuando GA4 y APIs de pauta están configurados. Modo demo activo por defecto.
        </motion.p>
      </div>
    </section>
  );
}
