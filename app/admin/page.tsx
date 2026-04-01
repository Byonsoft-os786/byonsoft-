import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../lib/db"; 
import { users } from "../../lib/schema"; 
import { eq, desc } from "drizzle-orm";
import { Shield, Users, CreditCard, TrendingUp, Check, X, LogOut } from "lucide-react";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;
  if (!userId) redirect("/login");

  const adminData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  if (!adminData[0] || adminData[0].role !== "admin") redirect("/dashboard");

  const allUsers = await db.select().from(users).orderBy(desc(users.created_at));
  const pendingPayments = allUsers.filter(u => u.payment_status === "pending");
  const premiumCount = allUsers.filter(u => u.is_premium || u.subscription_status).length;

  // Inline Server Actions (Zero dependencies)
  async function approvePayment(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await db.update(users).set({ is_premium: true, payment_status: "paid" }).where(eq(users.id, id));
  }

  async function rejectPayment(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await db.update(users).set({ payment_status: "unpaid", tid: null, screenshot: null }).where(eq(users.id, id));
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 pb-20">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest">Command Center</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Level 10 Admin Access</p>
          </div>
        </div>
        <Link href="/dashboard" className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest">
          Exit Terminal
        </Link>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-3xl font-black">{allUsers.length}</p>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Users</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
            <CreditCard className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-3xl font-black">{pendingPayments.length}</p>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Pending Pay</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
            <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-3xl font-black">{premiumCount}</p>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Premium Active</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/[0.02]">
            <h2 className="text-lg font-black uppercase tracking-widest text-yellow-400 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Pending Approvals
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="p-5">User</th>
                  <th className="p-5">TID / Screenshot</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPayments.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-5">
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-yellow-400 font-mono text-xs">{u.tid || "NO_TID"}</p>
                      {u.screenshot && <a href={u.screenshot} target="_blank" className="text-blue-400 text-xs underline mt-1 block">View Proof</a>}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={approvePayment}>
                          <input type="hidden" name="id" value={u.id} />
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Approve</button>
                        </form>
                        <form action={rejectPayment}>
                          <input type="hidden" name="id" value={u.id} />
                          <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-[10px] font-black rounded-lg uppercase tracking-widest">Reject</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr><td colSpan={3} className="p-10 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">No pending requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
