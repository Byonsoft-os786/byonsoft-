import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 🔴 FIX: Yahan ../ ki jagah ../../ lagaya hai taake sahi folder mil jaye
import { db } from "../../lib/db";
import { users } from "../../lib/schema";
import { eq } from "drizzle-orm";
import { logoutUser } from "../actions";

export default async function DashboardPage() {
  // 1. Check karna ke user logged in hai ya nahi
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  // Agar login nahi hai toh wapis Login page par bhej do
  if (!userId) {
    redirect("/login");
  }

  // 2. Database se user ka data (naam) nikalna
  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];

  // Agar account delete ho gaya hai toh bhi bahar nikal do
  if (!user) {
    redirect("/login");
  }

  // Logout ka proper function jo redirect bhi karega
  async function handleLogout() {
    "use server";
    await logoutUser();
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-yellow-500/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      {/* Navbar with working Logout */}
      <nav className="flex justify-between items-center mb-12 border-b border-white/10 pb-4 relative z-10 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter"><span className="text-yellow-400">BYON</span>SOFT</div>
        
        <form action={handleLogout}>
          <button type="submit" className="text-gray-400 font-medium text-sm hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10">
            Logout
          </button>
        </form>
      </nav>

      {/* Dynamic Content Area */}
      <div className="max-w-4xl mx-auto text-center mt-20 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome, <span className="text-yellow-400 capitalize">{user.name}</span>
        </h1>
        <p className="text-gray-400 text-lg">Aap ka AI Roadmap aur Premium Courses yahan aayenge.</p>
        
        <div className="mt-12 p-8 border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-3xl backdrop-blur-sm transform transition-all hover:scale-[1.02] hover:border-yellow-400/40">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">100,000 PKR Target</h2>
          <p className="text-sm text-gray-400">April ka target hit karne ke liye agla step AI Roadmap hoga.</p>
        </div>
      </div>
    </div>
  );
}
