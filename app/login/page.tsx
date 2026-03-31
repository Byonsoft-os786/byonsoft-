"use client";
import React, { useState } from "react";
import Link from "next/link";
import { loginUser } from "../actions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const result = await loginUser(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      // Login successful, ab Dashboard par le jao
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-600/10 blur-[100px] rounded-full -z-10"></div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Khush <span className="text-yellow-400">Aamdeed</span></h1>
          <p className="text-gray-400 text-sm">Apne premium account mein login karein</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
            <input type="email" name="email" required placeholder="name@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
            <input type="password" name="password" required placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] mt-4 disabled:opacity-50">
            {loading ? "Checking..." : "Login Karein"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Account nahi hai? <Link href="/signup" className="text-yellow-400 font-bold hover:underline ml-1">Naya Banayein</Link>
        </p>
      </div>
    </div>
  );
}
