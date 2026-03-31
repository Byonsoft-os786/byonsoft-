"use client";
import React, { useEffect, useState } from "react";

export default function LandingPage() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter"><span className="text-yellow-400">BYON</span>SOFT</div>
          <a href="/signup" className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-all">Shuru Karein</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <div className={`transition-all duration-1000 transform ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Mobile se Paisay Kamao</span>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            Sirf Skills Nahi, <br/> <span className="text-yellow-400">Kamai Ka Raasta.</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg mb-10 leading-relaxed">
            Byonsoft Academy mein hum aapko AI ki madad se woh skills sikhate hain jo aapke mobile se hi international clients dhoond kar dein gi.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-md mx-auto">
            <a href="/signup" className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all text-center">Abhi Join Karein</a>
            <button className="border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/5">Courses Dekhein</button>
          </div>
        </div>
      </header>
    </div>
  );
}
