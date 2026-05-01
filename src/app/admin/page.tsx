"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data.users || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">Admin</h1>
          <Link href="/dashboard" className="text-primary font-black">Voltar</Link>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6">Carregando...</div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-6 gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              <div className="col-span-2">Usuário</div>
              <div className="col-span-2">Email</div>
              <div>Role</div>
              <div>Plano</div>
            </div>
            {users.map((u) => (
              <div key={u.id} className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-slate-100 last:border-0">
                <div className="col-span-2 font-bold">{u.name || "(sem nome)"}</div>
                <div className="col-span-2 text-slate-600">{u.email || "(sem email)"}</div>
                <div className="font-bold">{u.role}</div>
                <div className="font-bold">{u.plan}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

