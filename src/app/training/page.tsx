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
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Repeat,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrainingPage() {
  const [sets, setSets] = useState([
    { id: 1, weight: 105, reps: 12, completed: true, previous: "100kg x 12" },
    { id: 2, weight: 105, reps: 12, completed: false },
    { id: 3, weight: 0, reps: 0, upcoming: true },
  ]);

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <DumbbellIcon className="w-6 h-6 text-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Alter</span>
        </div>
        <div className="flex items-center gap-3">
           <Bell className="w-6 h-6 text-slate-400" />
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary">JD</div>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Workout Info */}
        <div className="flex justify-between items-end">
          <h1 className="text-3xl font-black">Leg Day Hypertrophy</h1>
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-1">4 / 8 Exercises</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/2 rounded-full"></div>
        </div>

        {/* Current Exercise Card */}
        <div className="relative rounded-[40px] overflow-hidden group aspect-[4/3] shadow-xl">
           <img 
             src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" 
             className="w-full h-full object-cover" 
             alt="Barbell Squats"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white cursor-pointer hover:bg-white/40 transition-all">
                <Repeat className="w-6 h-6" />
              </div>
              <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-3">Current Move</span>
              <h2 className="text-4xl font-black text-white">Barbell Squats</h2>
           </div>
        </div>

        {/* Targets */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-6 rounded-[32px] border border-slate-100 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Target Reps</span>
              <span className="text-5xl font-black text-primary">12</span>
           </div>
           <div className="bg-white p-6 rounded-[32px] border border-slate-100 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Weight (KG)</span>
              <span className="text-5xl font-black text-[#191c1e]">105</span>
           </div>
        </div>

        {/* Sets List */}
        <div className="space-y-4">
           {sets.map((set, i) => (
             <div 
               key={set.id} 
               className={cn(
                 "p-6 rounded-[32px] border-2 transition-all flex items-center justify-between",
                 set.completed ? "bg-white border-primary/20" : "bg-slate-50 border-dashed border-slate-200 opacity-60",
                 set.upcoming && "opacity-30 border-none bg-slate-100"
               )}
             >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg",
                    set.completed ? "bg-primary text-white" : "border-2 border-slate-300 text-slate-400"
                  )}>
                    {set.id}
                  </div>
                  <div>
                    {set.upcoming ? (
                      <span className="font-black text-slate-400 uppercase tracking-widest italic">Upcoming Set</span>
                    ) : (
                      <>
                        <h4 className="font-black text-lg">{set.weight}kg x {set.reps} reps</h4>
                        {set.previous && <p className="text-xs font-bold text-slate-400">Previous: {set.previous}</p>}
                        {!set.completed && <p className="text-xs font-bold text-slate-400 mt-1 italic">Tap to edit reps/weight</p>}
                      </>
                    )}
                  </div>
                </div>
                {set.completed && <CheckCircle2 className="w-8 h-8 text-primary" />}
                {!set.completed && !set.upcoming && (
                  <button className="bg-primary text-white font-black text-xs px-6 py-2 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                    LOG SET
                  </button>
                )}
             </div>
           ))}
        </div>

        {/* Rest Timer Card */}
        <div className="bg-[#191c1e] p-8 rounded-[32px] text-white flex items-center justify-between">
           <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rest Timer</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">01:14</span>
                <span className="text-xl font-bold text-slate-400">/ 02:00</span>
              </div>
              <div className="flex gap-3 pt-2">
                 <button className="bg-white/10 px-4 py-2 rounded-xl text-xs font-black hover:bg-white/20 transition-all">+15s</button>
                 <button className="bg-white/10 px-4 py-2 rounded-xl text-xs font-black hover:bg-white/20 transition-all">Skip</button>
              </div>
           </div>
           <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#ffffff10" strokeWidth="8" fill="transparent" />
                <circle cx="48" cy="48" r="40" stroke="#7c3aed" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Timer className="w-8 h-8 text-primary" />
              </div>
           </div>
        </div>

        {/* Finish Exercise Button */}
        <button className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xl tracking-wider mt-8">
          Concluir Exercício
          <ArrowRight className="w-6 h-6" />
        </button>
      </main>

      {/* Bottom Navigation (Reusable) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50">
        <NavBtn icon={<Home className="w-6 h-6" />} label="Home" />
        <NavBtn icon={<Dumbbell className="w-6 h-6" />} label="Training" active />
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

function DumbbellIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3M18 12h3M7 7h10M7 17h10M5 7v10M19 7v10" />
    </svg>
  );
}
