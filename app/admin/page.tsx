import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "../../lib/db"; 
import { users, courses, coupons, payment_settings } from "../../lib/schema"; 
import { eq, desc } from "drizzle-orm";
import { 
  Shield, Users, CreditCard, BookOpen, Tag, 
  Settings, Check, X, Trash2, Zap, Play 
} from "lucide-react";

export default async function AdminPage({ searchParams }: { searchParams: { tab?: string } }) {
  // 1. Authentication Check
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;
  if (!userId) redirect("/login");

  const adminData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  if (!adminData[0] || adminData[0].role !== "admin") redirect("/dashboard");

  const currentTab = searchParams?.tab || "approvals";

  // 2. Fetch Data
  const allUsers = await db.select().from(users).orderBy(desc(users.created_at));
  const pendingPayments = allUsers.filter(u => u.payment_status === "pending");
  const allCourses = await db.select().from(courses).orderBy(desc(courses.created_at));
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.created_at));
  const allPaymentSettings = await db.select().from(payment_settings);

  // ==========================================
  // 🔴 SERVER ACTIONS (Zero Client JS)
  // ==========================================
  
  async function approvePayment(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await db.update(users).set({ is_premium: true, subscription_status: true, payment_status: "paid" }).where(eq(users.id, id));
    revalidatePath("/admin");
  }

  async function rejectPayment(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await db.update(users).set({ payment_status: "unpaid", tid: null, screenshot: null }).where(eq(users.id, id));
    revalidatePath("/admin");
  }

  async function togglePremium(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    const currentStatus = formData.get("status") === "true";
    await db.update(users).set({ is_premium: !currentStatus, subscription_status: !currentStatus }).where(eq(users.id, id));
    revalidatePath("/admin");
  }

  async function addCourse(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const folderId = formData.get("folder_id") as string;
    const category = formData.get("category") as string || "Premium";
    await db.insert(courses).values({ title, drive_folder_id: folderId, category, is_premium: true });
    revalidatePath("/admin");
  }

  async function deleteCourse(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await db.delete(courses).where(eq(courses.id, id));
    revalidatePath("/admin");
  }

  async function createCoupon(formData: FormData) {
    "use server";
    const code = formData.get("code") as string;
    const price = parseInt(formData.get("price") as string);
    const desc = formData.get("description") as string;
    await db.insert(coupons).values({ coupon_code: code.toUpperCase(), custom_price: price, description: desc });
    revalidatePath("/admin");
  }

  async function deleteCoupon(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath("/admin");
  }

  async function updatePaymentSetting(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    const details = formData.get("details") as string;
    await db.update(payment_settings).set({ account_details: details }).where(eq(payment_settings.id, id));
    revalidatePath("/admin");
  }

  // ==========================================
  // UI RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row">
      
      {/* ── SIDEBAR (Tabs) ── */}
      <aside className="w-full md:w-64 bg-black border-r border-white/10 p-6 flex flex-col gap-2 shrink-0 md:min-h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black tracking-widest text-sm uppercase">OS Admin</h1>
            <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase">Level 10</p>
          </div>
        </div>

        <Link href="?tab=approvals" className={`p-3 rounded-xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all ${currentTab === "approvals" ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
          <CreditCard className="w-4 h-4" /> Approvals
          {pendingPayments.length > 0 && <span className="ml-auto bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingPayments.length}</span>}
        </Link>
        <Link href="?tab=users" className={`p-3 rounded-xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all ${currentTab === "users" ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
          <Users className="w-4 h-4" /> Network
        </Link>
        <Link href="?tab=courses" className={`p-3 rounded-xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all ${currentTab === "courses" ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
          <BookOpen className="w-4 h-4" /> The Vault
        </Link>
        <Link href="?tab=coupons" className={`p-3 rounded-xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all ${currentTab === "coupons" ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
          <Tag className="w-4 h-4" /> Coupons
        </Link>
        <Link href="?tab=settings" className={`p-3 rounded-xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all ${currentTab === "settings" ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
          <Settings className="w-4 h-4" /> Finances
        </Link>
        
        <div className="mt-auto pt-8">
          <Link href="/dashboard" className="p-3 w-full text-center border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest block">
            Exit Terminal
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        
        {/* 🔴 TAB: APPROVALS */}
        {currentTab === "approvals" && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-lg font-black uppercase tracking-widest text-yellow-400 flex items-center gap-2"><CreditCard className="w-5 h-5"/> Pending Approvals</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                <tr><th className="p-5">User</th><th className="p-5">TID / Evidence</th><th className="p-5 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPayments.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-5"><p className="font-bold text-sm">{u.name}</p><p className="text-gray-500 text-xs">{u.email}</p></td>
                    <td className="p-5">
                      <p className="text-yellow-400 font-mono text-xs mb-1">TRX: {u.tid || "N/A"}</p>
                      {u.screenshot && <a href={u.screenshot} target="_blank" className="text-blue-400 text-xs underline">View Proof</a>}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={approvePayment}><input type="hidden" name="id" value={u.id} /><button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black rounded-lg uppercase">Approve</button></form>
                        <form action={rejectPayment}><input type="hidden" name="id" value={u.id} /><button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-[10px] font-black rounded-lg uppercase">Reject</button></form>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && <tr><td colSpan={3} className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest">No pending requests</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔴 TAB: USERS NETWORK */}
        {currentTab === "users" && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between">
              <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400"/> Global Network</h2>
              <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-gray-400">Total: {allUsers.length}</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                <tr><th className="p-5">Identity</th><th className="p-5">Rank</th><th className="p-5 text-right">Access Control</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-5"><p className="font-bold text-sm">{u.name}</p><p className="text-gray-500 text-xs">{u.email}</p></td>
                    <td className="p-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${u.subscription_status ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-400'}`}>
                        {u.subscription_status ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {u.email !== adminData[0].email && (
                        <form action={togglePremium}>
                          <input type="hidden" name="id" value={u.id} />
                          <input type="hidden" name="status" value={String(u.subscription_status)} />
                          <button className={`px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest ${u.subscription_status ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}>
                            {u.subscription_status ? 'Revoke Premium' : 'Grant Premium'}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔴 TAB: COURSES / VAULT */}
        {currentTab === "courses" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
              <h2 className="text-lg font-black uppercase tracking-widest text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-400"/> Add to Vault</h2>
              <form action={addCourse} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="title" placeholder="Course Title (e.g. Canva Mastery)" required className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none" />
                <input name="folder_id" placeholder="Google Drive Folder ID" required className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none" />
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2"><Play className="w-4 h-4"/> Publish Folder</button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allCourses.map(c => (
                <div key={c.id} className="bg-black/40 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{c.title}</p>
                    <p className="text-gray-500 text-xs mt-1">Drive ID: <span className="font-mono text-blue-400">{c.drive_folder_id}</span></p>
                  </div>
                  <form action={deleteCourse}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl"><Trash2 className="w-5 h-5"/></button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔴 TAB: COUPONS */}
        {currentTab === "coupons" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 p-6 rounded-[32px]">
              <h2 className="text-lg font-black uppercase tracking-widest text-yellow-400 mb-4 flex items-center gap-2"><Tag className="w-5 h-5"/> Coupon Generator</h2>
              <form action={createCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input name="code" placeholder="CODE: BYON50" required className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm uppercase font-bold focus:border-yellow-400 outline-none" />
                <input name="price" type="number" placeholder="Discount Price (Rs)" required className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none" />
                <input name="description" placeholder="Tag (e.g. Eid Sale)" className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none" />
                <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl uppercase tracking-widest text-xs">Generate</button>
              </form>
            </div>

            <div className="space-y-3">
              {allCoupons.map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xl font-black text-yellow-400 tracking-widest">{c.coupon_code}</p>
                    <p className="text-gray-400 text-xs mt-1 font-bold">New Price: Rs. <span className="text-white">{c.custom_price}</span> | {c.description || "System Link"}</p>
                  </div>
                  <form action={deleteCoupon}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl"><Trash2 className="w-5 h-5"/></button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔴 TAB: SETTINGS (PAYMENTS) */}
        {currentTab === "settings" && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
            <h2 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400"/> Receiving Accounts</h2>
            <div className="space-y-6">
              {allPaymentSettings.map(p => (
                <form action={updatePaymentSetting} key={p.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                  <input type="hidden" name="id" value={p.id} />
                  <p className="text-yellow-400 font-black uppercase tracking-widest mb-3">{p.method_name}</p>
                  <textarea 
                    name="details" 
                    defaultValue={p.account_details || ""} 
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm font-mono text-white mb-3 min-h-[100px] focus:border-yellow-400 outline-none"
                    placeholder={`Enter ${p.method_name} account details...`}
                  />
                  <button type="submit" className="bg-white/10 hover:bg-white/20 text-white font-black px-6 py-2 rounded-lg text-xs uppercase tracking-widest transition-all">Update Details</button>
                </form>
              ))}
              {allPaymentSettings.length === 0 && (
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center py-10">No payment methods found in database. Create them in Neon SQL.</p>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
