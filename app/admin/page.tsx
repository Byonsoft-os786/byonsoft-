import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../lib/db"; 
import { users } from "../../lib/schema"; 
import { eq, desc } from "drizzle-orm";
import { approvePayment, rejectPayment } from "../actions";
import { 
  Shield, Users, CreditCard, Check, X, Eye, 
  TrendingUp, Gift, Tag, Trophy, LogOut, ExternalLink
} from "lucide-react";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  // 1. Security check
  if (!userId) redirect("/login");
  const adminData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  if (!adminData[0] || adminData[0].role !== 'admin') redirect("/dashboard");

  // 2. Fetch Data
  const allUsers = await db.select().from(users).orderBy(desc(users.created_at));
  const pendingPayments = allUsers.filter(u => u.payment_status === 'pending');
  const activeSubscribers = allUsers.filter(u => u.is_premium === true);

  // 3. Handlers (Server Actions)
  async function handleApprove(id: number) {
    "use server";
    await approvePayment(id);
  }

  async function handleReject(id: number) {
    "use server";
    await rejectPayment(id);
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 md:p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/5 blur-[120px] rounded-full -z-10" />

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">SUPER <span className="text-red-500">ADMIN</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System Command Center
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Exit Terminal</Link>
          <div className="h-8 w-px bg-white/10" />
          <p className="text-sm font-bold text-red-500">Admin: {adminData[0].name}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-10">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Network", value: allUsers.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Pending Vault", value: pendingPayments.length, icon: CreditCard, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { label: "Premium Fleet", value: activeSubscribers.length, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
            { label: "Giveaway Target", value: "300", icon: Trophy, color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[28px] backdrop-blur-md flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-black text-white leading-none mb-1">{stat.value}</p>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PAYMENT APPROVAL TABLE */}
        <section className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
            <h2 className="text-xl font-black flex items-center gap-3">
              <CreditCard className="text-yellow-400" /> Payment Requests
            </h2>
            <div className="px-4 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-xs font-black">
              {pendingPayments.length} PENDING
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] bg-black/20">
                  <th className="p-6">User / Identity</th>
                  <th className="p-6">Transaction ID</th>
                  <th className="p-6">Proof of Work</th>
                  <th className="p-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPayments.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </td>
                    <td className="p-6">
                      <div className="px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg inline-block font-mono text-xs text-yellow-400 tracking-tighter">
                        {u.tid || 'NO_TID'}
                      </div>
                    </td>
                    <td className="p-6">
                      {u.screenshot ? (
                        <a href={u.screenshot} target="_blank" className="relative block w-20 h-12 rounded-xl border border-white/10 overflow-hidden group/img">
                          <img src={u.screenshot} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" alt="Proof" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </a>
                      ) : <span className="text-gray-700 text-xs italic">Missing Proof</span>}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-3">
                        <form action={handleApprove.bind(null, u.id)}>
                          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-green-900/20">
                            <Check className="w-3 h-3" /> APPROVE
                          </button>
                        </form>
                        <form action={handleReject.bind(null, u.id)}>
                          <button type="submit" className="bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white text-[10px] font-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-white/10 hover:border-red-600">
                            <X className="w-3 h-3" /> REJECT
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <CheckCircle className="w-12 h-12 mb-4" />
                        <p className="text-xl font-bold uppercase tracking-widest">All Clear, Commander.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Tag className="text-blue-500" /> Master Coupon System
            </h3>
            <div className="flex gap-3">
              <input type="text" placeholder="CODE: BYON500" className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all uppercase font-bold tracking-widest" />
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 rounded-2xl transition-all shadow-lg shadow-blue-900/20">GENERATE</button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <Trophy className="text-purple-500" /> Milestone Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span className="text-gray-500">Phase 1: 300 Members</span>
                <span className="text-purple-500">{activeSubscribers.length} / 300</span>
              </div>
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                  style={{ width: `${Math.min(100, (activeSubscribers.length / 300) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// Helper Link component
import Link from "next/link";
