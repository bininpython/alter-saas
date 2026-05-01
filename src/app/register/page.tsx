"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", { name, email, password, whatsapp });
      localStorage.setItem("token", res.data.token);
      router.push("/onboarding");
    } catch (error: any) {
      alert(error.response?.data?.error || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100"
          >
            <Zap className="w-10 h-10 text-primary fill-primary" />
          </motion.div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-primary mb-2">Alter</h1>
          <p className="text-slate-500 font-medium italic">Crie sua conta para começar a jornada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Nome Completo</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
            <input
              type="email"
              placeholder="athlete@alter.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">WhatsApp (opcional)</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="input-premium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full group"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform ml-2" />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-slate-500">
            Já tem uma conta? <Link href="/login" className="text-primary font-black hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
