"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Dumbbell,
  Utensils,
  TrendingUp,
  User as UserIcon,
  Bell,
  Play,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Flame,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ChatBot from "@/components/ChatBot";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [updatingFocus, setUpdatingFocus] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);

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
      }
      setUserData(res.data);
      // Fetch weekly report in background
      fetchWeeklyReport();
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBodyFocus = async (newFocus: string) => {
    setShowFocusModal(false);
    setUpdatingFocus(true);
    try {
      await axios.post("/api/user/target", { targetBodyPart: newFocus });
      await fetchUserData(); // reload to get new plan
    } catch (error) {
      console.error("Erro ao atualizar foco", error);
      alert("Erro ao recriar plano. Tente novamente.");
    } finally {
      setUpdatingFocus(false);
    }
  };

  const fetchWeeklyReport = async () => {
    setReportLoading(true);
    try {
      const res = await axios.get("/api/ai/weekly-report");
      setWeeklyReport(res.data.report);
    } catch (error) {
      console.error("Erro ao carregar relatório semanal", error);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading || updatingFocus) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        {updatingFocus && <p className="text-primary font-black animate-pulse text-sm uppercase tracking-widest text-center px-6">A IA está reconstruindo seu plano mensal...</p>}
      </div>
    );
  }

  const WEIGHT_DATA = userData?.recentCheckins?.length > 0
    ? userData.recentCheckins.map((c: any) => ({
        date: new Date(c.createdAt).toLocaleDateString("pt-BR", { weekday: "short" }),
        weight: c.weight
      })).reverse()
    : [
        { date: "Seg", weight: 80 },
        { date: "Ter", weight: 79.5 },
        { date: "Qua", weight: 79 },
        { date: "Qui", weight: 78.8 },
        { date: "Sex", weight: 78.6 },
        { date: "Sab", weight: 78.4 },
      ];

  const trainingPlan = userData?.lastWorkout?.training;
  const nutritionPlan = userData?.lastWorkout?.nutrition;
  const currentWeight = WEIGHT_DATA[WEIGHT_DATA.length - 1]?.weight;
  const firstWeight = WEIGHT_DATA[0]?.weight;
  const weightChange = currentWeight && firstWeight ? (currentWeight - firstWeight).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <Zap className="w-6 h-6 text-primary fill-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Alter</span>
        </div>
        <button className="relative p-2 text-slate-400">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Welcome Section */}
        <section className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black mb-1">Olá, {session?.user?.name?.split(" ")[0] || "Campeão"}</h1>
            <p className="text-slate-500 font-medium">Pronto para o treino de hoje?</p>
          </div>
          <div className="bg-[#f5f3ff] px-4 py-2 rounded-2xl flex items-center gap-2 border border-primary/10">
            <span className="text-xl">🔥</span>
            <span className="font-black text-primary">{userData?.user?.streak || 0}</span>
          </div>
        </section>

        {/* Change Focus Section */}
        <section className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Foco Muscular Mensal</span>
            <span className="font-bold text-primary">{userData?.user?.targetBodyPart || "Corpo Todo"}</span>
          </div>
          <button 
            onClick={() => setShowFocusModal(true)}
            className="text-xs bg-slate-50 px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Mudar Foco
          </button>
        </section>

        {/* Start Training Button */}
        <Link href="/training">
          <button className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl tracking-wider">
            <Play className="w-6 h-6 fill-white" />
            COMEÇAR TREINO
          </button>
        </Link>

        {/* Focus Modal */}
        {showFocusModal && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] p-8 w-full max-w-sm space-y-6">
              <h2 className="text-2xl font-black text-center">Novo Foco Muscular</h2>
              <p className="text-center text-slate-500 text-sm font-medium">A IA irá gerar um plano MENSAL totalmente novo focado na área escolhida.</p>
              <div className="grid grid-cols-2 gap-3">
                {["Peito", "Costas", "Pernas", "Ombros", "Braços", "Glúteos", "Abdômen", "Corpo Todo"].map((part) => (
                  <button
                    key={part}
                    onClick={() => updateBodyFocus(part)}
                    className="p-3 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700 border border-slate-100 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {part}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowFocusModal(false)}
                className="w-full p-4 rounded-2xl font-bold text-slate-400 mt-2 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-[20px] border border-slate-100 text-center">
            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-black block">{userData?.user?.totalWorkouts || 0}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Treinos</span>
          </div>
          <div className="bg-white p-4 rounded-[20px] border border-slate-100 text-center">
            <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Scale className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xl font-black block">{currentWeight || "--"}kg</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Peso</span>
          </div>
          <div className="bg-white p-4 rounded-[20px] border border-slate-100 text-center">
            <div className="bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-sm font-black block uppercase text-primary">{userData?.user?.goal || "..."}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Objetivo</span>
          </div>
        </section>

        {/* AI Weekly Report */}
        {weeklyReport && (
          <section className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 rounded-[28px] text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Relatório Semanal AI</h3>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-lg font-black">{weeklyReport.score || 0}%</span>
              </div>
            </div>

            <p className="text-sm font-medium text-white/90 leading-relaxed">{weeklyReport.summary}</p>

            {/* Weekly Goals */}
            {weeklyReport.weeklyGoals && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Metas da Semana</h4>
                {weeklyReport.weeklyGoals.map((g: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="text-xs font-bold text-white/90">{g.goal}</span>
                    <span className="ml-auto text-[10px] font-bold text-white/50 uppercase">{g.type}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Motivational */}
            <p className="text-sm font-black italic text-amber-200/80 pt-2 border-t border-white/10">
              "{weeklyReport.motivationalMessage}"
            </p>
          </section>
        )}

        {reportLoading && !weeklyReport && (
          <section className="bg-gradient-to-br from-violet-600 to-purple-700 p-6 rounded-[28px] text-white text-center">
            <Sparkles className="w-6 h-6 text-amber-300 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-bold text-white/70">Gerando relatório semanal com IA...</p>
          </section>
        )}

        {/* Workout Preview */}
        {trainingPlan && (
          <section className="space-y-3">
            <h2 className="text-xl font-black">Treino de Hoje</h2>
            <div className="bg-white p-5 rounded-[28px] border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-primary">{trainingPlan.split}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trainingPlan.days[0]?.day}</span>
              </div>
              <p className="text-sm font-medium text-slate-500">Foco: {trainingPlan.days[0]?.focus}</p>
              
              {trainingPlan.tips && (
                <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10">
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-1 mb-1"><Zap className="w-3 h-3" /> Progressão</span>
                  <p className="text-xs font-bold text-slate-700">{trainingPlan.tips}</p>
                </div>
              )}

              <div className="space-y-2">
                {trainingPlan.days[0]?.exercises.slice(0, 4).map((ex: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs font-bold py-1">
                    <span>{ex.name}</span>
                    <span className="text-primary">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>
              <Link href="/training">
                <button className="w-full py-3 mt-1 text-xs font-black uppercase tracking-widest border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  Ver Treino Completo
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Nutrition Preview */}
        {nutritionPlan && (
          <section className="space-y-3">
            <h2 className="text-xl font-black">Nutrição & Hábitos</h2>
            <div className="bg-[#191c1e] p-6 rounded-[28px] text-white space-y-4">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-primary" />
                <h3 className="font-black">Sua Base Diária</h3>
              </div>
              
              {nutritionPlan.water && (
                 <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 text-sm">💧</span>
                      </div>
                      <span className="text-xs font-bold text-blue-100">Meta de Água</span>
                    </div>
                    <span className="text-sm font-black text-blue-400">{nutritionPlan.water}</span>
                 </div>
              )}

              {nutritionPlan.calories && (
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center bg-white/5 rounded-xl p-2">
                    <span className="text-xs font-black text-primary block">{nutritionPlan.calories}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Calorias</span>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl p-2">
                    <span className="text-xs font-black text-emerald-400 block">{nutritionPlan.protein}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Proteína</span>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl p-2">
                    <span className="text-xs font-black text-amber-400 block">{nutritionPlan.carbs}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Carbos</span>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl p-2">
                    <span className="text-xs font-black text-orange-400 block">{nutritionPlan.fat}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Gordura</span>
                  </div>
                </div>
              )}
              
              {nutritionPlan.tips && (
                <p className="text-[10px] font-medium text-slate-400 italic">
                  * {nutritionPlan.tips}
                </p>
              )}

              <div>
                <p className="text-slate-400 text-xs font-medium">Almoço Sugerido:</p>
                <p className="text-sm font-bold text-white">{nutritionPlan.lunch}</p>
              </div>
              <Link href="/nutrition">
                <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Ver Dieta Completa <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Weight Evolution Chart */}
        <section className="bg-white p-5 rounded-[28px] border border-slate-100 space-y-3">
          <div className="flex justify-between items-start">
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evolução de Peso</h3>
               <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-black">{currentWeight || "--"}</span>
                 <span className="text-sm font-bold text-slate-400">kg</span>
               </div>
            </div>
            {weightChange && (
              <span className={cn(
                "text-xs font-black px-2 py-1 rounded-full",
                parseFloat(weightChange) <= 0 ? "text-emerald-500 bg-emerald-50" : "text-red-500 bg-red-50"
              )}>
                {parseFloat(weightChange) <= 0 ? "↓" : "↑"} {Math.abs(parseFloat(weightChange))}kg
              </span>
            )}
          </div>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={WEIGHT_DATA}>
                 <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                    {WEIGHT_DATA.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === WEIGHT_DATA.length - 1 ? "#7c3aed" : "#ede9fe"} />
                    ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Motivation Card */}
        {userData?.lastWorkout?.motivation && (
          <section className="bg-primary/10 p-6 rounded-[28px] border border-primary/20">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Motivação do Dia</h3>
            <p className="text-lg font-black italic text-slate-800 leading-tight">
              "{userData.lastWorkout.motivation}"
            </p>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50 pb-safe">
        <Link href="/dashboard"><NavBtn icon={<Home className="w-6 h-6" />} label="Início" active /></Link>
        <Link href="/training"><NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Treino" /></Link>
        <Link href="/nutrition"><NavBtn icon={<Utensils className="w-6 h-6" />} label="Dieta" /></Link>
        <Link href="/progress"><NavBtn icon={<TrendingUp className="w-6 h-6" />} label="Progresso" /></Link>
        <Link href="/profile"><NavBtn icon={<UserIcon className="w-6 h-6" />} label="Perfil" /></Link>
      </nav>

      <ChatBot />
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
