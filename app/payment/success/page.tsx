import React from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";

export default function PaymentSuccess() {
  const WA_LINK = "https://wa.me/923124494267?text=Hello,%20I%20have%20just%20paid%20Rs.750%20for%20Byonsoft%20OS.%20Here%20is%20my%20screenshot.";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative font-sans">
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-8 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-3 uppercase">
          Payment <span className="text-green-400">Received!</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8 font-medium px-4">
          Aap ki request system mein add ho chuki hai. Access unlock karne ke liye aakhri step complete karein.
        </p>

        <div className="w-full space-y-4">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-black font-black text-sm px-6 py-4 rounded-2xl uppercase tracking-widest">
            <MessageCircle className="w-5 h-5" /> Send Proof on WhatsApp
          </a>
          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full border border-white/10 hover:border-yellow-400/50 bg-white/5 text-gray-300 font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-2xl">
            Return to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
