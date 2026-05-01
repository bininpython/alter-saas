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
  Plus,
  ChevronRight,
  Droplets,
  Coffee,
  Apple,
  Steak,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MEALS = [
  { id: 1, name: "Café da Manhã", icon: <Coffee className="w-6 h-6" />, time: "07:00", calories: 450, completed: true, items: ["Ovos mexidos", "Tapioca", "Café preto"] },
  { id: 2, name: "Almoço", icon: <Steak className="w-6 h-6" />, time: "12:30", calories: 650, completed: false, items: ["Frango grelhado", "Arroz integral", "Feijão", "Legumes"] },
  { id: 3, name: "Lanche da Tarde", icon: <Apple className="w-6 h-6" />, time: "16:00", calories: 250, completed: false, items: ["Iogurte natural", "Frutas", "Granola"] },
  { id: 4, name: "Jantar", icon: <Utensils className="w-6 h-6" />, time: "19:30", calories: 500, completed: false, items: ["Peixe", "Batata doce", "Salada verde"] },
];

export default function NutritionPage() {
  const [waterGlasses, setWaterGlasses] = useState(6);
  const totalWater = 8;

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <Utensils className="w-6 h-6 text-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Nutrição</span>
        </div>
        <div className="flex items-center gap-3">
           <Bell className="w-6 h-6 text-slate-400" />
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Resumo Diário */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-[32px] border border-primary/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Resumo Diário</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">1.850</span>
                <span className="text-sm font-bold text-slate-500">/ 2.500 kcal</span>
              </div>
            </div>
            <button className="bg-white p-3 rounded-full shadow-sm">
              <Plus className="w-6 h-6 text-primary" />
            </button>
          </div>
          
          {/* Água */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-slate-700">Água</span>
              </div>
              <span className="text-sm font-black text-slate-500">{waterGlasses}/{totalWater} copos</span>
            </div>
            <div className="flex gap-2">
              {[...Array(totalWater)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterGlasses(i + 1)}
                  className={cn(
                    "flex-1 h-12 rounded-2xl transition-all duration-300",
                    i < waterGlasses ? "bg-blue-500" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Refeições do Dia */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black">Refeições do Dia</h2>
          {MEALS.map((meal) => (
            <div key={meal.id} className="bg-white p-6 rounded-[32px] border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    meal.completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-primary"
                  )}>
                    {meal.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{meal.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{meal.time} · {meal.calories} kcal</p>
                  </div>
                </div>
                {meal.completed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                ) : (
                  <button className="bg-primary text-white px-4 py-2 rounded-xl font-black text-xs hover:opacity-90 transition-all">
                    Marcar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {meal.items.map((item, i) => (
                  <span key={i} className="bg-slate-50 px-3 py-1 rounded-full text-sm text-slate-600 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
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
        <Link href="/nutrition" className="flex flex-col items-center gap-1 min-w-[64px] text-primary">
          <div className="p-2 rounded-xl bg-primary/5"><Utensils className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Nutrição</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400">
          <div className="p-2 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
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
