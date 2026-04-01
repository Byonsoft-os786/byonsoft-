import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../lib/db"; 
import { users, courses } from "../../lib/schema"; 
import { eq } from "drizzle-orm";
import { 
  BookOpen, Lock, Zap, TrendingUp, Star, Award, 
  Brain, LogOut, CheckCircle, User, MessageCircle, 
  Trophy, Briefcase, ArrowRight, Download 
} from "lucide-react";

export default async function DashboardPage() {
  // 1. Authentication (Native Next.js)
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) redirect("/login");

  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];

  if (!user) redirect("/login");

  // 2. Fetch Data
  const allCourses = await db.select().from(courses);
  const isPremium = user.subscription_status || user.is_premium;
  const userSkill = user.skill || "Digital Skills";
  const price = 750;

  // Logout Action
  async function handleLogout() {
    "use server";
    const cookiesObj = await cookies();
    cookiesObj.delete("user_session");
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black pb-20">
      {/* ── HEADER ── */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <BookOpen className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <p className="font-black tracking-tight text-white leading-none">BYONSOFT <span className="text-yellow-400">OS</span></p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Master Database</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${isPremium ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-white/5 text-gray-400 border-white/10"}`}>
              {isPremium ? "Premium Active" : "Free Account"}
            </span>
            <a
              href="https://wa.me/923124494267?text=Hi%20Byonsoft%20Support!"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-yellow-400 hover:text-black text-gray-300 font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link href="/profile" className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10">
              <User className="w-4 h-4" />
            </Link>
            <form action={handleLogout}>
              <button type="submit" className="p-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 rounded-xl border border-white/10">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* ── WELCOME BANNER ── */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-[32px] p-8 border border-yellow-500/20 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Welcome back, <span className="text-yellow-400">{user.name}</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Continue your journey to 100K PKR. Your skill path: <strong className="text-white">{userSkill}</strong></p>
          </div>
          {!isPremium && (
            <Link href="/payment" className="shrink-0 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95">
              <Zap className="w-5 h-5" /> Upgrade Rs. {price}/mo
            </Link>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-500/10 to-black border border-yellow-500/30 rounded-[24px] p-5 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-lg font-black text-yellow-400 leading-tight">Rs. 35,000</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 mt-1">Phase 1 Giveaway</p>
              </div>
            </div>
          </div>

          {[
            { label: "AI Assessment", value: "Done", icon: Star, color: "text-green-400" },
            { label: "Active Courses", value: allCourses.length, icon: BookOpen, color: "text-blue-400" },
            { label: "AI Mentor", value: isPremium ? "Active" : "Locked", icon: Brain, color: isPremium ? "text-purple-400" : "text-gray-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[24px] p-5 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FIRST CLIENT GUIDE ── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">How to Get Your First Client</h2>
          </div>
          <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5 p-4 md:p-8 backdrop-blur-md">
            <div className={`space-y-6 transition-all duration-500 ${!isPremium ? "blur-[8px] opacity-40 select-none pointer-events-none" : ""}`}>
              {[
                { step: "01", title: "Build Your Arsenal", body: "Create a simple portfolio with 2-3 sample projects. Social proof is your strongest weapon." },
                { step: "02", title: "Local Market Domination", body: "Offer free audits to local businesses. Show them the flaws in their digital presence and pitch the fix." },
                { step: "03", title: "The Cold Script", body: "\"Hi [Name], I noticed [Issue]. I specialize in [Skill] and can fix this for you. Open to a 5-min chat?\"" },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 text-yellow-400 text-sm font-black font-mono">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <p className="text-white font-bold text-lg mb-1">{item.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {!isPremium && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm z-10 rounded-[32px]">
                <Lock className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-lg" />
                <p className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-md">Strategy Locked</p>
                <p className="text-gray-300 text-sm font-medium mb-4 drop-shadow-md text-center px-4">Unlock the complete client acquisition blueprint with Premium.</p>
                <Link href="/payment" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-4 rounded-2xl text-base shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 transition-all">
                  Unlock Access (Rs. {price})
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── THE VAULT (COURSES) ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              The Vault
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course) => {
              const isLocked = !isPremium && course.is_premium;

              return (
                <div
                  key={course.id}
                  className={`relative group backdrop-blur-md rounded-[24px] overflow-hidden transition-all duration-300 border flex flex-col
                    ${isLocked
                      ? "bg-white/5 border-white/5 opacity-80"
                      : "bg-white/5 border-white/10 hover:border-yellow-400/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(250,204,21,0.05)] cursor-pointer"
                    }
                  `}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg">
                        {course.category}
                      </span>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-black text-lg text-white mb-2 leading-snug group-hover:text-yellow-400 transition-colors">{course.title}</h3>
                    <p className="text-gray-400 text-xs mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                    <div className="mt-auto pt-4">
                      {isLocked ? (
                        <Link href="/payment" className="flex items-center justify-center w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold py-3 rounded-xl text-xs transition-all">
                          <Lock className="w-4 h-4 mr-2" /> Unlock to Watch
                        </Link>
                      ) : (
                        <Link href={`/course/${course.id}`} className="flex items-center justify-center w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs shadow-[0_0_15px_rgba(250,204,21,0.2)] transition-all">
                          Start Learning
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {allCourses.length === 0 && (
              <div className="col-span-full p-10 text-center border border-white/10 rounded-[32px] bg-white/5">
                <p className="text-gray-500 font-bold uppercase tracking-widest">No courses available yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
