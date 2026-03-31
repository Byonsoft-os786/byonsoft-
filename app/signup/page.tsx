"use client";
import React from "react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/10 blur-[100px] rounded-full -z-10"></div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Account <span className="text-yellow-400">Banayein</span></h1>
          <p className="text-gray-400 text-sm">Aglay 30 din mein apni kamai shuru karein</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Poora Naam</label>
            <input type="text" placeholder="e.g. Bilal Khan" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
            <input type="email" placeholder="name@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">WhatsApp Number</label>
            <input type="text" placeholder="03XXXXXXXXX" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <button className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] mt-4">
            Join Academy
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Pehle se account hai? <Link href="/login" className="text-yellow-400 font-bold hover:underline ml-1">Login Karein</Link>
        </p>
      </div>
    </div>
  );
}
