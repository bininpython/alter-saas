"use client";

import { motion } from "framer-motion";
import { 
  Dumbbell, 
  ChevronRight,
  Zap,
  Shield,
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-primary/20">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Zap className="w-8 h-8 text-primary fill-primary" />
          <span className="text-3xl font-black tracking-tighter uppercase italic text-primary">Alter</span>
        </motion.div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Entrar</Link>
          <Link href="/register" className="bg-primary text-white font-black px-6 py-2 rounded-full text-sm hover:opacity-90 transition-all">Começar Agora</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-10"
        >
          <Zap className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-primary leading-none mb-6"
        >
          Alter
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium text-slate-500 max-w-xl mb-12"
        >
          Seu Personal Trainer AI. Treinos, dietas e acompanhamento personalizado para você alcançar seus objetivos.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col w-full max-w-sm gap-4"
        >
          <Link href="/register" className="btn-primary w-full group">
            Iniciar Jornada
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          <Feature 
            icon={<Activity className="w-6 h-6" />} 
            title="Acompanhamento em Tempo Real" 
            desc="Cada repetição, cada grama, rastreado e analisado pelo nosso motor de IA de elite." 
          />
          <Feature 
            icon={<Shield className="w-6 h-6" />} 
            title="Baseado em Ciência" 
            desc="Protocolos de treino respaldados por ciência do esporte e dados individuais." 
          />
          <Feature 
            icon={<Dumbbell className="w-6 h-6" />} 
            title="Planos Personalizados" 
            desc="Planos que se adaptam conforme você evolui. Nunca mais pare em um platô." 
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 text-left hover:border-primary/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
