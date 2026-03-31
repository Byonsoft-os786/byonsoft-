import React from "react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <nav className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
        <div className="text-xl font-bold"><span className="text-yellow-400">BYON</span>SOFT</div>
        <button className="text-gray-400 text-sm hover:text-white">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to <span className="text-yellow-400">Premium Zone</span></h1>
        <p className="text-gray-400">Aap ka AI Roadmap aur Courses yahan aayenge.</p>
        
        <div className="mt-12 p-8 border border-yellow-400/20 bg-yellow-400/5 rounded-3xl">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">100,000 PKR Target</h2>
          <p className="text-sm text-gray-400">April ka target hit karne ke liye apni pehli masterclass dekhein.</p>
        </div>
      </div>
    </div>
  );
}
