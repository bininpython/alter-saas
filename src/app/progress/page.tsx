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
  Trophy,
  Calendar,
  Flame,
  BarChart3,
  ArrowRight
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

const WEIGHT_DATA = [
  { date: "Jan", weight: 85 },
  { date: "Fev", weight: 83.5 },
  { date: "Mar", weight: 82 },
  { date: "Abr", weight: 80.5 },
  { date: "Mai", weight: 78.5 },
];

const ACHIEVEMENTS = [
  { id: 1, title: "7 Dias de Streak", unlocked: true, icon: "🔥" },
  { id: 2, title: "Primeiro Treino", unlocked: true, icon: "💪" },
  { id: 3, title: "10kg Perdidos", unlocked: false, icon: "🏆" },
  { id: 4, title: "30 Dias", unlocked: false, icon: "⭐" },
];

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <TrendingUp className="w-6 h-6 text-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Progresso</span>
        </div>
        <Bell className="w-6 h-6 text-slate-400" />
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard 
            icon={<Flame className="w-6 h-6" />} 
            value="12" 
            label="Dias de Streak" 
            color="text-orange-500" 
            bg="bg-orange-50" 
          />
          <StatCard 
            icon={<Trophy className="w-6 h-6" />} 
            value="24" 
            label="Treinos Feitos" 
            color="text-primary" 
            bg="bg-primary/10" 
          />
          <StatCard 
            icon={<Calendar className="w-6 h-6" />} 
            value="-6.5kg" 
            label="Total Perdido" 
            color="text-emerald-500" 
            bg="bg-emerald-50" 
          />
        </div>

        {/* Weight Chart */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Evolução de Peso</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">78.5kg</span>
                <span className="text-emerald-500 text-sm font-black">-6.5kg</span>
              </div>
            </div>
            <button className="text-primary text-sm font-black">Ver detalhes</button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEIGHT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
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
        <Link href="/dashboard" className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400">
          <div className="p-2 rounded-xl"><Home className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400">
          <div className="p-2 rounded-xl"><Dumbbell className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Treino</span>
        </Link>
        <Link href="/nutrition" className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400">
          <div className="p-2 rounded-xl"><Utensils className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Nutrição</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center gap-1 min-w-[64px] text-primary">
          <div className="p-2 rounded-xl bg-primary/5"><TrendingUp className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Progresso</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400">
          <div className="p-2 rounded-xl"><User className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
        </Link>
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
      <div className="text-2xl font-black mb-1">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}
