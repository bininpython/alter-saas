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
  Clock,
  Plus,
  ArrowRight,
  Beef,
  Droplets,
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function NutritionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);

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

  const nutritionPlan = userData?.lastWorkout?.nutrition;

  if (!nutritionPlan) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] p-6 flex flex-col items-center justify-center text-center space-y-4">
        <Utensils className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-black">Nenhuma dieta encontrada</h2>
        <p className="text-slate-500">Complete o onboarding para gerar seu plano alimentar.</p>
        <Link href="/onboarding">
          <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black hover:opacity-90 transition-all">Fazer Onboarding</button>
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

      <main className="p-6 space-y-8 max-w-lg mx-auto">
        {/* Daily Summary */}
        <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Meta Diária</h2>
              <span className="text-primary font-black">100%</span>
           </div>
           <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                 <div className="w-full aspect-square rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 mb-2">
                    <span className="text-xl font-black text-primary">165g</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proteína</span>
              </div>
              <div className="text-center">
                 <div className="w-full aspect-square rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 mb-2">
                    <span className="text-xl font-black text-[#191c1e]">220g</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carbos</span>
              </div>
              <div className="text-center">
                 <div className="w-full aspect-square rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 mb-2">
                    <span className="text-xl font-black text-[#191c1e]">73g</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gorduras</span>
              </div>
           </div>
        </section>

        {/* Water Tracker */}
        <section className="bg-primary/10 p-8 rounded-[40px] border border-primary/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                 <Droplets className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-black text-lg">Água</h3>
                 <p className="text-sm font-bold text-primary/60">{waterIntake}ml / 3500ml</p>
              </div>
           </div>
           <button 
             onClick={() => setWaterIntake(prev => prev + 250)}
             className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform"
           >
              <Plus className="w-6 h-6" />
           </button>
        </section>

        {/* Meal Plan */}
        <section className="space-y-6">
           <h2 className="text-2xl font-black">Plano de Refeições</h2>
           <div className="space-y-4">
              <MealCard 
                time="07:00" 
                name="Café da Manhã" 
                items={nutritionPlan.breakfast} 
                icon={<Clock className="w-5 h-5 text-amber-500" />}
              />
              <MealCard 
                time="12:00" 
                name="Almoço" 
                items={nutritionPlan.lunch} 
                icon={<Beef className="w-5 h-5 text-red-500" />}
              />
              <MealCard 
                time="16:00" 
                name="Lanche" 
                items={nutritionPlan.snack} 
                icon={<Clock className="w-5 h-5 text-orange-400" />}
              />
              <MealCard 
                time="20:00" 
                name="Jantar" 
                items={nutritionPlan.dinner} 
                icon={<Utensils className="w-5 h-5 text-emerald-500" />}
              />
           </div>
        </section>

        {/* Nutrition Tips */}
        {nutritionPlan.tips && (
          <section className="bg-[#191c1e] p-8 rounded-[40px] text-white space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Dicas do Nutri AI</h3>
             <p className="text-sm font-medium leading-relaxed text-slate-400">
                {nutritionPlan.tips}
             </p>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50">
        <Link href="/dashboard"><NavBtn icon={<Home className="w-6 h-6" />} label="Home" /></Link>
        <Link href="/training"><NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Training" /></Link>
        <Link href="/nutrition"><NavBtn icon={<Utensils className="w-6 h-6" />} label="Nutrition" active /></Link>
        <Link href="/progress"><NavBtn icon={<TrendingUp className="w-6 h-6" />} label="Progress" /></Link>
        <Link href="/profile"><NavBtn icon={<UserIcon className="w-6 h-6" />} label="Profile" /></Link>
      </nav>
    </div>
  );
}

function MealCard({ time, name, items, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-start gap-6 group hover:border-primary/20 transition-all cursor-pointer">
       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors shrink-0">
          {icon}
       </div>
       <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
             <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <h4 className="text-lg font-black">{name}</h4>
          <p className="text-sm font-medium text-slate-500 line-clamp-2 italic">{items}</p>
       </div>
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
