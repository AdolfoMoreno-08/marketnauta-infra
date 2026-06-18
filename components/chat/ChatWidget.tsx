"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Compass, Terminal, Loader2, Bot } from "lucide-react";
import ChatBubble from "./ChatBubble";
import { pushToDataLayer, newEventId } from "@/lib/gtm";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GREETING: Message = {
  role: "assistant",
  content: "Hola, soy el Asistente de Navegación de Marketnauta. Estoy aquí para ayudarte a trazar el rumbo correcto en el océano de datos. ¿En qué puedo guiarte hoy?",
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    if (messages.length <= 1) {
      pushToDataLayer({ event: "chat_message", event_id: newEventId(), chat_first: true });
    }

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const data = await res.json() as { text: string; leadCreated?: boolean };

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text, timestamp: new Date() },
      ]);

      if (data.leadCreated) {
        setLeadCreated(true);
        pushToDataLayer({ event: "chat_lead", event_id: newEventId(), source: "chat_widget" });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Tuvimos un problema de conexión. Por favor intenta de nuevo o escríbenos directamente.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            // ↓ Separado del botón flotante con bottom-20, ancho más contenido
            className="fixed bottom-20 right-6 z-[90] w-[340px] max-w-[calc(100vw-32px)]"
          >
            <div className="flex flex-col h-[480px] max-h-[calc(100vh-160px)] rounded-2xl overflow-hidden border border-white/10 bg-abisal-900/98 shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_60px_rgba(0,229,255,0.06)] backdrop-blur-2xl">

              {/* HEADER */}
              <div className="flex-shrink-0 px-4 py-3 border-b border-white/5 flex items-center justify-between bg-abisal-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-marketnauta-primary/10 border border-marketnauta-primary/30 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-marketnauta-primary" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border-2 border-abisal-950" />
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-bold tracking-tight leading-tight">Asistente Marketnauta</p>
                    <p className="text-marketnauta-primary font-mono text-[9px] uppercase tracking-[0.18em] leading-tight">
                      <span className="inline-flex items-center gap-1">
                        <Terminal className="w-2.5 h-2.5" />
                        Sistema Operativo
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  aria-label="Cerrar chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* MESSAGES */}
              <div className="flex-grow overflow-y-auto px-3 py-3 space-y-2.5 scrollbar-hide">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatBubble key={i} message={msg} />
                  ))}
                </AnimatePresence>

                {/* TYPING INDICATOR */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="flex gap-2 items-start"
                    >
                      <div className="w-6 h-6 rounded-md bg-marketnauta-primary/10 border border-marketnauta-primary/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-marketnauta-primary" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/5 rounded-xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                        {[0, 0.15, 0.3].map((delay, j) => (
                          <motion.span
                            key={j}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                            className="w-1.5 h-1.5 rounded-full bg-marketnauta-primary/60"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* LEAD CREATED BANNER */}
              <AnimatePresence>
                {leadCreated && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-marketnauta-primary/10 border-t border-marketnauta-primary/20 px-4 py-2 flex items-center gap-2"
                  >
                    <Compass className="w-3 h-3 text-marketnauta-primary flex-shrink-0" />
                    <span className="text-[9px] font-mono text-marketnauta-primary uppercase tracking-wider">
                      Coordenadas registradas — Te contactaremos pronto
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* INPUT */}
              <div className="flex-shrink-0 px-3 py-3 border-t border-white/5 bg-abisal-950/40">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    disabled={isLoading}
                    maxLength={1000}
                    className="flex-grow bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-marketnauta-primary/50 transition-colors disabled:opacity-50"
                  />
                  {/* ↓ Botón Send ligeramente más pequeño para que respire del borde */}
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="w-9 h-9 rounded-xl bg-marketnauta-primary flex items-center justify-center text-abisal-950 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    aria-label="Enviar mensaje"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[9px] text-slate-600 font-mono text-center mt-2 uppercase tracking-widest">
                  Asistente IA · Marketnauta
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BUTTON — separado verticalmente del chat con bottom-6 */}
      <motion.button
        onClick={() => setIsOpen((prev) => {
          if (!prev) pushToDataLayer({ event: "chat_open", event_id: newEventId() });
          return !prev;
        })}
        className="fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full bg-marketnauta-primary flex items-center justify-center shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:shadow-[0_0_40px_rgba(0,229,255,0.55)] transition-shadow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5 text-abisal-950" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="relative">
              <MessageCircle className="w-5 h-5 text-abisal-950" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-abisal-950 opacity-50" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-abisal-950/80" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
