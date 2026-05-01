"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  User, 
  Bell, 
  Flame,
  Play,
  ChevronRight,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell
} from "recharts";

const MOCK_WEIGHT = [
  { date: "Seg", weight: 80 },
  { date: "Ter", weight: 79.5 },
  { date: "Qua", weight: 79 },
  { date: "Qui", weight: 78.8 },
  { date: "Sex", weight: 78.6 },
  { date: "Sab", weight: 78.4 },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <ZapIcon className="w-6 h-6 text-primary fill-primary" />
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
            <h1 className="text-3xl font-black mb-1">Olá, Campeão</h1>
            <p className="text-slate-500 font-medium">Pronto para o treino de hoje?</p>
          </div>
          <div className="bg-[#f5f3ff] px-4 py-2 rounded-2xl flex items-center gap-2 border border-primary/10">
            <span className="text-xl">🔥</span>
            <span className="font-black text-primary">12</span>
          </div>
        </section>

        {/* Start Training Button */}
        <button className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl tracking-wider">
          <Play className="w-6 h-6 fill-white" />
          COMEÇAR TREINO
        </button>

        {/* Daily Goal */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Meta Diária</h3>
            <span className="text-primary font-black">75%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-[24px] border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Calorias</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">450</span>
                  <span className="text-xs font-bold text-slate-400">kcal</span>
                </div>
             </div>
             <div className="bg-white p-4 rounded-[24px] border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Tempo</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">45</span>
                  <span className="text-xs font-bold text-slate-400">min</span>
                </div>
             </div>
          </div>
        </section>

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

        {/* Next Milestone Card */}
        <section className="bg-[#191c1e] p-8 rounded-[32px] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <TrophyIcon className="w-16 h-16" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Próximo Marco</h3>
            <div>
              <h2 className="text-2xl font-black leading-tight">15 Dias de<br />Consistência</h2>
              <p className="text-slate-400 text-sm mt-1 font-medium">Faltam apenas 3 dias!</p>
            </div>
          </div>
        </section>

        {/* Today's Suggestion */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black">Sugestão de Hoje</h2>
          <div className="relative rounded-[32px] overflow-hidden group cursor-pointer aspect-video">
             <img 
               src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               alt="Core Workout"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="flex gap-2 mb-3">
                  <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">HIIT</span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">30 MIN</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Explosão de Core</h3>
                <p className="text-slate-300 text-sm font-medium">Focado em estabilidade e força abdominal</p>
             </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50">
        <NavBtn icon={<Home className="w-6 h-6" />} label="Home" active />
        <NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Training" />
        <NavBtn icon={<Utensils className="w-6 h-6" />} label="Nutrition" />
        <NavBtn icon={<TrendingUp className="w-6 h-6" />} label="Progress" />
        <NavBtn icon={<User className="w-6 h-6" />} label="Profile" />
      </nav>
    </div>
  );
}

function NavBtn({ icon, label, active = false }: any) {
  return (
    <button className={cn(
      "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
      active ? "text-primary" : "text-slate-400"
    )}>
      <div className={cn("p-2 rounded-xl", active && "bg-primary/5")}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ZapIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
    </svg>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M18 2H6v7a6 6 0 0 0 12 0V2zM10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M4 22h16" />
    </svg>
  );
}
