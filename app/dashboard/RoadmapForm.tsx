"use client";
import React, { useState } from "react";
import { generateRoadmap } from "../actions";

export default function RoadmapForm() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState("");
  const [error, setError] = useState("");

  // Progress Bars ki State
  const [skillLevel, setSkillLevel] = useState(20);
  const [englishLevel, setEnglishLevel] = useState(40);
  const [dedication, setDedication] = useState(80);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setRoadmap("");

    // Sliders ka data bhi form mein daal rahe hain
    formData.append("skillLevel", skillLevel.toString());
    formData.append("englishLevel", englishLevel.toString());
    formData.append("dedication", dedication.toString());

    const result = await generateRoadmap(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success && result.roadmap) {
      setRoadmap(result.roadmap);
    }
    setLoading(false);
  }

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto">
      
      {!roadmap ? (
        <form action={handleSubmit} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px] backdrop-blur-xl text-left shadow-2xl">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">AI Career Setup ⚡</h2>
            <p className="text-gray-400 text-sm">Apni profile set karein taake AI 100% accurate roadmap banaye.</p>
          </div>

          {/* 3 Progress Bars */}
          <div className="space-y-6 mb-10 p-6 bg-black/40 rounded-2xl border border-white/5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-400">Current Skill Level</span>
                <span className="text-yellow-400">{skillLevel}%</span>
              </div>
              <input type="range" min="0" max="100" value={skillLevel} onChange={(e) => setSkillLevel(Number(e.target.value))} className="w-full accent-yellow-400 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-400">English Communication</span>
                <span className="text-yellow-400">{englishLevel}%</span>
              </div>
              <input type="range" min="0" max="100" value={englishLevel} onChange={(e) => setEnglishLevel(Number(e.target.value))} className="w-full accent-yellow-400 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-gray-400">Dedication (Mehnat)</span>
                <span className="text-yellow-400">{dedication}%</span>
              </div>
              <input type="range" min="0" max="100" value={dedication} onChange={(e) => setDedication(Number(e.target.value))} className="w-full accent-yellow-400 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>

          {/* 4 Killer Questions */}
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">1. Aap ki Main Skill kya hai? (Ya kya seekhna hai?)</label>
              <input type="text" name="q1Skill" required placeholder="e.g. Video Editing, Web Dev, Ya Zero hun" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">2. Sab se bara masla (Struggle) kya aa raha hai?</label>
              <input type="text" name="q2Struggle" required placeholder="e.g. Clients nahi milte, Portfolio nahi hai" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">3. Daily Time?</label>
                <select name="q3Time" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm text-gray-300">
                  <option value="1-2 Hours">1-2 Ghante</option>
                  <option value="3-5 Hours">3-5 Ghante</option>
                  <option value="Full Time">Full Time (8+ Hrs)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">4. Target Clients?</label>
                <select name="q4Market" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-400/50 outline-none transition-all text-sm text-gray-300">
                  <option value="International (Gora)">International (Gore)</option>
                  <option value="Local (Pakistan)">Local (Pakistan)</option>
                  <option value="Both">Dono (Any)</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_20px_rgba(250,204,21,0.2)] disabled:opacity-50 text-lg">
            {loading ? "AI Blueprint Bana Raha Hai ⏳..." : "Generate 100k PKR Blueprint 🚀"}
          </button>
        </form>
      ) : (
        /* AI Ka Result Area */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button onClick={() => setRoadmap("")} className="mb-6 text-sm text-gray-400 hover:text-yellow-400 flex items-center gap-2 transition-colors">
            ← Naya Roadmap Banayein
          </button>
          
          <div className="p-6 md:p-10 bg-gradient-to-br from-yellow-400/5 to-white/5 border border-yellow-400/20 rounded-[32px] text-left backdrop-blur-xl shadow-2xl">
            <div className="prose prose-invert prose-yellow max-w-none text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap">
              {roadmap}
            </div>
          </div>
        </div>
      )}

      {error && <div className="mt-6 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm text-center">{error}</div>}
    </div>
  );
}
