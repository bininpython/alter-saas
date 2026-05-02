"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/auth/register", { name, email, password, whatsapp });
      
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Conta criada! Mas houve um erro ao entrar automaticamente. Faça login manualmente.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        router.push("/onboarding");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error;
      if (msg === "Usuário já existe") {
        setError("Esse e-mail já possui uma conta. Tente fazer login.");
      } else {
        setError(msg || "Erro ao criar conta. Tente novamente.");
      }
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-4 rounded-2xl"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Nome Completo</label>
            <input
              id="register-name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">E-mail</label>
            <input
              id="register-email"
              type="email"
              placeholder="atleta@alter.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-premium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">WhatsApp (opcional)</label>
            <input
              id="register-whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="input-premium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Senha</label>
            <input
              id="register-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium"
              required
              minLength={8}
            />
            {password.length > 0 && (
              <div className={`flex items-center gap-2 mt-2 ml-4 text-xs font-bold ${password.length >= 8 ? 'text-emerald-500' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {password.length >= 8 ? "Senha forte" : `${8 - password.length} caracteres restantes`}
              </div>
            )}
          </div>

          <button
            id="register-submit"
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
