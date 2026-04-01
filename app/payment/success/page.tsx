"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/923124494267?text=Hello,%20I%20have%20just%20paid%20Rs.750%20for%20Byonsoft%20OS.%20Here%20is%20my%20screenshot.";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* 🔴 Ambient Elite Glow Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute -top-24 -right-24 w-[350px] h-[350px] rounded-full bg-yellow-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center animate-in slide-in-from-bottom-8 duration-700 ease-out">
        
        {/* Animated Check Icon */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-green-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            <CheckCircle className="w-12 h-12 text-black" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-3 uppercase">
          Payment <span className="text-green-400">Received!</span>
        </h1>
        
        <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed px-4">
          Aap ki request system mein add ho chuki hai. Access unlock karne ke liye aakhri step complete karein.
        </p>

        <div className="w-full space-y-4">
          {/* WhatsApp Primary Action */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-black font-black text-sm px-6 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>Send Proof on WhatsApp</span>
            <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
          </a>

          <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-6">
            ⚠️ Send screenshot for 5-minute fast activation
          </p>

          {/* Secondary Action */}
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center justify-center gap-2 w-full border border-white/10 hover:border-yellow-400/50 bg-white/5 text-gray-300 hover:text-yellow-400 font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all duration-200"
          >
            Return to Dashboard
            <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </button>
        </div>

        {/* Bottom reassurance */}
        <div className="mt-10 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-green-500" /> Secure Process
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-green-500" /> Fast Verification
          </span>
        </div>
      </div>
    </div>
  );
}
