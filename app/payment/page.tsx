"use client";
import React, { useState } from "react";
import { submitPayment } from "../actions";
import Link from "next/link";

export default function PaymentPage() {
  const [method, setMethod] = useState("easypaisa");
  const [coupon, setCoupon] = useState("");
  const [price, setPrice] = useState(750);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Coupon Logic
  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "BYON500") {
      setPrice(500);
      setError("");
    } else {
      setError("Invalid Coupon Code!");
      setPrice(750);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await submitPayment(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] text-center max-w-lg backdrop-blur-xl">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">Payment Processing!</h2>
          <p className="text-gray-300 mb-6">Aap ki request (TID) receive ho gayi hai. Hamari team verify kar ke 1 se 2 ghante mein aapka account Premium kar degi.</p>
          <Link href="/dashboard" className="inline-block bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-300">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden flex justify-center items-center">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[150px] rounded-full -z-10"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Order Details & Coupon */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-2">Unlock <span className="text-yellow-400">Premium</span></h1>
          <p className="text-gray-400 text-sm mb-8">Full Action Plan + Client Strategy + 50 Premium Courses.</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
              <span>Premium Membership</span>
              <span className="font-bold">Rs. 750</span>
            </div>
            
            {/* Coupon Section */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Coupon Code (e.g., BYON500)" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50 uppercase text-sm"
              />
              <button onClick={handleApplyCoupon} className="bg-white/10 px-6 rounded-xl font-bold hover:bg-white/20 text-sm transition-all border border-white/5">
                Apply
              </button>
            </div>

            <div className="flex justify-between items-center p-4 border-t border-white/10 mt-4">
              <span className="text-lg text-gray-400">Total to Pay</span>
              <span className="text-3xl font-black text-yellow-400">Rs. {price}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Methods & Upload */}
        <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/30 p-8 rounded-[32px] backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
          
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMethod("easypaisa")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${method === "easypaisa" ? "bg-green-500/20 border-green-500 text-green-400" : "bg-black/40 border-white/10"}`}>EasyPaisa</button>
            <button onClick={() => setMethod("jazzcash")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${method === "jazzcash" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-black/40 border-white/10"}`}>JazzCash</button>
            <button onClick={() => setMethod("bank")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${method === "bank" ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-black/40 border-white/10"}`}>Bank</button>
          </div>

          {/* Account Details Box */}
          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 mb-6 text-sm space-y-2">
            {method === "easypaisa" && (
              <>
                <p className="text-gray-400">Easypaisa Account Number:</p>
                <p className="text-2xl font-bold text-white tracking-wider">03XX-XXXXXXX</p>
                <p className="text-gray-400 mt-2">Account Title: <span className="text-white">Bilal Khan</span></p>
              </>
            )}
            {method === "jazzcash" && (
              <>
                <p className="text-gray-400">JazzCash Account Number:</p>
                <p className="text-2xl font-bold text-white tracking-wider">03XX-XXXXXXX</p>
                <p className="text-gray-400 mt-2">Account Title: <span className="text-white">Bilal Khan</span></p>
              </>
            )}
            {method === "bank" && (
              <>
                <p className="text-gray-400">Meezan Bank Account Number:</p>
                <p className="text-xl font-bold text-white tracking-wider">020XXXXXXXXXXX</p>
                <p className="text-gray-400 mt-2">Account Title: <span className="text-white">Byonsoft Academy</span></p>
              </>
            )}
          </div>

          <form action={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl">{error}</div>}
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Transaction ID (TID) / Trx ID <span className="text-red-500">*</span></label>
              <input type="text" name="tid" required placeholder="e.g. 192837465" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-400/50" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2">Upload Screenshot (Optional)</label>
              <input type="file" accept="image/*" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-yellow-400/20 file:text-yellow-400 hover:file:bg-yellow-400/30 text-sm" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl hover:bg-yellow-300 transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(250,204,21,0.2)] mt-4 disabled:opacity-50">
              {loading ? "Verifying..." : "I have sent the payment"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
