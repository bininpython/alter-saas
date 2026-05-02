"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { token, password });
      alert("Senha atualizada com sucesso. Faça login.");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao redefinir senha");
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
          <p className="text-slate-500 font-medium italic">Redefinir senha</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Nova Senha</label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Confirmar Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-premium"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-4 rounded-2xl">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full group">
            {loading ? "Salvando..." : "Salvar senha"}
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
