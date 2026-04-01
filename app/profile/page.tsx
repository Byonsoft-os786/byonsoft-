"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/UpgradeModal";
import { User, Mail, CreditCard, Clock, CheckCircle, XCircle, ArrowLeft, Zap, Shield } from "lucide-react";
import type { Transaction } from "@shared/schema";

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<any> }> = {
  pending:  { label: "Pending Approval", className: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30", icon: Clock },
  approved: { label: "Approved",         className: "bg-green-400/10 text-green-400 border-green-400/30",   icon: CheckCircle },
  rejected: { label: "Rejected",         className: "bg-red-400/10 text-red-400 border-red-400/30",         icon: XCircle },
};

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* ── HEADER ── */}
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white px-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <h1 className="font-black text-sm sm:text-base uppercase tracking-widest text-white">Client Profile</h1>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pt-10">
        
        {/* User Info Card */}
        <Card className="bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <CardContent className="p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="w-24 h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(250,204,21,0.15)] relative">
              <User className="w-10 h-10 text-yellow-400" />
              {user.subscription_status && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1.5 rounded-full shadow-lg">
                  <Shield className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl font-black text-white mb-2">{user.name}</h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-400 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-yellow-400" /> {user.email}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Badge className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 border ${
                  user.subscription_status 
                    ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" 
                    : "bg-white/5 text-gray-500 border-white/10"
                }`}>
                  {user.subscription_status ? "Premium Account" : "Free Account"}
                </Badge>
                
                {!user.subscription_status && (
                  <Button 
                    onClick={() => setUpgradeOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 transition-all"
                  >
                    <Zap className="w-3 h-3 mr-2" /> Upgrade
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Card */}
        <Card className="bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md">
          <CardHeader className="border-b border-white/10 bg-white/[0.02] p-6">
            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest text-white">
              <CreditCard className="w-5 h-5 text-yellow-400" /> Billing & Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">
                Fetching financial records...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">No Transactions Found</p>
                <p className="text-gray-500 text-xs">You haven't made any payments yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map((tx) => {
                  const sc = statusConfig[tx.status] || statusConfig.pending;
                  const StatusIcon = sc.icon;
                  return (
                    <div key={tx.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${sc.className.split(" ")[0]} ${sc.className.split(" ")[2]}`}>
                            <StatusIcon className="w-6 h-6 currentColor" />
                          </div>
                          <div>
                            <p className="text-white font-black text-sm uppercase tracking-wide">{tx.method}</p>
                            <p className="text-yellow-400 font-mono text-[10px] tracking-widest uppercase mt-0.5">TRX: {tx.trx_id || "AWAITING"}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl font-black text-white">Rs. {tx.amount}</p>
                          <Badge className={`mt-1 text-[10px] font-black uppercase tracking-widest border ${sc.className}`}>
                            {sc.label}
                          </Badge>
                        </div>
                      </div>
                      {tx.created_at && (
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-4">
                          {new Date(tx.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
