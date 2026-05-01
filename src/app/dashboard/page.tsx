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
  Flame,
  Play,
  ChevronRight,
  Trophy,
  Zap
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
  const [loading, setLoading] = useState(true);

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

  const MOCK_WEIGHT = [
    { date: "Seg", weight: 80 },
    { date: "Ter", weight: 79.5 },
    { date: "Qua", weight: 79 },
    { date: "Qui", weight: 78.8 },
    { date: "Sex", weight: 78.6 },
    { date: "Sab", weight: 78.4 },
  ];

  const trainingPlan = userData?.lastWorkout?.training;
  const nutritionPlan = userData?.lastWorkout?.nutrition;

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

      <main className="p-6 space-y-8 max-w-lg mx-auto">
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

        {/* Start Training Button */}
        <Link href="/training">
          <button className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl tracking-wider">
            <Play className="w-6 h-6 fill-white" />
            COMEÇAR TREINO
          </button>
        </Link>

        {/* Daily Goal */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Plano Atual</h3>
            <span className="text-primary font-black uppercase text-xs">{userData?.user?.goal || "Não definido"}</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-[24px] border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Nível</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black uppercase text-primary">{userData?.user?.level || "..."}</span>
                </div>
             </div>
             <div className="bg-white p-4 rounded-[24px] border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Treinos</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{userData?.user?.totalWorkouts || 0}</span>
                </div>
             </div>
          </div>
        </section>

        {/* Workout Preview */}
        {trainingPlan && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black">Treino de Hoje</h2>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg text-primary">{trainingPlan.split}</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{trainingPlan.days[0]?.day}</span>
              </div>
              <p className="text-sm font-medium text-slate-500">Foco: {trainingPlan.days[0]?.focus}</p>
              <div className="space-y-2">
                {trainingPlan.days[0]?.exercises.slice(0, 3).map((ex: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs font-bold">
                    <span>{ex.name}</span>
                    <span className="text-primary">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>
              <Link href="/training">
                <button className="w-full py-3 mt-2 text-xs font-black uppercase tracking-widest border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  Ver Treino Completo
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Nutrition Preview */}
        {nutritionPlan && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black">Nutrição</h2>
            <div className="bg-[#191c1e] p-8 rounded-[32px] text-white space-y-4">
              <div className="flex items-center gap-3">
                <Utensils className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-black">Próxima Refeição</h3>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Almoço Sugerido:</p>
                <p className="text-lg font-bold text-white">{nutritionPlan.lunch}</p>
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
        <section className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-4">
          <div className="flex justify-between items-start">
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evolução de Peso</h3>
               <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-black">78.4</span>
                 <span className="text-sm font-bold text-slate-400">kg</span>
               </div>
            </div>
            <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">↓ 1.2kg</span>
          </div>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_WEIGHT}>
                 <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                    {MOCK_WEIGHT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === MOCK_WEIGHT.length - 1 ? "#7c3aed" : "#ede9fe"} />
                    ))}
                 </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Motivation Card */}
        {userData?.lastWorkout?.motivation && (
          <section className="bg-primary/10 p-8 rounded-[32px] border border-primary/20">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Motivação do Dia</h3>
            <p className="text-lg font-black italic text-slate-800 leading-tight">
              "{userData.lastWorkout.motivation}"
            </p>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50">
        <Link href="/dashboard"><NavBtn icon={<Home className="w-6 h-6" />} label="Home" active /></Link>
        <Link href="/training"><NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Training" /></Link>
        <Link href="/nutrition"><NavBtn icon={<Utensils className="w-6 h-6" />} label="Nutrition" /></Link>
        <Link href="/progress"><NavBtn icon={<TrendingUp className="w-6 h-6" />} label="Progress" /></Link>
        <Link href="/profile"><NavBtn icon={<UserIcon className="w-6 h-6" />} label="Profile" /></Link>
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

