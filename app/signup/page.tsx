"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signUpUser } from "../actions";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    
    // Server action ko call kiya
    const result = await signUpUser(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setMessage("Mubarak ho! Account kamyabi se ban gaya hai.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/10 blur-[100px] rounded-full -z-10"></div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Account <span className="text-yellow-400">Banayein</span></h1>
          <p className="text-gray-400 text-sm">Aglay 30 din mein apni kamai shuru karein</p>
        </div>

        {/* Success aur Error Messages */}
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}
        {message && <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-3 rounded-xl mb-4 text-center">{message}</div>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Poora Naam</label>
            {/* Added name attribute taake backend data pakar sake */}
            <input type="text" name="name" required placeholder="e.g. Bilal Khan" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
            <input type="email" name="email" required placeholder="name@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">WhatsApp Number</label>
            <input type="text" name="whatsapp" required placeholder="03XXXXXXXXX" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
            <input type="password" name="password" required placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] mt-4 disabled:opacity-50">
            {loading ? "Account Ban Raha Hai..." : "Join Academy"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Pehle se account hai? <Link href="/login" className="text-yellow-400 font-bold hover:underline ml-1">Login Karein</Link>
        </p>
      </div>
    </div>
  );
}
