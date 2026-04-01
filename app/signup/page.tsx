"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUpUser } from "../actions";

function SignupFormContent() {
  const searchParams = useSearchParams();
  const recommendedSkill = searchParams.get("skill") || "Not Selected"; // URL se skill pakri

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    setError("");
    
    const result = await signUpUser(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setMessage("Mubarak ho! Account ban gaya. Ab Login karein.");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Account <span className="text-yellow-400">Banayein</span></h1>
        
        {/* User ko dikhaya ke AI ne uske liye kya select kiya hai */}
        {recommendedSkill !== "Not Selected" ? (
          <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
            <p className="text-gray-400 text-xs mb-1">Your AI Selected Path:</p>
            <p className="text-yellow-400 font-bold text-sm">{recommendedSkill}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Aglay 30 din mein apni kamai shuru karein</p>
        )}
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}
      {message && <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-3 rounded-xl mb-4 text-center">{message}</div>}

      <form action={handleSubmit} className="space-y-4">
        {/* Hidden Input jo chupke se Skill bhej dega */}
        <input type="hidden" name="skill" value={recommendedSkill} />

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Poora Naam</label>
          <input type="text" name="name" required placeholder="e.g. Bilal Khan" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm text-white" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
          <input type="email" name="email" required placeholder="name@example.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm text-white" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">WhatsApp Number</label>
          <input type="text" name="whatsapp" required placeholder="03XXXXXXXXX" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm text-white" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
          <input type="password" name="password" required placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm text-white" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] mt-4 disabled:opacity-50">
          {loading ? "Account Ban Raha Hai..." : "Join Academy"}
        </button>
      </form>

      <p className="text-center text-gray-500 text-xs mt-6">
        Pehle se account hai? <Link href="/login" className="text-yellow-400 font-bold hover:underline ml-1">Login Karein</Link>
      </p>
    </div>
  );
}

// Next.js requirement for useSearchParams
export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/10 blur-[100px] rounded-full -z-10"></div>
      <Suspense fallback={<div className="text-yellow-400">Loading Form...</div>}>
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
