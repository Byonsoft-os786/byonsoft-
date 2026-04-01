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
  Settings, Check, X, Trash2, Zap, Play, 
  TrendingUp, Activity, UserPlus, Gift, Eye
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
  const allCourses = await db.select().from(courses).orderBy(desc(courses.created_at));
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.created_at));
  const allPaymentSettings = await db.select().from(payment_settings);

  // 3. Stats Calculation
  const pendingPayments = allUsers.filter(u => u.payment_status === "pending");
  const premiumUsers = allUsers.filter(u => u.is_premium || u.subscription_status);
  const freeUsers = allUsers.filter(u => !u.is_premium && !u.subscription_status);

  // ==========================================
  // 🔴 SERVER ACTIONS
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

  async function toggleRole(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    const currentRole = formData.get("role") as string;
    const newRole = currentRole === "admin" ? "user" : "admin";
    await db.update(users).set({ role: newRole }).where(eq(users.id, id));
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
      
      {/* ── SIDEBAR ── */}
      <aside className="w-full md:w-64 bg-black border-r border-white/10 p-6 flex flex-col gap-2 shrink-0 md:min-h-screen md:sticky md:top-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black tracking-widest text-base uppercase">OS Admin</h1>
            <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase">Level 10 Center</p>
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
      <main className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto relative">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

        {/* ── GLOBAL STATS ROW (Always Visible) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-black">{allUsers.length}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Network</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
              <CreditCard className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-yellow-400">{pendingPayments.length}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Pending Pay</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-black">{premiumUsers.length}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Premium Active</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-black">{allCourses.length}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Vault Items</p>
            </div>
          </div>
        </div>

        {/* 🔴 TAB: APPROVALS */}
        {currentTab === "approvals" && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest text-yellow-400 flex items-center gap-3">
                <CreditCard className="w-6 h-6"/> Payment Approvals
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-black/40 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="p-6">Identity</th>
                    <th className="p-6">TID Reference</th>
                    <th className="p-6">Proof of Work</th>
                    <th className="p-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingPayments.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <p className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">{u.name}</p>
                        <p className="text-gray-500 text-xs">{u.email}</p>
                      </td>
                      <td className="p-6">
                        <div className="px-3 py-1.5 bg-black border border-white/10 rounded-lg inline-block font-mono text-xs text-yellow-400 tracking-tighter">
                          {u.tid || "NO_TID"}
                        </div>
                      </td>
                      <td className="p-6">
                        {u.screenshot ? (
                          <a href={u.screenshot} target="_blank" className="relative block w-20 h-12 rounded-xl border border-white/10 overflow-hidden group/img">
                            <img src={u.screenshot} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" alt="Proof" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </a>
                        ) : <span className="text-gray-700 text-xs italic">Missing</span>}
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          <form action={approvePayment}>
                            <input type="hidden" name="id" value={u.id} />
                            <button className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black px-4 py-2.5 rounded-xl flex items-center gap-1 transition-all shadow-lg shadow-green-900/20">
                              <Check className="w-3 h-3" /> Approve
                            </button>
                          </form>
                          <form action={rejectPayment}>
                            <input type="hidden" name="id" value={u.id} />
                            <button className="bg-white/5 hover:bg-red-600 text-red-400 hover:text-white text-[10px] font-black px-4 py-2.5 rounded-xl flex items-center gap-1 transition-all border border-white/10 hover:border-red-600">
                              <X className="w-3 h-3" /> Reject
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
                          <Check className="w-12 h-12 mb-4 text-green-500" />
                          <p className="text-xl font-black uppercase tracking-widest text-white">All Clear, Commander</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🔴 TAB: USERS NETWORK */}
        {currentTab === "users" && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl">
            <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-widest text-blue-400 flex items-center gap-3"><Users className="w-6 h-6"/> Global Network</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-black/40 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <tr><th className="p-6">Identity</th><th className="p-6">Rank</th><th className="p-6 text-right">Access Control</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.map(u => {
                    const isPrem = u.subscription_status || u.is_premium;
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                          <p className="font-bold text-white text-sm">{u.name} {u.role === 'admin' && <span className="ml-2 text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full">ADMIN</span>}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </td>
                        <td className="p-6">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${isPrem ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                            {isPrem ? 'Premium' : 'Free User'}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          {u.email !== adminData[0].email && (
                            <div className="flex justify-end gap-2">
                              <form action={togglePremium}>
                                <input type="hidden" name="id" value={u.id} />
                                <input type="hidden" name="status" value={String(isPrem)} />
                                <button className={`px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPrem ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}>
                                  {isPrem ? 'Revoke Premium' : 'Grant Premium'}
                                </button>
                              </form>
                              <form action={toggleRole}>
                                <input type="hidden" name="id" value={u.id} />
                                <input type="hidden" name="role" value={u.role || "user"} />
                                <button className="px-4 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                  {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                </button>
                              </form>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🔴 TAB: COURSES / VAULT */}
        {currentTab === "courses" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 p-8 rounded-[32px] backdrop-blur-md">
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3"><BookOpen className="w-6 h-6 text-purple-400"/> Add to Vault</h2>
              <form action={addCourse} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input name="title" placeholder="Course Title (e.g. Canva Mastery)" required className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-400 outline-none text-white font-bold" />
                <input name="category" placeholder="Category (e.g. Design)" required className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-400 outline-none text-white font-bold" />
                <input name="folder_id" placeholder="Google Drive Folder ID" required className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-400 outline-none text-white font-mono" />
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"><Play className="w-4 h-4"/> Publish Course</button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 p-6 rounded-[24px] backdrop-blur-sm flex flex-col justify-between group hover:border-purple-500/50 transition-all">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg mb-4 inline-block">{c.category}</span>
                    <p className="font-black text-xl text-white leading-tight mb-2 group-hover:text-purple-400 transition-colors">{c.title}</p>
                    <p className="text-gray-500 text-xs mb-6 font-mono truncate">ID: {c.drive_folder_id}</p>
                  </div>
                  <form action={deleteCourse} className="mt-auto">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4"/> Remove from Vault
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔴 TAB: COUPONS */}
        {currentTab === "coupons" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 p-8 rounded-[32px] backdrop-blur-md">
              <h2 className="text-xl font-black uppercase tracking-widest text-yellow-400 mb-6 flex items-center gap-3"><Tag className="w-6 h-6"/> Coupon Generator</h2>
              <form action={createCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input name="code" placeholder="CODE: EID500" required className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm uppercase font-black focus:border-yellow-400 outline-none text-yellow-400 tracking-widest" />
                <input name="price" type="number" placeholder="Final Price (e.g. 500)" required className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-yellow-400 outline-none text-white font-bold" />
                <input name="description" placeholder="Tag (e.g. Special Discount)" className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-yellow-400 outline-none text-white" />
                <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-yellow-900/40">Generate Code</button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCoupons.map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 p-6 rounded-[24px] flex items-center justify-between">
                  <div>
                    <p className="font-mono text-2xl font-black text-yellow-400 tracking-widest mb-1">{c.coupon_code}</p>
                    <p className="text-gray-400 text-sm font-bold">Price: <span className="text-white">Rs. {c.custom_price}</span></p>
                    <p className="text-gray-600 text-xs mt-1">{c.description || "System Link"}</p>
                  </div>
                  <form action={deleteCoupon}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="p-3 bg-white/5 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10 hover:border-red-500"><Trash2 className="w-5 h-5"/></button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔴 TAB: SETTINGS (PAYMENTS) */}
        {currentTab === "settings" && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3"><Settings className="w-6 h-6 text-gray-400"/> Receiving Accounts Setup</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {allPaymentSettings.map(p => (
                <form action={updatePaymentSetting} key={p.id} className="bg-black/60 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all" />
                  <input type="hidden" name="id" value={p.id} />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-yellow-400 font-black text-xl uppercase tracking-widest">{p.method_name}</p>
                  </div>
                  <textarea 
                    name="details" 
                    defaultValue={p.account_details || ""} 
                    className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-mono text-gray-300 mb-6 min-h-[120px] focus:border-blue-400 outline-none leading-relaxed"
                    placeholder={`Enter ${p.method_name} Title and Account Number here...`}
                  />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/30">Save Account Details</button>
                </form>
              ))}
              {allPaymentSettings.length === 0 && (
                <div className="col-span-full p-20 text-center border border-white/10 rounded-3xl bg-black/40">
                  <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No payment methods found</p>
                  <p className="text-gray-600 text-xs mt-2">Please insert methods like Easypaisa/Jazzcash directly in Neon SQL database first.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
