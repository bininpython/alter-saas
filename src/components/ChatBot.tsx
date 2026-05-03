"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Bot, User, Scale, Dumbbell, Utensils, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  { label: "Meu treino de hoje", icon: <Dumbbell className="w-3.5 h-3.5" />, message: "Qual meu treino de hoje? Me dê exercícios detalhados com séries e repetições" },
  { label: "Registrar peso", icon: <Scale className="w-3.5 h-3.5" />, message: "Quero registrar meu peso atual" },
  { label: "Plano de refeição", icon: <Utensils className="w-3.5 h-3.5" />, message: "Monte um plano de refeições para hoje baseado no meu objetivo" },
  { label: "Dica do dia", icon: <Sparkles className="w-3.5 h-3.5" />, message: "Me dê uma dica de treino ou nutrição para melhorar meus resultados" },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [weightMode, setWeightMode] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("alter_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    } else {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "E aí, campeão! 💪 Sou o ALTER, seu Personal Trainer AI!\n\nEstou aqui para montar treinos, planos de refeição, acompanhar seu peso e te manter motivado.\n\nPor onde quer começar? Me conta seu peso atual ou escolha uma opção abaixo! 🔥",
        }
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      localStorage.setItem("alter_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Build chat history for context
  const buildHistory = () => {
    return messages.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
  };

  const handleSend = async (customMessage?: string) => {
    const msg = customMessage || input.trim();
    if (!msg || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/chat", {
        message: msg,
        history: buildHistory(),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Ops, tive um problema técnico! Tente novamente em alguns segundos. 🤔",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightSubmit = async () => {
    const weight = parseFloat(weightInput);
    if (!weight || weight < 20 || weight > 300) return;

    setWeightMode(false);
    setWeightInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Meu peso atual é ${weight}kg`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Save weight check-in
      await axios.post("/api/user/checkin", { weight });

      // Ask AI to comment
      const res = await axios.post("/api/ai/chat", {
        message: `O aluno acabou de registrar o peso: ${weight}kg. Comente sobre isso, dê feedback motivacional e sugira próximos passos baseado no objetivo dele.`,
        history: buildHistory(),
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✅ Peso registrado: **${weight}kg**\n\n${res.data.response}`,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✅ Peso registrado: ${weight}kg! Continue acompanhando seu progresso na aba Progresso! 📊`,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Render message content with basic markdown
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Bold
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = boldParts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      );
      return (
        <span key={i}>
          {rendered}
          {i < content.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 z-50 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">ALTER Personal AI</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                    Online • DeepSeek AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex gap-2", msg.role === "user" && "justify-end")}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm"
                        : "bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-tr-sm"
                    )}
                  >
                    {renderContent(msg.content)}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && !loading && (
              <div className="px-4 py-2 bg-white border-t border-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (action.label === "Registrar peso") {
                        setWeightMode(true);
                      } else {
                        handleSend(action.message);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-bold whitespace-nowrap hover:bg-violet-100 transition-colors border border-violet-100"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Weight Input Mode */}
            {weightMode && (
              <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-t border-violet-100">
                <p className="text-xs font-bold text-violet-700 mb-2">⚖️ Registrar peso atual (kg)</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleWeightSubmit()}
                    placeholder="Ex: 78.5"
                    step="0.1"
                    min="20"
                    max="300"
                    className="flex-1 px-4 py-2.5 bg-white border border-violet-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 font-bold text-center text-lg"
                    autoFocus
                  />
                  <button
                    onClick={handleWeightSubmit}
                    disabled={!weightInput}
                    className="px-4 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-violet-700 transition-colors"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => { setWeightMode(false); setWeightInput(""); }}
                    className="px-3 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm hover:bg-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            {!weightMode && (
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setWeightMode(true)}
                    className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition-colors shrink-0"
                    title="Registrar peso"
                  >
                    <Scale className="w-4 h-4 text-slate-400" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Fale com seu Personal AI..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-violet-300"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-violet-300/30 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
