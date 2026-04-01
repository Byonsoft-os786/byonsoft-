import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../lib/db"; 
import { users } from "../../lib/schema"; 
import { eq } from "drizzle-orm";
import { User, Mail, CreditCard, ArrowLeft, Zap, Shield } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;
  if (!userId) redirect("/login");

  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];

  if (!user) redirect("/login");

  const isPremium = user.is_premium || user.subscription_status;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-black text-sm uppercase tracking-widest text-white">Client Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pt-10">
        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="w-24 h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(250,204,21,0.15)] relative">
              <User className="w-10 h-10 text-yellow-400" />
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black text-white mb-2">{user.name}</h2>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 text-sm mb-6">
                <Mail className="w-4 h-4 text-yellow-400" /> {user.email}
              </p>
              
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg border ${isPremium ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-white/5 text-gray-500 border-white/10"}`}>
                  {isPremium ? "Premium Account Active" : "Free Account"}
                </span>
                {!isPremium && (
                  <Link href="/payment" className="bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Upgrade
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-white mb-6">
            <CreditCard className="w-5 h-5 text-yellow-400" /> System Status
          </h2>
          <div className="p-10 text-center border border-white/5 bg-black/40 rounded-2xl">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Payment Verification: {user.payment_status}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
