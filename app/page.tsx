import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">
      {/* 🔴 Background Glow Effects - Pulsing and Animated */}
      <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-yellow-500/10 blur-[200px] rounded-full -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full -z-10 animate-pulse-slow delay-1000"></div>

      {/* 🔴 Navbar - Elite Agency Design */}
      <nav className="flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto relative z-10 border-b border-white/5">
        <div className="text-3xl font-black tracking-tighter"><span className="text-yellow-400">BYON</span>SOFT OS</div>
        <div className="space-x-4 flex items-center">
          <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Client Login</Link>
          <Link href="/test" className="text-sm font-black bg-yellow-400 text-black px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.2)]">TAKEOVER YOUR FUTURE (Free Test)</Link>
        </div>
      </nav>

      {/* 🔴 Hero Section - The "Money" Hook */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-40 text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 text-xs font-bold tracking-wide uppercase animate-fade-in-up">
          🚀 LIVE Status: April Target 94% Reached (Limited slots left)
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter animate-fade-in-up delay-100">
          STOP DREAMING.<br />
          START EARNING <span className="text-yellow-400 text-stroke-gold">100K PKR.</span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed animate-fade-in-up delay-200">
          Pakistan's <strong className="text-white">#1 AI Career Architect</strong> creates your personalized path to wealth in 2 minutes. We audit your skills, build your roadmap, and launch your career. Bilkul Free.
        </p>

        {/* 🔴 Animated High-Energy Button */}
        <Link href="/test" className="group relative inline-block bg-yellow-400 text-black font-black text-2xl py-6 px-14 rounded-2xl hover:bg-yellow-300 transition-all shadow-[0_0_60px_rgba(250,204,21,0.4)] hover:shadow-[0_0_80px_rgba(250,204,21,0.6)] hover:scale-[1.03] active:scale-95 animate-fade-in-up delay-300">
          TAKEOVER YOUR FUTURE (Start Free Test)
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 animate-ping"></span>
        </Link>

        <p className="mt-6 text-xs text-gray-600 font-medium animate-fade-in-up delay-400">Applications currently processed: 12,543 (Waitlist may apply)</p>

        {/* 🔴 3 Isometric Premium Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left relative z-10">
          
          {/* Card 1: AI Audit */}
          <div className="group bg-white/5 border border-white/10 p-10 rounded-[32px] backdrop-blur-sm hover:border-yellow-400/40 transition-all hover:scale-[1.02] active:scale-98 animate-fade-in-up delay-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl mb-6 font-black text-stroke-gold text-yellow-400">01</div>
            <h3 className="text-2xl font-black mb-3">THE AI AUDIT</h3>
            <p className="text-base text-gray-400 leading-relaxed">AI OS aapki personality, time aur resources ko audit karta hai aur optimal digital skill select karta hai.</p>
          </div>

          {/* Card 2: Blueprint */}
          <div className="group bg-white/5 border border-white/10 p-10 rounded-[32px] backdrop-blur-sm hover:border-yellow-400/40 transition-all hover:scale-[1.02] active:scale-98 animate-fade-in-up delay-600 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-5xl mb-6 font-black text-stroke-gold text-yellow-400">02</div>
            <h3 className="text-2xl font-black mb-3">30-DAY BLUEPRINT</h3>
            <p className="text-base text-gray-400 leading-relaxed">Harkat-by-harkat roadmap: Kaise seekhna hai, kahan se seekhna hai, aur pehla client kab pakarna hai.</p>
          </div>

          {/* Card 3: Premium Fast Track (Highlighted) */}
          <div className="group bg-gradient-to-br from-yellow-400/15 to-transparent border border-yellow-400/40 p-10 rounded-[32px] backdrop-blur-sm animate-fade-in-up delay-700 overflow-hidden relative shadow-[0_0_30px_rgba(250,204,21,0.1)] hover:shadow-[0_0_50px_rgba(250,204,21,0.2)] hover:scale-[1.02] active:scale-98">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
            <div className="text-5xl mb-6 font-black text-stroke-gold text-yellow-400">03</div>
            <h3 className="text-2xl font-black mb-3 text-yellow-400">FAST TRACK INCOME</h3>
            <p className="text-base text-gray-300 leading-relaxed">Premium tools, 24/7 AI Mentor aur exclusive courses ke sath apni journey launch karein aur 100K complete karein.</p>
          </div>

        </div>
      </div>

      {/* 🔴 Infinite Moving Ticker Band - Social Proof Bomb (FIXED FOR MOBILE) */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent border-t border-yellow-400/30 overflow-hidden z-20 flex items-center">
        {/* Yahan 'whitespace-nowrap' aur 'w-max' lagaya hai taake mobile par line tootay na */}
        <div className="animate-ticker flex whitespace-nowrap gap-10 md:gap-20 text-yellow-400 font-bold text-xs md:text-sm tracking-wide uppercase px-10 w-max">
          <span>● Live applications: 12,543</span>
          <span>● Last Premium upgrade: 2 mins ago</span>
          <span>● April target: 94% REACHED</span>
          <span>● Current user skill trend: Web Dev</span>
          <span>● Slots remaining for April: 14</span>
          <span>● JOIN THE FUTURE OF DIGITAL SUCCESS</span>
          <span>● Live applications: 12,543</span>
          <span>● Last Premium upgrade: 2 mins ago</span>
          <span>● April target: 94% REACHED</span>
        </div>
      </div>

    </div>
  );
}
