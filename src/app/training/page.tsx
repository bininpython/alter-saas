"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  User as UserIcon, 
  Bell, 
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Repeat,
  Timer,
  Zap,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function TrainingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/api/user/data");
      if (!res.data.user.onboardingCompleted) {
        router.push("/onboarding");
        return;
      }
      setUserData(res.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const trainingPlan = userData?.lastWorkout?.training;
  const currentDay = trainingPlan?.days[0];
  const exercises = currentDay?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];

  if (!currentDay) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] p-6 flex flex-col items-center justify-center text-center space-y-4">
        <Dumbbell className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-black">Nenhum treino encontrado</h2>
        <p className="text-slate-500">Complete o onboarding para gerar seu primeiro plano.</p>
        <Link href="/onboarding">
          <button className="btn-primary px-8">Fazer Onboarding</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <Zap className="w-6 h-6 text-primary fill-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Alter</span>
        </div>
        <div className="flex items-center gap-3">
           <Bell className="w-6 h-6 text-slate-400" />
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary uppercase">
             {session?.user?.name?.[0] || "U"}
           </div>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {!isWorkoutStarted ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black">{currentDay.focus}</h1>
              <p className="text-sm text-slate-500 font-medium">Ficha Completa de Treino ({exercises.length} exercícios)</p>
            </div>

            {trainingPlan?.tips && (
              <div className="bg-primary/5 p-4 rounded-3xl border border-primary/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" /> Dica da IA
                </span>
                <p className="text-sm font-bold text-slate-700">{trainingPlan.tips}</p>
              </div>
            )}

            <div className="space-y-3">
              {exercises.map((ex: any, i: number) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-lg w-2/3 leading-tight">{ex.name}</h3>
                    <div className="bg-slate-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-black text-primary">{ex.sets}x{ex.reps}</span>
                    </div>
                  </div>
                  {ex.target && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">Alvo: {ex.target}</span>
                      <p className="text-xs font-medium text-slate-500">{ex.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsWorkoutStarted(true)}
              className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl tracking-wider mt-8"
            >
              Iniciar Treino Interativo
              <Play className="w-6 h-6 fill-current" />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Workout Info */}
            <div className="flex justify-between items-end">
              <h1 className="text-3xl font-black">{currentDay.focus}</h1>
              <span className="text-xs font-black text-primary uppercase tracking-widest mb-1">
                {currentExerciseIndex + 1} / {exercises.length} Exercícios
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
              ></div>
            </div>

            {/* Current Exercise Card */}
            <div className="relative rounded-[40px] overflow-hidden group aspect-[4/3] shadow-xl">
               <img 
                 src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" 
                 className="w-full h-full object-cover" 
                 alt={currentExercise?.name}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-3">Movimento Atual</span>
                  <h2 className="text-4xl font-black text-white">{currentExercise?.name}</h2>
               </div>
            </div>

            {/* Targets */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[32px] border border-slate-100 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Séries / Reps</span>
                  <span className="text-3xl font-black text-primary">{currentExercise?.sets}x{currentExercise?.reps}</span>
               </div>
               <div className="bg-white p-6 rounded-[32px] border border-slate-100 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Descanso</span>
                  <span className="text-3xl font-black text-[#191c1e]">{currentExercise?.rest}</span>
               </div>
            </div>

            {/* AI Explanations */}
            {currentExercise?.target && currentExercise?.explanation && (
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-[32px] space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Foco: {currentExercise.target}
                </h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {currentExercise.explanation}
                </p>
              </div>
            )}

            {/* Exercises List Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Próximos Exercícios</h3>
              {exercises.slice(currentExerciseIndex + 1).map((ex: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex justify-between items-center opacity-70">
                  <span className="font-bold">{ex.name}</span>
                  <span className="text-xs font-black text-primary">{ex.sets}x{ex.reps}</span>
                </div>
              ))}
            </div>

            {/* Finish / Next Button */}
            <button 
              onClick={() => {
                if (currentExerciseIndex < exercises.length - 1) {
                  setCurrentExerciseIndex(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  router.push("/dashboard");
                }
              }}
              className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl tracking-wider mt-8"
            >
              {currentExerciseIndex < exercises.length - 1 ? "Próximo Exercício" : "Concluir Treino"}
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50 pb-safe">
        <Link href="/dashboard"><NavBtn icon={<Home className="w-6 h-6" />} label="Início" /></Link>
        <Link href="/training"><NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Treino" active /></Link>
        <Link href="/nutrition"><NavBtn icon={<Utensils className="w-6 h-6" />} label="Dieta" /></Link>
        <Link href="/progress"><NavBtn icon={<TrendingUp className="w-6 h-6" />} label="Progresso" /></Link>
        <Link href="/profile"><NavBtn icon={<UserIcon className="w-6 h-6" />} label="Perfil" /></Link>
      </nav>
    </div>
  );
}

function NavBtn({ icon, label, active = false }: any) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-1 min-w-[64px] transition-colors cursor-pointer",
      active ? "text-primary" : "text-slate-400"
    )}>
      <div className={cn("p-2 rounded-xl", active && "bg-primary/5")}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

