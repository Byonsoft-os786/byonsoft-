import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../lib/db"; 
import { users } from "../../lib/schema"; 
import { eq } from "drizzle-orm";
import { logoutUser } from "../actions";
import {
  BookOpen, Lock, Zap, TrendingUp, Star, Award, ChevronRight,
  Brain, LogOut, CheckCircle, Briefcase, MessageCircle, Trophy, Play
} from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) redirect("/login");

  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];

  if (!user) redirect("/login");

  const isPremium = user.is_premium;
  const userSkill = user.skill || "Digital Skills";

  async function handleLogout() {
    "use server";
    await logoutUser();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* ── HEADER ── */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <BookOpen className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <p className="font-black text-white leading-none text-lg tracking-tight">BYONSOFT <span className="text-yellow-400">OS</span></p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Master Control</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border ${isPremium ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-white/5 text-gray-400 border-white/10"}`}>
              {isPremium ? "👑 Premium Active" : "Free Plan"}
            </span>
            <form action={handleLogout}>
              <button type="submit" className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-bold transition-colors">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 relative z-10">
        
        {/* ── WELCOME BANNER ── */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-[32px] p-8 border border-yellow-500/20 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Welcome back, <span className="text-yellow-400 capitalize">{user.name}</span>!
            </h1>
            <p className="text-gray-400 text-sm">Your AI selected path: <strong className="text-white">{userSkill}</strong>. Let's hit that 100K target.</p>
          </div>
          {!isPremium && (
            <Link href="/payment" className="shrink-0 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:scale-105 active:scale-95">
              <Zap className="w-5 h-5" /> Upgrade Plan
            </Link>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Giveaway Tracker Card */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-white/5 border border-yellow-400/30 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center shrink-0 border border-yellow-400/20 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">Rs. 35,000</p>
                <p className="text-yellow-400 text-xs font-bold">Phase 1 Giveaway</p>
              </div>
            </div>
          </div>

          {/* AI Assessment Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4 hover:border-yellow-400/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white">Completed</p>
              <p className="text-gray-400 text-xs font-medium">AI Skill Assessment</p>
            </div>
          </div>

          {/* AI Mentor Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4 hover:border-yellow-400/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{isPremium ? "24/7 Access" : "Locked"}</p>
              <p className="text-gray-400 text-xs font-medium">AI Mentor Status</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN (Roadmap & Client Guide) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Career Roadmap */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black text-white">Your Action Plan</h2>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <div className="space-y-6">
                  <div className="p-5 border border-white/10 rounded-2xl bg-black/40">
                    <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Step 1: Skill Setup</h3>
                    <p className="text-gray-400 text-sm">Apni '{userSkill}' ki basic portfolio tayyar karein. Rozana 2 ghante practice laazmi hai.</p>
                  </div>
                  <div className="p-5 border border-white/10 rounded-2xl bg-black/40">
                    <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Step 2: Social Presence</h3>
                    <p className="text-gray-400 text-sm">LinkedIn aur Facebook groups par apna profile optimize karein taake log aapko pehchanein.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* First Client Guide (BLUR HOOK) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black text-white">How to Get Your First Client</h2>
              </div>
              
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5 p-8">
                <div className={`space-y-6 transition-all duration-500 ${!isPremium ? "blur-[8px] opacity-40 select-none pointer-events-none" : ""}`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-black shrink-0">01</div>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">Cold Outreach Script</p>
                      <p className="text-gray-400 text-sm leading-relaxed">Ek simple message: "Hi [Name], maine aapki website dekhi aur notice kiya ke... Main aapki conversion improve kar sakta hoon."</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-black shrink-0">02</div>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">Facebook Group Strategy</p>
                      <p className="text-gray-400 text-sm leading-relaxed">Niche specific groups join karein. Value provide karein aur jab trust ban jaye toh apni services pitch karein.</p>
                    </div>
                  </div>
                </div>

                {!isPremium && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                    <Lock className="w-12 h-12 text-yellow-400 mb-4" />
                    <p className="text-white font-black text-2xl mb-2 shadow-black drop-shadow-lg">Strategy Locked</p>
                    <p className="text-gray-300 text-sm mb-6 max-w-sm text-center drop-shadow-md">Unlock full client acquisition strategy and 50+ courses with Premium.</p>
                    <Link href="/payment" className="bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                      Unlock Full Plan
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (Courses & Tools) ── */}
          <div className="space-y-8">
            
            {/* AI Mentor Access */}
            <div className="bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-400/30 rounded-[32px] p-8 relative overflow-hidden">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Brain className="text-yellow-400" /> AI Mentor</h2>
              {!isPremium ? (
                 <>
                   <p className="text-gray-400 text-sm mb-6">Aapka trial khatam ho gaya hai. AI se guidance ke liye Premium join karein.</p>
                   <Link href="/payment" className="flex justify-center w-full bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                     <Lock className="w-4 h-4 mr-2 mt-0.5" /> Unlock Mentor
                   </Link>
                 </>
              ) : (
                 <>
                   <p className="text-gray-400 text-sm mb-6">Your 24/7 AI Mentor is ready to solve your problems.</p>
                   <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                     Start Chat
                   </button>
                 </>
              )}
            </div>

            {/* Courses Vault */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black flex items-center gap-2"><Play className="text-yellow-400" /> Premium Courses</h2>
              </div>
              
              <div className="space-y-3">
                {["Freelancing Masterclass", "Shopify Dropshipping", "AI Tools Mastery", "Digital Marketing"].map((course, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-yellow-400/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-yellow-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{course}</span>
                    </div>
                    {!isPremium ? <Lock className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-yellow-400" />}
                  </div>
                ))}
              </div>

              {!isPremium && (
                <Link href="/payment" className="block text-center w-full mt-6 text-sm font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-4">
                  Unlock All 50+ Courses
                </Link>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
