"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  BookOpen, Zap, Gift, Star, ArrowRight, ChevronRight,
  Trophy, Shield, Sparkles, TrendingUp, MessageCircle,
  Brain, Target, Users, Copy, CheckCircle,
  Play, Award, Lock, ChevronDown
} from "lucide-react";

// --- Custom Scroll Reveal Hook ---
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://byonsoft.vercel.app";
const WA_SHARE = `https://wa.me/?text=${encodeURIComponent(`🚀 Test your skills in 30 seconds & win prizes!\n\nJoin Byonsoft — Pakistan's smartest Learn & Earn platform.\n\n👉 ${SITE_URL}/signup`)}`;
const FB_SHARE = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/signup`)}`;
const TW_SHARE = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚀 Take a free 30-second skill test & get AI course recommendations on @Byonsoft!\n\n${SITE_URL}/signup`)}`;

export default function Landing() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Simulated Stats for Giveaway
  const activeUsers = 124; // Dummy live count
  const m1Total = 300;
  const m1Pct = Math.min(100, Math.round((activeUsers / m1Total) * 100));
  const m2Total = 1000;
  const m2Pct = Math.min(100, Math.round((activeUsers / m2Total) * 100));

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(`${SITE_URL}/signup`); }
    catch { /* silent fallback */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-black font-black" />
            </div>
            <span className="font-black text-lg tracking-tight">BYONSOFT <span className="text-yellow-400">OS</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-gray-400 hover:text-white text-sm font-bold transition-colors hidden sm:block"
            >
              How it Works
            </button>
            <Link href="/login" className="text-gray-400 hover:text-white text-sm font-bold transition-colors hidden sm:block">
              Client Login
            </Link>
            <Link
              href="/test"
              className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-black px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:scale-105 active:scale-95"
            >
              Start Free Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-20 pb-28 px-4 overflow-hidden">
        {/* Glow blobs (Yellow/Gold) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-yellow-500/10 blur-[150px]" />
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-yellow-600/10 blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
            </span>
            Pakistan's #1 AI Career Architect
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-6 animate-fade-in-up delay-100">
            Audit Your Skills in{" "}
            <span className="relative inline-block text-yellow-400">
              30 Seconds
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M2 6C50 2 150 2 298 6" stroke="url(#u)" strokeWidth="4" strokeLinecap="round"/>
                <defs><linearGradient id="u" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#FBBF24"/><stop offset="0.5" stopColor="#F59E0B"/><stop offset="1" stopColor="#D97706"/></linearGradient></defs>
              </svg>
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-200">
            Discover your hidden potential and get an <strong className="text-white">AI-built roadmap</strong> to your first 100K PKR — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in-up delay-300">
            <Link
              href="/test"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black text-lg px-8 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-95"
            >
              <Zap className="w-5 h-5" />
              Start Skill Test — It's Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="group flex items-center justify-center gap-2 w-full sm:w-auto border border-white/20 hover:border-yellow-400 text-gray-300 hover:text-yellow-400 font-bold text-lg px-7 py-4 rounded-2xl transition-all"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </button>
          </div>

          {/* Animated quiz visual (Black/Gold) */}
          <div className="relative max-w-md mx-auto animate-fade-in-up delay-400">
            <div className="absolute inset-0 rounded-2xl bg-yellow-500/10 blur-xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500 ml-2 font-bold uppercase">System Audit</span>
                <span className="ml-auto text-xs font-mono text-yellow-400 animate-pulse">⏱ 0:24</span>
              </div>
              <p className="text-white font-bold text-sm mb-4">Aap kis cheez mein zyada behtar hain?</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Logic & Coding", sel: true },
                  { label: "Creativity/Design", sel: false },
                  { label: "Sales & Chat", sel: false },
                  { label: "Writing", sel: false },
                ].map((o) => (
                  <div key={o.label} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${o.sel ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/10 bg-black/40 text-gray-400"}`}>
                    {o.sel && <span className="mr-1">✓</span>}{o.label}
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3.5 flex items-start gap-3">
                <Brain className="w-5 h-5 text-yellow-400 shrink-0" />
                <div>
                  <p className="text-yellow-400 text-xs font-black uppercase">AI Analysis Complete</p>
                  <p className="text-gray-300 text-xs mt-1">Optimal Path: <span className="text-white font-bold">Web Development</span> · 94% Match</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#050505] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">The Roadmap to 100K</h2>
            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">From zero to your personal digital career in under 2 minutes.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-yellow-500/0 via-yellow-500/40 to-yellow-500/0" />

            {[
              { step: "01", icon: Target, label: "Take the Test", desc: "Answer 8 quick psychological and skill-based questions. No signup required." },
              { step: "02", icon: Brain, label: "AI Analyzes You", desc: "Our OS reads your personality and maps you to the most profitable digital skill." },
              { step: "03", icon: Sparkles, label: "Get Your Blueprint", desc: "Unlock a 30-day action plan, secret client strategies, and your AI Mentor." },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 150} className="relative z-10">
                <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center h-full hover:border-yellow-400/40 transition-all backdrop-blur-sm group">
                  <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform border border-yellow-400/20">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <div className="text-6xl font-black opacity-5 absolute top-4 right-6 text-yellow-400">{s.step}</div>
                  <h3 className="text-white font-bold text-2xl mb-3">{s.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY JOIN ─── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-3">Premium Arsenal</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Your Unfair Advantage</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Instant Skill Audit", desc: "Don't guess what to learn. Let AI find your most profitable skill." },
              { icon: BookOpen, title: "50+ Premium Courses", desc: "A massive vault of Urdu/Hindi courses from Freelancing to AI." },
              { icon: Brain, title: "24/7 AI Mentor", desc: "Stuck on an error? AI mentor is ready to help you anytime, anywhere." },
              { icon: TrendingUp, title: "Client Acquisition", desc: "Secret scripts and strategies to land your first international client." },
              { icon: Gift, title: "Cash Giveaways", desc: "Win a share of our 100K PKR giveaway just by being an active member." },
              { icon: Users, title: "Viral Referral System", desc: "Invite friends, build your network, and multiply your chances to win." },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 100}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 h-full flex gap-5 hover:border-yellow-400/30 transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center shrink-0 border border-yellow-500/20">
                    <b.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MILESTONE REWARDS (GIVEAWAY) ─── */}
      <section id="rewards" className="py-24 px-4 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-yellow-500/5 blur-[120px]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase animate-pulse">
              🏆 Real Money Giveaways
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Cash Prizes for Action Takers</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Become a premium member and automatically enter our milestone cash drops.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phase 1 */}
            <Reveal delay={100}>
              <div className="rounded-[32px] border border-yellow-400/40 bg-gradient-to-br from-yellow-500/10 via-[#0a0a0a] to-[#0a0a0a] p-8 shadow-[0_0_40px_rgba(250,204,21,0.1)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-yellow-400 font-black text-xl">Phase 1</p>
                      <p className="text-gray-400 text-sm">First 300 Members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1.5">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" /></span>
                    <span className="text-yellow-400 text-xs font-black tracking-widest uppercase">LIVE</span>
                  </div>
                </div>

                <p className="text-5xl font-black text-white mb-2">35,000 <span className="text-2xl text-yellow-400">PKR</span></p>
                <p className="text-gray-400 text-sm mb-8 font-medium">Total Prize Pool · 3 Winners</p>

                <div className="space-y-3 mb-8">
                  {[
                    { rank: "🥇 1st Place", prize: "Rs. 20,000" },
                    { rank: "🥈 2nd Place", prize: "Rs. 10,000" },
                    { rank: "🥉 3rd Place", prize: "Rs.  5,000" },
                  ].map((w) => (
                    <div key={w.rank} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                      <span className="text-sm font-bold text-gray-300">{w.rank}</span>
                      <span className="text-lg font-black text-yellow-400">{w.prize}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-yellow-400">{activeUsers} / 300 Filled</span>
                  </div>
                  <div className="h-4 rounded-full bg-black border border-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 transition-all duration-1000" style={{ width: `${m1Pct}%` }} />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Phase 2 (Locked) */}
            <Reveal delay={200}>
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Lock className="w-10 h-10 text-gray-500 mb-4" />
                  <p className="text-white font-bold text-xl">Unlocks at 300 Members</p>
                  <p className="text-gray-400 text-sm">Phase 1 must complete first</p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                      <Award className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-black text-xl">Mega Phase</p>
                      <p className="text-gray-500 text-sm">1,000 Members</p>
                    </div>
                  </div>
                </div>
                <p className="text-5xl font-black text-gray-400 mb-2">100,000 <span className="text-2xl">PKR</span></p>
                <div className="space-y-3 mt-8 opacity-50">
                  <div className="bg-white/5 h-12 rounded-xl"></div>
                  <div className="bg-white/5 h-12 rounded-xl"></div>
                  <div className="bg-white/5 h-12 rounded-xl"></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Start Free. Dominate with Premium.</h2>
            <p className="text-gray-400 text-lg">No hidden fees. Full transparency. Upgrade only when you see the value.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Reveal delay={100}>
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 h-full">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Basic Tier</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black text-white">0</span>
                  <span className="text-xl text-yellow-400 font-bold">PKR</span>
                </div>
                <p className="text-gray-500 text-sm mb-8">Forever free to start</p>
                
                <ul className="space-y-4 mb-10">
                  {["Skill Assessment Test", "Basic Career Roadmap", "Dashboard Access"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                      <CheckCircle className="w-5 h-5 text-gray-500" /> {f}
                    </li>
                  ))}
                  {["Unlimited AI Mentor", "Client Hunting Strategies", "50+ Premium Courses", "Giveaway Entries"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-600 line-through">
                      <Lock className="w-4 h-4" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/test" className="flex justify-center w-full border border-white/20 hover:border-yellow-400 text-white hover:text-yellow-400 font-bold py-4 rounded-xl transition-all">
                  Take Free Test
                </Link>
              </div>
            </Reveal>

            {/* Premium Plan */}
            <Reveal delay={200}>
              <div className="rounded-[32px] border border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-transparent p-10 h-full relative shadow-[0_0_50px_rgba(250,204,21,0.15)] transform md:-translate-y-4">
                <div className="absolute top-6 right-6 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full">MOST POPULAR</div>
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">Premium Tier</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black text-white">750</span>
                  <span className="text-xl text-yellow-400 font-bold">PKR</span>
                </div>
                <p className="text-gray-400 text-sm mb-8">One-time payment or monthly. Full access.</p>
                
                <ul className="space-y-4 mb-10">
                  {["Advanced Career Roadmap", "Unlimited 24/7 AI Mentor", "Secret Client Acquisition Strategy", "Access to 50+ HD Courses", "1x Entry to Cash Giveaway", "Viral Referral System (Earn more)"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-white">
                      <CheckCircle className="w-5 h-5 text-yellow-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/payment" className="flex justify-center w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                  Unlock Premium
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/5" />
        <Reveal className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Build Your <br/><span className="text-yellow-400">Digital Empire?</span>
          </h2>
          <p className="text-gray-400 text-xl mb-10">Take the 30-second AI test and get your blueprint to 100K today.</p>
          <Link
            href="/test"
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-black text-xl px-12 py-6 rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(250,204,21,0.4)]"
          >
            <Zap className="w-6 h-6" /> START FREE TEST
          </Link>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/10 bg-[#050505] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-black font-black" />
            </div>
            <p className="text-white font-black text-lg tracking-widest">BYONSOFT <span className="text-yellow-400">OS</span></p>
          </div>
          <div className="text-gray-500 text-sm font-bold">
            © 2026 Byonsoft Academy. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
