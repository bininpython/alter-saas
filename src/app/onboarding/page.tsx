"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  ChevronLeft,
  Sparkles,
  Zap,
  Clock,
  Dumbbell,
  Trophy,
  Scale,
  Ruler,
  Calendar,
  User,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

const CHOICE_STEPS = [
  {
    id: "gender",
    title: "Qual o seu sexo?",
    desc: "A biologia importa na personalização do plano.",
    options: [
      { id: "masculino", label: "Homem", icon: <User className="w-6 h-6" /> },
      { id: "feminino", label: "Mulher", icon: <Users className="w-6 h-6" /> },
    ]
  },
  {
    id: "goal",
    title: "Qual seu objetivo?",
    desc: "A performance de elite começa com o foco.",
    options: [
      { id: "emagrecimento", label: "Emagrecimento", icon: <Target className="w-6 h-6" /> },
      { id: "hipertrofia", label: "Hipertrofia", icon: <Zap className="w-6 h-6" /> },
      { id: "condicionamento", label: "Condicionamento", icon: <Sparkles className="w-6 h-6" /> },
    ]
  },
  {
    id: "targetBodyPart",
    title: "Qual seu foco corporal?",
    desc: "Onde você quer ver mais resultados?",
    options: [
      { id: "geral", label: "Corpo Todo", icon: <User className="w-6 h-6" /> },
      { id: "peito_bracos", label: "Peito e Braços", icon: <Dumbbell className="w-6 h-6" /> },
      { id: "pernas_gluteos", label: "Pernas e Glúteos", icon: <Zap className="w-6 h-6" /> },
      { id: "abdomen", label: "Abdômen (Core)", icon: <Target className="w-6 h-6" /> },
    ]
  },
  {
    id: "level",
    title: "Nível de experiência?",
    desc: "Adaptando o desafio ao seu ponto de partida.",
    options: [
      { id: "iniciante", label: "Iniciante", icon: <Clock className="w-6 h-6" /> },
      { id: "intermediario", label: "Intermediário", icon: <Dumbbell className="w-6 h-6" /> },
      { id: "avancado", label: "Avançado", icon: <Trophy className="w-6 h-6" /> },
    ]
  },
  {
    id: "frequency",
    title: "Quantas vezes por semana?",
    desc: "Vamos montar o plano ideal para sua rotina.",
    options: [
      { id: "3", label: "3x por semana", icon: <Calendar className="w-6 h-6" /> },
      { id: "4", label: "4x por semana", icon: <Calendar className="w-6 h-6" /> },
      { id: "5", label: "5x por semana", icon: <Calendar className="w-6 h-6" /> },
    ]
  }
];

const TOTAL_STEPS = CHOICE_STEPS.length + 1; // +1 for body data step

export default function Onboarding() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<any>({
    gender: "",
    goal: "",
    targetBodyPart: "",
    level: "",
    frequency: "3",
    weight: "",
    height: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/onboarding");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSelect = (field: string, value: string) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    if (currentStep < CHOICE_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 400);
    } else if (currentStep === CHOICE_STEPS.length - 1) {
      // Go to body data step
      setTimeout(() => setCurrentStep(CHOICE_STEPS.length), 400);
    }
  };

  const handleBodySubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/onboarding", {
        ...form,
        name: session?.user?.name || "",
      });

      // Save initial weight check-in if provided
      if (form.weight) {
        try {
          await axios.post("/api/user/checkin", { weight: parseFloat(form.weight) });
        } catch (e) {
          // Non-critical, continue
        }
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Erro ao gerar seu plano de elite. Tente novamente.");
      setLoading(false);
    }
  };

  const isBodyStep = currentStep === CHOICE_STEPS.length;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <header className="w-full flex justify-between items-center py-6 mb-12 max-w-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary fill-primary" />
          <span className="text-3xl font-black italic uppercase tracking-tighter text-primary">Alter</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={cn("h-1 w-6 rounded-full transition-all duration-500", i <= currentStep ? "bg-primary" : "bg-slate-100")} />
          ))}
        </div>
      </header>

      <div className="max-w-lg w-full">
        <AnimatePresence mode="wait">
          {!isBodyStep ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#191c1e] mb-3 leading-none">
                  {CHOICE_STEPS[currentStep].title}
                </h1>
                <p className="text-slate-500 font-bold italic">{CHOICE_STEPS[currentStep].desc}</p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {CHOICE_STEPS[currentStep].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(CHOICE_STEPS[currentStep].id, option.id)}
                    disabled={loading}
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all duration-300 text-left group",
                      form[CHOICE_STEPS[currentStep].id] === option.id
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-[20px] flex items-center justify-center transition-all shadow-sm",
                      form[CHOICE_STEPS[currentStep].id] === option.id ? "bg-primary text-white scale-110" : "bg-white"
                    )}>
                      {option.icon}
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter italic">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="body-data"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#191c1e] mb-3 leading-none">
                  Seus dados
                </h1>
                <p className="text-slate-500 font-bold italic">
                  Para montar o plano perfeito pra você. 💪
                </p>
              </div>

              <div className="space-y-5">
                {/* Weight */}
                <div className="bg-slate-50 p-5 rounded-[28px] border-2 border-transparent focus-within:border-primary/30 transition-all">
                  <label className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Scale className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">Peso (kg)</span>
                  </label>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="Ex: 78.5"
                    step="0.1"
                    min="20"
                    max="300"
                    className="w-full bg-white px-5 py-4 rounded-2xl text-2xl font-black text-center border border-slate-100 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Height */}
                <div className="bg-slate-50 p-5 rounded-[28px] border-2 border-transparent focus-within:border-primary/30 transition-all">
                  <label className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">Altura (m)</span>
                  </label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    placeholder="Ex: 1.75"
                    step="0.01"
                    min="1.00"
                    max="2.50"
                    className="w-full bg-white px-5 py-4 rounded-2xl text-2xl font-black text-center border border-slate-100 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Age */}
                <div className="bg-slate-50 p-5 rounded-[28px] border-2 border-transparent focus-within:border-primary/30 transition-all">
                  <label className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">Idade</span>
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="Ex: 25"
                    min="14"
                    max="100"
                    className="w-full bg-white px-5 py-4 rounded-2xl text-2xl font-black text-center border border-slate-100 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleBodySubmit}
                disabled={loading || !form.weight}
                className="btn-primary w-full py-6 flex items-center justify-center gap-3 text-lg tracking-wider disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? "GERANDO SEU PLANO..." : "GERAR MEU PLANO COM IA"}
              </button>

              <p className="text-center text-xs text-slate-400 font-medium">
                Powered by DeepSeek AI • Plano 100% personalizado
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {(loading || error) && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
            {loading ? (
              <>
                <div className="relative">
                  <div className="w-20 h-20 bg-primary rounded-full animate-ping absolute inset-0 opacity-30"></div>
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center relative">
                    <Zap className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
                <p className="mt-8 text-xl font-black uppercase tracking-widest text-primary italic">Analisando Perfil...</p>
                <p className="mt-2 text-sm text-slate-400 font-medium">A IA está criando seu plano personalizado</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-black">!</span>
                </div>
                <p className="mt-8 text-lg font-black text-red-500">{error}</p>
                <button
                  onClick={() => { setError(""); }}
                  className="mt-4 btn-primary"
                >
                  Tentar Novamente
                </button>
              </>
            )}
          </div>
        )}

        {currentStep > 0 && !loading && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-10 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors italic"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>
        )}
      </div>
    </div>
  );
}
