"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Send, Loader2, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "¿Cuál fue el ROAS de Meta Ads los últimos 30 días?",
  "Compara el costo por lead entre Google y Meta",
  "¿Cuáles campañas tienen peor desempeño esta semana?",
  "Genera un reporte ejecutivo de esta semana",
];

export default function AnalyticsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const query = text ?? input.trim();
    if (!query || isLoading) return;

    const userMsg: Message = { role: "user", content: query };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const dashKey = process.env.NEXT_PUBLIC_DASHBOARD_KEY ?? "";
      const res = await fetch("/api/agents/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-key": dashKey,
        },
        body: JSON.stringify({ messages: updated.slice(-6) }),
      });

      const data = await res.json() as { text?: string; error?: string; platformsQueried?: string[] };

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text ?? data.error ?? "Error al procesar la consulta." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de conexión con el agente analítico." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-marketnauta-primary" />
          <h1 className="text-white text-xl font-bold">Motor de Analytics IA</h1>
        </div>
        <p className="text-slate-500 text-sm">Consulta GA4 · Google Ads · Meta · TikTok · LinkedIn en lenguaje natural</p>
      </div>

      {/* QUICK PROMPTS */}
      {messages.length === 0 && (
        <div>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">Consultas frecuentes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-abisal-900/40 hover:border-marketnauta-primary/30 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-marketnauta-primary mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-slate-400 group-hover:text-white text-sm transition-colors leading-snug">{prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES */}
      {messages.length > 0 && (
        <div className="flex-grow bg-abisal-900/40 border border-white/[0.06] rounded-2xl p-5 space-y-4 overflow-y-auto max-h-[480px]">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant"
                  ? "bg-marketnauta-primary/10 border border-marketnauta-primary/20"
                  : "bg-white/[0.06] border border-white/10"
              }`}>
                <Bot className={`w-3.5 h-3.5 ${msg.role === "assistant" ? "text-marketnauta-primary" : "text-slate-400"}`} />
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-white/[0.04] border border-white/[0.05] text-slate-200 rounded-tl-sm"
                  : "bg-marketnauta-primary/10 border border-marketnauta-primary/20 text-white rounded-tr-sm"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-lg bg-marketnauta-primary/10 border border-marketnauta-primary/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-marketnauta-primary" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Consultando plataformas...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ej: ¿Cuál fue el ROAS de Meta esta semana?"
          disabled={isLoading}
          className="flex-grow bg-abisal-900/60 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-marketnauta-primary/40 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-4 py-3 rounded-xl bg-marketnauta-primary text-abisal-950 font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
