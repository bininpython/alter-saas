"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      alert("Se esse e-mail existir, você receberá um link de recuperação.");
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao solicitar recuperação");
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
          <p className="text-slate-500 font-medium italic">Recuperar senha</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">E-mail</label>
            <input
              type="email"
              placeholder="atleta@alter.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full group">
            {loading ? "Enviando..." : "Enviar link"}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform ml-2" />
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-slate-500">
            Voltar para <Link href="/login" className="text-primary font-black hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

