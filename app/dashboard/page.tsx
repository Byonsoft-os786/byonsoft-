import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Database imports
import { db } from "../../lib/db";
import { users } from "../../lib/schema";
import { eq } from "drizzle-orm";
import { logoutUser } from "../actions";

// 🔴 FIX: Yahan AI Form ko Dashboard mein import kar liya
import RoadmapForm from "./RoadmapForm"; 

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];

  if (!user) {
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    await logoutUser();
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-yellow-500/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12 border-b border-white/10 pb-4 relative z-10 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter"><span className="text-yellow-400">BYON</span>SOFT</div>
        
        <form action={handleLogout}>
          <button type="submit" className="text-gray-400 font-medium text-sm hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10">
            Logout
          </button>
        </form>
      </nav>

      {/* Dynamic Content Area */}
      <div className="max-w-4xl mx-auto text-center mt-6 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome, <span className="text-yellow-400 capitalize">{user.name}</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">April ka target: 100,000 PKR. Apni details dalo aur AI se blueprint lo.</p>
        
        {/* 🔴 AI Ka Form Yahan Render Hoga */}
        <RoadmapForm />
        
      </div>
    </div>
  );
}
