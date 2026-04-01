"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    question: "Aap ka April ka Target (Kamai) kitna hai?",
    options: ["50,000 PKR", "100,000 PKR", "200,000+ PKR"],
  },
  {
    question: "Aap daily kitna time de sakte hain?",
    options: ["1-2 Ghante", "3-5 Ghante", "Full Time (8+ Hrs)"],
  },
  {
    question: "Aap kis cheez mein zyada behtar hain?",
    options: ["Creativity aur Design 🎨", "Logic aur Problem Solving 🧠", "Baatcheet aur Sales 💬"],
  },
  {
    question: "Aap ke paas kaam karne ke liye kya available hai?",
    options: ["Sirf Smartphone 📱", "Basic Laptop/PC 💻", "High-End PC 🖥️"],
  },
  {
    question: "Aap ki English Communication ka level kya hai?",
    options: ["Thori bohot aati hai", "Samajh leta hun, bolne mein masla hai", "Fluent (Goro se baat kar sakta hun)"],
  },
  {
    question: "Agar kaam mein koi mushkil aaye toh aap kya karte hain?",
    options: ["Chhor deta hun", "YouTube/Google par search karta hun", "Jab tak hal na ho, laga rehta hun"],
  },
  {
    question: "Aap pehle se koi digital skill jante hain?",
    options: ["Bilkul Zero hun", "Thora bohot idea hai", "Pehle se seekhi hui hai (Clients chahiye)"],
  },
  {
    question: "Aap ko pehli kamai kab tak chahiye?",
    options: ["Agley 7 din mein (Quick Money)", "1 Mahine mein (Sustainable)", "3 Mahine (Long-term Career)"],
  }
];

export default function SkillTestPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState("");

  // AI Analysis Logic
  useEffect(() => {
    if (isAnalyzing) {
      setTimeout(() => {
        // Simple Logic to calculate skill based on Q3 (Index 2) and Q4 (Index 3)
        const interest = answers[2];
        const device = answers[3];
        let recommendedSkill = "Freelance Social Media Management"; // Default

        if (device === "Sirf Smartphone 📱") {
          recommendedSkill = "Canva Design & Social Media (Mobile Friendly)";
        } else if (interest.includes("Creativity")) {
          recommendedSkill = "Video Editing & UI/UX Design";
        } else if (interest.includes("Logic")) {
          recommendedSkill = "Web Development (Next.js / AI Tools)";
        } else if (interest.includes("Baatcheet")) {
          recommendedSkill = "Digital Marketing & Client Closing";
        }

        setResult(recommendedSkill);
        setIsAnalyzing(false);
      }, 3000); // 3 seconds "fake" AI loading timer
    }
  }, [isAnalyzing, answers]);

  const handleOptionSelect = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setIsAnalyzing(true);
    }
  };

  const goToSignup = () => {
    // Result/Skill ko URL parameter ke zariye bhej rahe hain taake agay use kar sakein
    router.push(`/signup?skill=${encodeURIComponent(result)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-xl">
        {!isAnalyzing && !result && (
          <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[32px] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold">
                <span>Sawalat {currentQ + 1} / {questions.length}</span>
                <span className="text-yellow-400">{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-300" 
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white leading-tight">
              {questions[currentQ].question}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {questions[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left p-5 rounded-2xl border border-white/10 bg-black/40 hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all text-gray-200 hover:text-yellow-400 font-medium text-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Analyzing Screen (Fake Loader Hook) */}
        {isAnalyzing && (
          <div className="text-center animate-in fade-in duration-500 py-20">
            <div className="w-20 h-20 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">AI is Processing...</h2>
            <p className="text-gray-400">Aap ke jawabat ke hisaab se best earning skill nikal raha hai...</p>
          </div>
        )}

        {/* Final Result Hook */}
        {result && !isAnalyzing && (
          <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/30 p-8 md:p-12 rounded-[32px] backdrop-blur-xl text-center animate-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(250,204,21,0.15)]">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-6">Test Complete</span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Aap Ke Liye Best Skill Hai:</h2>
            <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-6 bg-black/30 py-4 px-6 rounded-2xl inline-block">
              {result}
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Hum ne aap ka <strong className="text-white">Free AI Roadmap</strong> aur <strong className="text-white">Client Hunting Strategy</strong> tayyar kar li hai. Apni journey abhi shuru karein!
            </p>

            <button 
              onClick={goToSignup}
              className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl hover:bg-yellow-300 transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] active:scale-95 text-lg"
            >
              Unlock My Free Roadmap 🚀
            </button>
            <p className="text-gray-500 text-xs mt-4">100% Free Account Creation</p>
          </div>
        )}
      </div>
    </div>
  );
}
