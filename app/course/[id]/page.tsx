"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toEmbedUrl } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft, MessageSquare, Send, X, CheckCircle, BookOpen,
  Loader2, PlayCircle, Brain, Lock
} from "lucide-react";
import type { Course, Lesson, Progress as ProgressType } from "@shared/schema";

interface LessonModule {
  name: string;
  lessons: Lesson[];
}

export default function CourseViewer() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Queries
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: [`/api/courses/${id}/lessons`],
  });

  const { data: progressList = [] } = useQuery<ProgressType[]>({
    queryKey: ["/api/progress"],
  });

  const progress = progressList.find((p) => p.course_id === Number(id));
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  // Set default active lesson
  useEffect(() => {
    if (lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  // Modules Logic
  const modules = useMemo(() => {
    const mods: Record<string, Lesson[]> = {};
    lessons.forEach((l) => {
      const mName = l.module_name || "General Setup";
      if (!mods[mName]) mods[mName] = [];
      mods[mName].push(l);
    });
    return Object.entries(mods).map(([name, less]) => ({ name, lessons: less }));
  }, [lessons]);

  const markCompleted = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/progress/${id}/advance`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({ title: "Progress saved!", description: "You're one step closer to your goal." });
    },
  });

  // AI Mentor
  const askMentor = async () => {
    if (!question.trim()) return;
    setChatLoading(true);
    try {
      const res = await apiRequest("POST", "/api/chat", {
        message: `Context: Course "${course?.title}", Lesson "${activeLesson?.title}". Question: ${question}`,
      });
      const data = await res.json();
      setAnswer(data.response);
    } catch (error: any) {
      toast({ title: "Mentor Offline", description: error.message, variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  // Helper: YouTube or Drive Player Link
  const getPlayerUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.*?)\//) || url.match(/id=(.*?)&/);
      const driveId = match ? match[1] : url;
      return `https://drive.google.com/file/d/${driveId}/preview`;
    }
    return toEmbedUrl(url);
  };

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-[#050505] p-6 space-y-4">
        <Skeleton className="h-10 w-32 bg-white/10" />
        <Skeleton className="h-[50vh] w-full rounded-3xl bg-white/5" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 text-yellow-400 mx-auto opacity-50" />
          <h1 className="text-2xl font-black uppercase tracking-widest">Vault Record Not Found</h1>
          <Button onClick={() => router.push("/dashboard")} className="bg-yellow-400 text-black font-black">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isPremiumLocked = course.is_premium && !user?.subscription_status;
  const progressPct = progress ? Math.min(100, (progress.lessons_completed / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      {/* ── HEADER ── */}
      <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white px-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div>
              <h1 className="font-black text-sm sm:text-base leading-tight truncate max-w-[200px] sm:max-w-md">{course.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className="text-[9px] bg-yellow-400/20 text-yellow-400 border-none uppercase tracking-widest px-1.5 py-0">
                  {course.category}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-xs font-bold text-gray-400">
              <Progress value={progressPct} className="w-24 h-1.5 bg-white/10 [&>div]:bg-green-400" />
              <span className={progress?.is_completed ? "text-green-400" : ""}>{Math.round(progressPct)}%</span>
            </div>
            <Button
              onClick={() => setChatOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 transition-all hidden sm:flex"
            >
              <Brain className="w-4 h-4 mr-2" /> AI Mentor
            </Button>
            {/* Mobile AI Button */}
            <Button onClick={() => setChatOpen(true)} size="icon" className="bg-yellow-400 text-black sm:hidden rounded-xl">
              <Brain className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PLAYER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl relative aspect-video group">
            {isPremiumLocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-4 border border-yellow-400/20">
                  <Lock className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest mb-2 text-center">Premium Vault Locked</h2>
                <p className="text-gray-400 text-sm mb-6 text-center max-w-sm px-4">Upgrade your account to access this highly guarded knowledge base.</p>
                <Button onClick={() => router.push("/dashboard")} className="bg-yellow-400 text-black font-black px-8 py-6 rounded-xl hover:scale-105 transition-transform">
                  Unlock Access
                </Button>
              </div>
            ) : activeLesson ? (
              <iframe
                src={getPlayerUrl(activeLesson.video_url)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                No active node selected
              </div>
            )}
          </div>

          <Card className="bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">{activeLesson?.title || course.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                    {activeLesson?.description || course.description}
                  </p>
                </div>
                {!isPremiumLocked && (
                  <Button
                    onClick={() => markCompleted.mutate()}
                    disabled={markCompleted.isPending || progress?.is_completed}
                    className={`shrink-0 font-black px-6 py-6 rounded-2xl transition-all ${
                      progress?.is_completed
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    }`}
                  >
                    {progress?.is_completed ? (
                      <><CheckCircle className="w-5 h-5 mr-2" /> Verified</>
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: SYLLABUS */}
        <div className="lg:col-span-1">
          <Card className="bg-white/5 border border-white/10 rounded-[32px] h-[calc(100vh-8rem)] sticky top-24 overflow-hidden flex flex-col backdrop-blur-md">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-yellow-400" /> Syllabus
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <Accordion type="multiple" defaultValue={modules.map((m) => m.name)} className="space-y-4">
                {modules.map((module, mIdx) => (
                  <AccordionItem key={mIdx} value={module.name} className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                      {module.name}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-2">
                      {module.lessons.map((lesson, idx) => {
                        const isActive = activeLessonId === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${
                              isActive
                                ? "bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]"
                                : "bg-black/40 border border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <div className="shrink-0">
                              {isActive ? <PlayCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current opacity-50" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm truncate">{lesson.title}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Node {idx + 1}</p>
                            </div>
                          </button>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {modules.length === 0 && (
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center py-10">No modules uploaded yet</p>
                )}
              </Accordion>
            </div>
          </Card>
        </div>
      </div>

      {/* ── AI MENTOR CHAT OVERLAY ── */}
      {chatOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#0a0a0a] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                <Brain className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-sm">AI Mentor</h3>
                <p className="text-[10px] text-green-400 font-bold tracking-widest uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 max-w-[90%] backdrop-blur-md">
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                Hello! I am your AI Mentor. Ask me anything about <strong className="text-yellow-400">"{activeLesson?.title || course.title}"</strong>. If you face any errors, paste the code here!
              </p>
            </div>

            {answer && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl rounded-tl-sm p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-yellow-400" />
                  <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Mentor Analysis</p>
                </div>
                <div className="text-sm text-white leading-relaxed whitespace-pre-wrap font-medium">
                  {answer}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-5 border-t border-white/10 bg-black">
            <Textarea
              placeholder="Type your question here... (Press Enter to send)"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 resize-none rounded-xl text-sm mb-3 focus-visible:ring-yellow-400"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askMentor();
                }
              }}
            />
            <Button
              onClick={askMentor}
              disabled={!question.trim() || chatLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)]"
            >
              {chatLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing Query...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Send to Mentor</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
