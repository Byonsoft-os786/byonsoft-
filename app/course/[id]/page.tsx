import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../../lib/db"; 
import { users, courses } from "../../../lib/schema"; 
import { eq } from "drizzle-orm";
import { ArrowLeft, BookOpen, Brain, PlayCircle, Lock } from "lucide-react";

export default async function CourseViewer({ params, searchParams }: any) {
  const { id } = await params;
  const { lesson } = await searchParams;
  const lessonIndex = parseInt(lesson || "0");

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;
  if (!userId) redirect("/login");

  const userData = await db.select().from(users).where(eq(users.id, parseInt(userId)));
  const user = userData[0];

  const courseData = await db.select().from(courses).where(eq(courses.id, parseInt(id)));
  const course = courseData[0];

  if (!course) redirect("/dashboard");

  const isPremium = user.is_premium || user.subscription_status;
  const isLocked = course.is_premium && !isPremium;

  // Temporary Backup Lessons (Until lessons table is fully populated)
  const courseLessons = [
    { id: 1, title: "Module Introduction", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Core Fundamentals", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Advanced Mastery", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ];
  
  const activeLesson = courseLessons[lessonIndex] || courseLessons[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-black uppercase tracking-widest text-sm">{course.title}</h1>
          </div>
          <Link href="/dashboard" className="bg-yellow-400 text-black font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2">
            <Brain className="w-4 h-4" /> AI Mentor
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid lg:grid-cols-3 gap-6">
        {/* PLAYER AREA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl relative aspect-video">
            {isLocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                <Lock className="w-12 h-12 text-yellow-400 mb-4" />
                <h2 className="text-xl font-black uppercase tracking-widest mb-2">Premium Vault Locked</h2>
                <Link href="/payment" className="bg-yellow-400 text-black font-black px-6 py-3 rounded-xl">Unlock Access</Link>
              </div>
            ) : (
              <iframe src={activeLesson.video_url} className="w-full h-full absolute inset-0" allowFullScreen />
            )}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8">
            <h2 className="text-2xl font-black text-white mb-2">{activeLesson.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* SYLLABUS AREA */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-6 text-gray-400">
              <BookOpen className="w-4 h-4" /> Syllabus Nodes
            </h3>
            <div className="space-y-3">
              {courseLessons.map((l, idx) => (
                <Link 
                  href={`/course/${course.id}?lesson=${idx}`} 
                  key={idx} 
                  className={`block p-4 rounded-2xl border transition-all ${lessonIndex === idx ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400 shadow-inner" : "bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"}`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Node 0{idx + 1}</p>
                  <p className="font-bold text-sm">{l.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
