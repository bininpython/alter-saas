"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Zap,
  Clock,
  Dumbbell,
  Trophy,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";

const STEPS = [
  {
    id: "goal",
    title: "Qual seu objetivo?",
    desc: "Elite performance begins with focus.",
    options: [
      { id: "emagrecimento", label: "Emagrecimento", icon: <Target className="w-6 h-6" /> },
      { id: "hipertrofia", label: "Hipertrofia", icon: <Zap className="w-6 h-6" /> },
      { id: "condicionamento", label: "Condicionamento", icon: <Sparkles className="w-6 h-6" /> },
    ]
  },
  {
    id: "level",
    title: "Nível de experiência?",
    desc: "Adapting the challenge to your baseline.",
    options: [
      { id: "iniciante", label: "Iniciante", icon: <Clock className="w-6 h-6" /> },
      { id: "intermediario", label: "Intermediário", icon: <Dumbbell className="w-6 h-6" /> },
      { id: "avancado", label: "Avançado", icon: <Trophy className="w-6 h-6" /> },
    ]
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<any>({
    goal: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelect = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 400);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/onboarding", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push("/dashboard");
    } catch (error) {
      alert("Error generating your elite plan.");
    } finally {
      setLoading(false);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <header className="w-full flex justify-between items-center py-6 mb-20 max-w-lg">
         <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary fill-primary" />
            <span className="text-3xl font-black italic uppercase tracking-tighter text-primary">Alter</span>
         </div>
         <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("h-1 w-8 rounded-full transition-all duration-500", i <= currentStep ? "bg-primary" : "bg-slate-100")} />
            ))}
         </div>
      </header>

      <div className="max-w-lg w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div>
              <h1 className="text-5xl font-black italic uppercase italic tracking-tighter text-[#191c1e] mb-4 leading-none">{step.title}</h1>
              <p className="text-slate-500 font-bold italic">{step.desc}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {step.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(step.id, option.id)}
                  disabled={loading}
                  className={cn(
                    "flex items-center gap-6 p-8 rounded-[40px] border-2 transition-all duration-300 text-left group",
                    form[step.id] === option.id 
                      ? "bg-primary/5 border-primary text-primary" 
                      : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-sm",
                    form[step.id] === option.id ? "bg-primary text-white scale-110" : "bg-white group-hover:bg-white"
                  )}>
                    {option.icon}
                  </div>
                  <span className="text-2xl font-black uppercase tracking-tighter italic">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
             <div className="w-16 h-16 bg-primary rounded-full animate-ping flex items-center justify-center">
                <Zap className="w-8 h-8 text-white fill-white" />
             </div>
             <p className="mt-8 text-xl font-black uppercase tracking-widest text-primary italic">Analyzing Baseline...</p>
          </div>
        )}

        {currentStep > 0 && !loading && (
          <button 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-12 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors italic"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
