"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatBubble({ message }: { message: Message }) {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 items-start ${isBot ? "" : "flex-row-reverse"}`}
    >
      {/* AVATAR */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isBot
          ? "bg-marketnauta-primary/10 border border-marketnauta-primary/20"
          : "bg-white/[0.06] border border-white/10"
      }`}>
        {isBot
          ? <Bot className="w-3.5 h-3.5 text-marketnauta-primary" />
          : <User className="w-3.5 h-3.5 text-slate-400" />
        }
      </div>

      {/* BUBBLE */}
      <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isBot
          ? "bg-white/[0.04] border border-white/5 rounded-tl-sm text-slate-200"
          : "bg-marketnauta-primary/15 border border-marketnauta-primary/20 rounded-tr-sm text-white"
      }`}>
        {message.content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </span>
        ))}
        <div className="mt-1.5">
          <span className="text-[9px] font-mono opacity-30">
            {message.timestamp.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
