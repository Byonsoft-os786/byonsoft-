import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../lib/db"; 
import { users, courses } from "../../lib/schema"; 
import { eq, desc } from "drizzle-orm";
import { 
  ShieldCheck, Lock, Play, BookOpen, 
  LogOut, Crown, ExternalLink, AlertTriangle
} from "lucide-react";

export default async function DashboardPage() {
  // 1. Authentication Check
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;
  if (!userId) redirect("/login");

  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];
  if (!user) redirect("/login");

  // 2. Fetch REAL Courses from Database
  const allCourses = await db.select().from(courses).orderBy(desc(courses.created_at));

  // 3. User Status
  const isPremium = user.is_premium || user.subscription_status;
  const isPending = user.payment_status === "pending";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      
      {/* ── TOP NAVIGATION ── */}
      <nav className="bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Crown className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-black tracking-widest text-sm uppercase">Byonsoft OS</h1>
            <p className="text-yellow-500 text-[9px] font-bold tracking-widest uppercase">Member Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">{user.email}</p>
          </div>
          <Link href="/login" className="p-2 bg-white/5 hover:bg-red-600 hover:text-white text-gray-400 rounded-lg transition-colors border border-white/10">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 p-8 rounded-[32px] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Welcome back, <span className="text-yellow-400">{user.name.split(' ')[0]}</span>.</h2>
            <p className="text-gray-400 text-sm">Access your premium skill-building resources below.</p>
          </div>
          
          <div className="shrink-0">
            {isPremium ? (
              <div className="bg-green-500/10 border border-green-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-black text-sm uppercase tracking-widest">Premium Active</p>
                  <p className="text-gray-400 text-[10px]">Full Vault Access Granted</p>
                </div>
              </div>
            ) : isPending ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-black text-sm uppercase tracking-widest">Verification Pending</p>
                  <p className="text-gray-400 text-[10px]">Admin is reviewing your TID</p>
                </div>
              </div>
            ) : (
              <Link href="/upgrade" className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-yellow-900/20">
                <Lock className="w-4 h-4" /> Unlock Premium
              </Link>
            )}
          </div>
        </div>

        {/* THE VAULT (DYNAMIC COURSES) */}
        <div className="mb-8 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-black uppercase tracking-widest">The Vault</h3>
        </div>

        {allCourses.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-[32px] bg-white/[0.02]">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest">Vault is currently empty</p>
            <p className="text-gray-600 text-sm mt-2">Courses added by Admin will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course) => (
              <div key={course.id} className="group bg-white/5 border border-white/10 p-6 rounded-[24px] hover:border-yellow-400/30 transition-all flex flex-col">
                
                {/* Course Header */}
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg">
                    {course.category}
                  </span>
                  {!isPremium && <Lock className="w-5 h-5 text-gray-600" />}
                </div>

                {/* Course Title */}
                <h4 className="font-black text-xl text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                  {course.title}
                </h4>
                <p className="text-gray-500 text-xs mb-8">Premium Masterclass</p>

                {/* Course Action Button */}
                <div className="mt-auto">
                  {isPremium ? (
                    <a 
                      href={`https://drive.google.com/drive/folders/${course.drive_folder_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-yellow-400 text-black hover:bg-yellow-300 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-900/20"
                    >
                      <Play className="w-4 h-4" /> Access Course <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ) : (
                    <button disabled className="w-full py-4 bg-black border border-white/10 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" /> Locked
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
