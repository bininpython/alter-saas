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
  Trophy,
  Calendar,
  Flame,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
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

  const WEIGHT_DATA = userData?.recentCheckins?.map((c: any) => ({
    date: new Date(c.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    weight: c.weight
  })).reverse() || [];

  const ACHIEVEMENTS = [
    { id: 1, title: "7 Dias de Streak", unlocked: (userData?.user?.streak || 0) >= 7, icon: "🔥" },
    { id: 2, title: "Primeiro Treino", unlocked: (userData?.user?.totalWorkouts || 0) > 0, icon: "💪" },
    { id: 3, title: "Mestre da Dieta", unlocked: false, icon: "🏆" },
    { id: 4, title: "30 Dias", unlocked: (userData?.user?.streak || 0) >= 30, icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <Zap className="w-6 h-6 text-primary fill-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Alter</span>
        </div>
        <Bell className="w-6 h-6 text-slate-400" />
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard 
            icon={<Flame className="w-6 h-6" />} 
            value={userData?.user?.streak || 0} 
            label="Streak" 
            color="text-orange-500" 
            bg="bg-orange-50" 
          />
          <StatCard 
            icon={<Trophy className="w-6 h-6" />} 
            value={userData?.user?.totalWorkouts || 0} 
            label="Treinos" 
            color="text-primary" 
            bg="bg-primary/10" 
          />
          <StatCard 
            icon={<Calendar className="w-6 h-6" />} 
            value={WEIGHT_DATA[WEIGHT_DATA.length - 1]?.weight || "--"} 
            label="Peso Atual" 
            color="text-emerald-500" 
            bg="bg-emerald-50" 
          />
        </div>

        {/* Weight Chart */}
        {WEIGHT_DATA.length > 0 && (
          <section className="bg-white p-6 rounded-[32px] border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Evolução de Peso</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">{WEIGHT_DATA[WEIGHT_DATA.length - 1].weight}kg</span>
                </div>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEIGHT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 800, color: '#7c3aed' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#7c3aed" 
                    strokeWidth={4}
                    dot={{ fill: '#7c3aed', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Conquistas */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black">Conquistas</h2>
          <div className="grid grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-6 rounded-[24px] border-2 text-center transition-all ${achievement.unlocked ? 'bg-white border-primary/20' : 'bg-slate-50 border-transparent opacity-50'}`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="font-black text-sm">{achievement.title}</h4>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50">
        <Link href="/dashboard"><NavBtn icon={<Home className="w-6 h-6" />} label="Home" /></Link>
        <Link href="/training"><NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Training" /></Link>
        <Link href="/nutrition"><NavBtn icon={<Utensils className="w-6 h-6" />} label="Nutrition" /></Link>
        <Link href="/progress"><NavBtn icon={<TrendingUp className="w-6 h-6" />} label="Progress" active /></Link>
        <Link href="/profile"><NavBtn icon={<UserIcon className="w-6 h-6" />} label="Profile" /></Link>
      </nav>
    </div>
  );
}

function StatCard({ icon, value, label, color, bg }: any) {
  return (
    <div className="bg-white p-4 rounded-[24px] border border-slate-100 text-center">
      <div className={`${bg} w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 ${color}`}>
        {icon}
      </div>
      <div className="text-xl font-black mb-1">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
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
