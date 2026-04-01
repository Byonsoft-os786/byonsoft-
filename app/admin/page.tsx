import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../lib/db"; 
import { users } from "../../lib/schema"; 
import { eq, desc, and } from "drizzle-orm";
import { 
  Shield, Users, CreditCard, Check, X, Eye, 
  Trash2, TrendingUp, Gift, Tag, RefreshCw, LogOut 
} from "lucide-react";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  // Security Check: Only Admin can enter
  if (!userId) redirect("/login");
  const adminData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  if (!adminData[0] || adminData[0].role !== 'admin') redirect("/dashboard");

  // Fetching Real-time Stats
  const allUsers = await db.select().from(users);
  const pendingPayments = allUsers.filter(u => u.payment_status === 'pending');
  const activeSubscribers = allUsers.filter(u => u.is_premium === true);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 md:p-8">
      {/* ── HEADER ── */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Super <span className="text-red-500">Admin</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Byonsoft OS Command Center</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-sm font-bold text-gray-300">System Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: allUsers.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Pending Payments", value: pendingPayments.length, icon: CreditCard, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { label: "Active Premium", value: activeSubscribers.length, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
            { label: "Revenue Target", value: "94%", icon: Gift, color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[24px] flex items-center gap-5 hover:border-white/20 transition-all">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── PENDING PAYMENTS TABLE ── */}
        <section className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-md">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-black flex items-center gap-3">
              <CreditCard className="text-yellow-400" /> Pending Approvals
            </h2>
            <span className="bg-yellow-400/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-400/30">
              {pendingPayments.length} Requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                  <th className="p-5 font-bold">User Information</th>
                  <th className="p-5 font-bold">Transaction Details</th>
                  <th className="p-5 font-bold">Screenshot</th>
                  <th className="p-5 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPayments.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-white text-sm">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-yellow-400 font-mono text-sm">{u.tid || 'N/A'}</p>
                      <p className="text-gray-500 text-xs uppercase">Reference ID</p>
                    </td>
                    <td className="p-5">
                      {u.screenshot ? (
                        <div className="relative group w-16 h-10 rounded-lg overflow-hidden border border-white/10 cursor-pointer">
                          <img src={u.screenshot} alt="Payment" className="object-cover w-full h-full" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs italic">No Proof</span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2">
                        {/* 🔴 Logic to Approve Payment using Server Actions */}
                        <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-black px-4 py-2 rounded-lg flex items-center gap-1 transition-all">
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button className="bg-red-600/20 hover:bg-red-600/40 text-red-500 text-xs font-black px-4 py-2 rounded-lg flex items-center gap-1 transition-all">
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500 font-bold italic">
                      Zero pending payments. System is up to date! 🚀
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── QUICK CONTROLS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coupon Management */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px]">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Tag className="text-blue-400" /> Create Master Coupon
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="CODE (e.g. BYON500)" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400/50 uppercase" />
                <input type="number" placeholder="Price (500)" className="w-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400/50" />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg transition-all">
                Generate Coupon Code
              </button>
            </div>
          </div>

          {/* Giveaway Milestone Control */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px]">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-400" /> Milestone Tracking
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                <span>Phase 1 (300 Members)</span>
                <span className="text-yellow-400">{activeSubscribers.length} / 300</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (activeSubscribers.length / 300) * 100)}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs italic">Giveaway triggers automatically once bar reaches 100%.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
