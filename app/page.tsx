import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full -z-10"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-2xl font-black tracking-tighter"><span className="text-yellow-400">BYON</span>SOFT</div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link href="/test" className="text-sm font-bold bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/20 transition-all">Start Free</Link>
        </div>
      </nav>

      {/* Hero Section (The Hook) */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs font-bold tracking-wide uppercase">
          🚀 April Target: 100,000 PKR / Month
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          Unlock Your <span className="text-yellow-400">Digital Career</span> with AI.
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Pata nahi kahan se shuru karna hai? Hamara AI aapka test lega aur aapke liye best earning skill aur 30-day roadmap banayega. Bilkul Free.
        </p>

        <Link href="/test" className="inline-block bg-yellow-400 text-black font-black text-lg py-5 px-10 rounded-2xl hover:bg-yellow-300 transition-all shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-95">
          Start Free Skill Test ⚡
        </Link>

        <p className="mt-4 text-xs text-gray-500 font-medium">Takes only 2 minutes • No credit card required</p>

        {/* 3 Simple Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-yellow-400/30 transition-colors">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">1. AI Skill Test</h3>
            <p className="text-sm text-gray-400 leading-relaxed">8 simple sawalon ke jawab dein taake AI aapki personality aur time ke hisaab se best skill select kare.</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-yellow-400/30 transition-colors">
            <div className="text-3xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold mb-2">2. Custom Roadmap</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Aapko 30 din ka step-by-step plan milega ke skill kahan se seekhni hai aur pehla client kaise pakarna hai.</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/30 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2 text-yellow-400">3. Start Earning</h3>
            <p className="text-sm text-gray-300 leading-relaxed">Premium tools, 50+ courses aur 24/7 AI Mentor ke sath apni digital journey shuru karein aur kamayein.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
