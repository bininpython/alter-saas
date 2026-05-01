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
  Settings,
  LogOut,
  Shield,
  MessageSquare,
  CreditCard,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const MENU_ITEMS = [
    { icon: <Settings className="w-5 h-5" />, label: "Configurações", href: "#" },
    { icon: <Shield className="w-5 h-5" />, label: "Privacidade", href: "#" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Suporte WhatsApp", href: "#" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Assinatura", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-24 text-[#191c1e]">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <User className="w-6 h-6 text-primary" />
           <span className="text-2xl font-black italic uppercase tracking-tighter text-primary">Perfil</span>
        </div>
        <Bell className="w-6 h-6 text-slate-400" />
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Profile Info Card */}
        <section className="bg-gradient-to-br from-primary to-purple-700 p-8 rounded-[32px] text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-black backdrop-blur-sm">
            JD
          </div>
          <h2 className="text-2xl font-black mb-1">João da Silva</h2>
          <p className="text-white/70 font-medium">joao@exemplo.com</p>
          <div className="mt-4 inline-flex bg-white/10 px-4 py-2 rounded-full text-sm font-black backdrop-blur-sm">
            Plano Premium
          </div>
        </section>

        {/* Menu Items */}
        <section className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
          {MENU_ITEMS.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              className="flex items-center justify-between p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600">
                  {item.icon}
                </div>
                <span className="font-bold">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          ))}
        </section>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 p-6 rounded-[32px] font-black hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          Sair da Conta
        </button>
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
        <Link href="/progress" className="flex flex-col items-center gap-1 min-w-[64px] text-slate-400">
          <div className="p-2 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Progresso</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 min-w-[64px] text-primary">
          <div className="p-2 rounded-xl bg-primary/5"><User className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
