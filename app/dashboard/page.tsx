import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../../lib/db"; // Aap ke path ke hisaab se (agar error aaye toh '../lib/db' kar lein)
import { users } from "../../../lib/schema"; 
import { eq } from "drizzle-orm";
import { logoutUser } from "../../actions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) redirect("/login");

  // Database se user aur uski status (Premium/Free) nikalna
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
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 relative z-10 max-w-6xl mx-auto">
        <div className="text-2xl font-black tracking-tighter"><span className="text-yellow-400">BYON</span>SOFT</div>
        <div className="flex items-center gap-4">
          {!isPremium && (
            <span className="hidden md:inline-block bg-white/10 text-xs px-3 py-1 rounded-full border border-white/20">Free Plan</span>
          )}
          {isPremium && (
            <span className="bg-yellow-400/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-400/50 font-bold">Premium Member 👑</span>
          )}
          <form action={handleLogout}>
            <button type="submit" className="text-gray-400 text-sm hover:text-red-400 transition-colors">Logout</button>
          </form>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* LEFT COLUMN: User Info & Roadmap */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Welcome Card */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, <span className="text-yellow-400 capitalize">{user.name}</span>!
            </h1>
            <p className="text-gray-400 text-lg">April Target: 100,000 PKR</p>
            
            <div className="mt-6 inline-block bg-black/40 border border-yellow-400/30 px-6 py-3 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Your AI Selected Skill</p>
              <p className="text-xl font-bold text-yellow-400">{userSkill}</p>
            </div>
          </div>

          {/* ROADMAP SECTION WITH BLUR EFFECT */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🗺️ Your Action Plan</h2>
            
            <div className="space-y-4">
              {/* Step 1: Visible */}
              <div className="p-4 border border-white/10 rounded-2xl bg-black/40">
                <h3 className="text-yellow-400 font-bold mb-2">Step 1: Skill Setup</h3>
                <p className="text-gray-400 text-sm">Apni '{userSkill}' ki basic portfolio tayyar karein. Rozana 2 ghante practice laazmi hai.</p>
              </div>

              {/* Step 2: Visible */}
              <div className="p-4 border border-white/10 rounded-2xl bg-black/40">
                <h3 className="text-yellow-400 font-bold mb-2">Step 2: Social Presence</h3>
                <p className="text-gray-400 text-sm">LinkedIn aur Facebook groups par apna profile optimize karein taake log aapko pehchanein.</p>
              </div>

              {/* 🔴 THE BLUR HOOK (Client Strategy) */}
              <div className="relative mt-6 overflow-hidden rounded-2xl">
                {/* Agar premium nahi hai toh blur lagao */}
                <div className={`p-6 border border-yellow-400/30 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-transparent transition-all duration-500 ${!isPremium ? "blur-[6px] opacity-40 select-none pointer-events-none" : ""}`}>
                  <h3 className="text-yellow-400 font-bold mb-2 text-lg">🎯 Step 3: Secret Client Strategy (How to get your first client)</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Goro ko target karne ke liye Cold Email ka yeh script use karein. Pehle hafte mein 50 emails bhejain. Facebook ki premium communities mein 'Value Value Ask' formula lagayen...
                  </p>
                  <p className="text-gray-300 text-sm font-bold">Cold Email Script: "Hi [Name], I noticed your business is struggling with..."</p>
                </div>

                {/* 🔒 Locked Overlay for Free Users */}
                {!isPremium && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 z-10 backdrop-blur-[2px]">
                    <span className="text-4xl mb-3">🔒</span>
                    <h3 className="text-xl font-bold text-white mb-2 shadow-black drop-shadow-lg">Client Strategy Locked</h3>
                    <p className="text-sm text-gray-300 mb-4 px-6 text-center drop-shadow-md">Apna pehla client pakarne ka mukammal rasta dekhein.</p>
                    <Link href="/payment" className="bg-yellow-400 text-black font-black py-3 px-8 rounded-xl hover:bg-yellow-300 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                      Unlock Full Plan (Rs. 750)
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Mentor & Courses */}
        <div className="space-y-6">
          
          {/* AI Mentor Access */}
          <div className="bg-gradient-to-b from-black/60 to-black/40 border border-white/10 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full"></div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">🤖 AI Mentor</h2>
            {!isPremium ? (
               <>
                 <p className="text-gray-400 text-sm mb-4">Aapka 24-hour trial start ho chuka hai. AI se koi bhi masla poochein.</p>
                 <div className="text-yellow-400 text-2xl font-black mb-6 tracking-widest text-center py-3 bg-white/5 rounded-xl border border-white/5">
                   23:59:59 ⏳
                 </div>
                 <button className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                   Start Chatting
                 </button>
               </>
            ) : (
               <>
                 <p className="text-gray-400 text-sm mb-4">Aapke paas 24/7 Unlimited AI Mentor access hai.</p>
                 <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                   Chat Now
                 </button>
               </>
            )}
          </div>

          {/* Premium Courses Vault */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📚 50+ Premium Courses</h2>
            <div className="space-y-3">
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium">Freelancing Masterclass</span>
                {!isPremium ? <span className="text-xs">🔒</span> : <span className="text-xs text-yellow-400">▶️</span>}
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium">Canva Design Pro</span>
                {!isPremium ? <span className="text-xs">🔒</span> : <span className="text-xs text-yellow-400">▶️</span>}
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium">Client Closing Secrets</span>
                {!isPremium ? <span className="text-xs">🔒</span> : <span className="text-xs text-yellow-400">▶️</span>}
              </div>
            </div>
            {!isPremium && (
              <Link href="/payment" className="block text-center w-full mt-4 text-xs font-bold text-yellow-400 hover:text-yellow-300 underline underline-offset-4">
                Unlock All 50+ Courses
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
