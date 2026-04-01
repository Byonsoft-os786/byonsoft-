"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen, Lock, Zap, TrendingUp, Star, Award, ChevronRight,
  Brain, Activity, LogOut, CheckCircle, Download, User, Phone, FileText, Shield as ShieldIcon,
  ArrowRight, Trophy, Briefcase, DollarSign, ListOrdered, MessageCircle, X as XIcon
} from "lucide-react";
import { MegaLaunchBanner, ReferralCard, ReferralRewards } from "@/components/GiveawayBanner";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import type { Course, Progress as ProgressType, SkillScore } from "@shared/schema";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: progressList = [] } = useQuery<ProgressType[]>({
    queryKey: ["/api/progress"],
  });

  const { data: skillScore } = useQuery<SkillScore | null>({
    queryKey: ["/api/skills"],
  });

  const { data: priceSetting } = useQuery<{ subscription_price: number }>({
    queryKey: ["/api/settings/price"],
  });

  const price = priceSetting?.subscription_price ?? 750;

  const { data: giveawayStats } = useQuery<{ activeUsers: number; nextMilestone: number; prevMilestone: number }>({
    queryKey: ["/api/giveaway/stats"],
    refetchInterval: 60_000,
  });
  
  const premiumCount = giveawayStats?.activeUsers ?? 0;
  const isPhase2 = premiumCount >= 300;
  const hasAssessment = !!(skillScore?.goal);

  const getProgress = (courseId: number) => {
    return progressList.find((p) => p.course_id === courseId);
  };

  // ── SMART COURSE PRIORITY ───────────────────────────────────────────────────
  const roadmapSkills = useMemo(() => {
    const raw: string[] = [];
    if (skillScore?.roadmap_result) {
      try {
        const parsed = JSON.parse(skillScore.roadmap_result);
        if (Array.isArray(parsed.recommended_courses)) raw.push(...parsed.recommended_courses);
        if (Array.isArray(parsed.career_paths)) raw.push(...parsed.career_paths);
      } catch {}
    }
    return raw
      .map((s) => s.trim().toLowerCase())
      .filter((v) => v.length > 0)
      .filter((v, i, a) => a.indexOf(v) === i);
  }, [skillScore]);

  const isTagMatch = useMemo(() => {
    return (course: Course): boolean => {
      if (!roadmapSkills.length) return false;
      const courseTags = (course.tags || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);
      if (!courseTags.length) return false;
      return roadmapSkills.some((skill) =>
        courseTags.some((tag) => tag.includes(skill) || skill.includes(tag))
      );
    };
  }, [roadmapSkills]);

  const sortedCourses = useMemo(() => {
    if (!roadmapSkills.length) return courses;
    const matched = courses.filter((c) => isTagMatch(c));
    const rest = courses.filter((c) => !isTagMatch(c));
    return [...matched, ...rest];
  }, [courses, roadmapSkills, isTagMatch]);

  const hasRoadmapMatches = roadmapSkills.length > 0 && courses.some((c) => isTagMatch(c));

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("byonsoft_token")}` },
      });
      const u = await res.json();
      if (u.id) updateUser(u);
    } catch {}
  };

  const downloadCertificate = (course: Course) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificate - ${course.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #050505; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .cert { width: 900px; min-height: 640px; background: linear-gradient(135deg, #111 0%, #050505 50%, #111 100%); border: 3px solid #facc15; border-radius: 24px; padding: 60px 80px; text-align: center; color: white; position: relative; box-shadow: 0 0 80px rgba(250,204,21,0.2); }
  .corner { position: absolute; width: 80px; height: 80px; border-color: #facc15; border-style: solid; }
  .tl { top: 20px; left: 20px; border-width: 3px 0 0 3px; border-radius: 8px 0 0 0; }
  .tr { top: 20px; right: 20px; border-width: 3px 3px 0 0; border-radius: 0 8px 0 0; }
  .bl { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; border-radius: 0 0 0 8px; }
  .br { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; border-radius: 0 0 8px 0; }
  .logo { font-size: 13px; color: #a1a1aa; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; }
  .title { font-family: 'Playfair Display', serif; font-size: 48px; color: #facc15; margin-bottom: 4px; }
  .subtitle { font-size: 14px; color: #a1a1aa; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; }
  .divider { width: 200px; height: 2px; background: linear-gradient(90deg, transparent, #facc15, transparent); margin: 0 auto 40px; }
  .presented { font-size: 14px; color: #a1a1aa; margin-bottom: 12px; }
  .name { font-family: 'Playfair Display', serif; font-size: 36px; color: #fff; margin-bottom: 24px; }
  .course-label { font-size: 14px; color: #a1a1aa; margin-bottom: 8px; }
  .course { font-size: 22px; font-weight: 600; color: #facc15; margin-bottom: 8px; }
  .category { display: inline-block; background: rgba(250,204,21,0.1); border: 1px solid rgba(250,204,21,0.3); color: #facc15; padding: 4px 16px; border-radius: 100px; font-size: 12px; margin-bottom: 40px; }
  .divider2 { width: 100%; height: 1px; background: rgba(250,204,21,0.2); margin-bottom: 30px; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; }
  .sig { text-align: left; }
  .sig-name { font-size: 16px; font-weight: 600; color: #facc15; }
  .sig-role { font-size: 12px; color: #a1a1aa; }
  .stamp { width: 80px; height: 80px; border: 2px solid #facc15; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; }
  .stamp-text { font-size: 8px; color: #facc15; font-weight: 600; text-align: center; letter-spacing: 1px; }
  .date-section { text-align: right; }
  .date-label { font-size: 12px; color: #a1a1aa; }
  .date-val { font-size: 14px; color: #fff; font-weight: 600; }
  @media print { body { background: white; } .cert { background: white; color: black; box-shadow: none; } .name { color: black; } }
</style></head>
<body><div class="cert">
  <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
  <div class="logo">Byonsoft OS — Master Database</div>
  <div class="title">Certificate</div>
  <div class="subtitle">of Course Completion</div>
  <div class="divider"></div>
  <div class="presented">This is to certify that</div>
  <div class="name">${user?.name || "Student"}</div>
  <div class="course-label">has successfully completed</div>
  <div class="course">${course.title}</div>
  <div class="category">${course.category}</div>
  <div class="divider2"></div>
  <div class="footer">
    <div class="sig"><div class="sig-name">Byonsoft OS Team</div><div class="sig-role">Course Instructor</div></div>
    <div class="stamp"><div class="stamp-text">BYONSOFT<br/>CERTIFIED<br/>✓</div></div>
    <div class="date-section"><div class="date-label">Date of Completion</div><div class="date-val">${dateStr}</div></div>
  </div>
</div></body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 800);
    }
  };

  const completedCount = progressList.filter((p) => p.is_completed).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <BookOpen className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <p className="font-black tracking-tight text-white leading-none">BYONSOFT <span className="text-yellow-400">OS</span></p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Master Database</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={user?.subscription_status ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-white/5 text-gray-400 border-white/10"}>
              {user?.subscription_status ? "Premium Active" : "Free Account"}
            </Badge>
            <a
              href="https://wa.me/923124494267?text=Hi%20Byonsoft%20Support!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 text-gray-300 font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            {user?.subscription_status ? (
              <Button
                size="sm"
                onClick={() => router.push("/course/1")}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs px-3 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
              >
                <Brain className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">AI Mentor</span>
                <span className="sm:hidden">AI</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setUpgradeOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-gray-400 text-xs px-3 border border-white/10"
              >
                <Lock className="w-3 h-3 mr-1" />
                <Brain className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">AI Mentor</span>
              </Button>
            )}
            <Link href="/profile">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <User className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={logout} className="text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

        <PWAInstallButton variant="banner" />

        <MegaLaunchBanner isPremium={!!user?.subscription_status} onUpgrade={() => setUpgradeOpen(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ReferralCard />
          <ReferralRewards />
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-2xl p-6 border border-yellow-500/20 backdrop-blur-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                Welcome back, <span className="text-yellow-400">{user?.name}</span>
              </h1>
              <p className="text-gray-400 mt-1 font-medium">Continue your journey to 100K PKR.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {!user?.subscription_status && (
                <Button
                  onClick={() => setUpgradeOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all"
                >
                  <Zap className="w-4 h-4 mr-2" /> Upgrade Rs. {price}/mo
                </Button>
              )}
              <Button variant="outline" onClick={refreshUser} className="border-white/10 bg-black text-gray-300 hover:text-white hover:bg-white/5">
                <Activity className="w-4 h-4 mr-2 text-yellow-400" /> Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className={`relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] ${isPhase2 ? "bg-gradient-to-br from-purple-900/40 to-black border-purple-500/30" : "bg-gradient-to-br from-yellow-500/10 to-black border-yellow-500/30"}`}>
            <div className={`absolute inset-x-0 top-0 h-1 ${isPhase2 ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gradient-to-r from-yellow-500 to-orange-500"}`} />
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${isPhase2 ? "bg-purple-900/40 border-purple-500/30" : "bg-yellow-400/10 border-yellow-400/20"}`}>
                <Trophy className={`w-6 h-6 ${isPhase2 ? "text-purple-400" : "text-yellow-400"}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-lg font-black leading-tight truncate ${isPhase2 ? "text-purple-300" : "text-yellow-400"}`}>
                  {isPhase2 ? "Rs. 100,000" : "Rs. 35,000"}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isPhase2 ? "text-purple-500" : "text-yellow-600"}`}>
                  {isPhase2 ? "Mega Giveaway" : "Phase 1 Giveaway"}
                </p>
              </div>
            </CardContent>
          </Card>

          {[
            { label: "Completed", value: completedCount, icon: Award, color: "text-green-400" },
            { label: "AI Assessment", value: hasAssessment ? "Done" : "Pending", icon: Star, color: hasAssessment ? "text-green-400" : "text-yellow-400" },
            { label: "In Progress", value: progressList.length - completedCount, icon: TrendingUp, color: "text-blue-400" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── AI Career Roadmap Section ── */}
        {(() => {
          let savedRoadmap: { recommended_courses?: string[]; career_paths?: string[]; expected_income?: string; learning_order?: string } | null = null;
          if (skillScore?.roadmap_result) {
            try { savedRoadmap = JSON.parse(skillScore.roadmap_result); } catch {}
          }
          if (savedRoadmap && savedRoadmap.recommended_courses) {
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-black text-white tracking-tight">Your Action Plan</h2>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push("/skill-test")} className="border-white/10 bg-black text-gray-300 hover:text-white">
                    Retake Test
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {savedRoadmap.recommended_courses?.length > 0 && (
                    <Card className="bg-white/5 border border-white/10 overflow-hidden rounded-2xl backdrop-blur-md">
                      <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-4 h-4 text-yellow-400" />
                          <p className="text-white font-bold uppercase tracking-widest text-xs">Recommended Courses</p>
                        </div>
                        <div className="space-y-2">
                          {savedRoadmap.recommended_courses!.slice(0, 4).map((c, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="w-6 h-6 rounded-md bg-yellow-400/20 text-yellow-400 text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                              <span className="text-gray-300 font-medium text-sm truncate">{c}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {savedRoadmap.career_paths?.length > 0 && (
                    <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Briefcase className="w-4 h-4 text-blue-400" />
                          <p className="text-white font-bold uppercase tracking-widest text-xs">Career Paths</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {savedRoadmap.career_paths!.map((p, i) => (
                            <Badge key={i} className="bg-blue-500/10 border-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {savedRoadmap.expected_income && (
                    <Card className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl backdrop-blur-md">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <p className="text-green-400 text-xs font-black uppercase tracking-widest">Expected Income Target</p>
                        </div>
                        <p className="text-white text-3xl font-black mt-2">{savedRoadmap.expected_income}</p>
                      </CardContent>
                    </Card>
                  )}

                  {savedRoadmap.learning_order && (
                    <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <ListOrdered className="w-4 h-4 text-orange-400" />
                          <p className="text-white font-bold uppercase tracking-widest text-xs">Learning Sequence</p>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{savedRoadmap.learning_order}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div className="relative overflow-hidden rounded-[32px] border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-black to-black p-10 text-center shadow-[0_0_30px_rgba(250,204,21,0.05)]">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-500 rounded-full blur-[100px]" />
              </div>
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                  Discover Your 100K Path
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
                  Take our 2-minute AI assessment. We'll map your personality to the most profitable digital skill and generate a custom roadmap.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={() => router.push("/skill-test")}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg px-10 py-6 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-105 transition-all"
                  >
                    <Zap className="w-5 h-5 mr-2" /> Start Free Test
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── FIRST CLIENT GUIDE ── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">How to Get Your First Client</h2>
          </div>
          <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/5 p-2 md:p-8 backdrop-blur-md">
            <div className={`space-y-6 p-4 transition-all duration-500 ${!user?.subscription_status ? "blur-[8px] opacity-40 select-none pointer-events-none" : ""}`}>
              {[
                { step: "01", title: "Build Your Arsenal", body: "Create a simple portfolio with 2-3 sample projects. Social proof is your strongest weapon." },
                { step: "02", title: "Setup Freelance Profiles", body: "Optimize Fiverr/Upwork. Start with a competitive edge and get those crucial first reviews." },
                { step: "03", title: "Local Market Domination", body: "Offer free audits to local businesses. Show them the flaws in their digital presence and pitch the fix." },
                { step: "04", title: "Social Media Authority", body: "Answer questions in niche Facebook groups. Become the expert people naturally DM." },
                { step: "05", title: "The Cold Script", body: "\"Hi [Name], I noticed [Issue]. I specialize in [Skill] and can fix this for you. Open to a 5-min chat?\"" },
                { step: "06", title: "The Referral Loop", body: "Over-deliver on your first gig and immediately ask for a referral. It's the ultimate growth hack." },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 text-yellow-400 text-sm font-black font-mono shadow-inner">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <p className="text-white font-bold text-lg mb-1">{item.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {!user?.subscription_status && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 backdrop-blur-sm z-10 rounded-[32px]">
                <Lock className="w-12 h-12 text-yellow-400 mb-2 drop-shadow-lg" />
                <p className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-md">Strategy Locked</p>
                <p className="text-gray-300 text-sm font-medium mb-4 drop-shadow-md">Unlock the complete client acquisition blueprint with Premium.</p>
                <Button
                  onClick={() => setUpgradeOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-6 rounded-2xl text-base shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 transition-all"
                >
                  Unlock Access (Rs. {price})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── PRICING CARDS ── */}
        {!user?.subscription_status && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Unlock Your Potential</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              {/* Free Card */}
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Starter Tier</p>
                <p className="text-4xl font-black text-white mb-1">Rs. 0</p>
                <p className="text-gray-400 text-xs mb-8 font-medium">Limited access for exploration.</p>
                <ul className="space-y-4 text-sm font-medium">
                  {[
                    { text: "Basic AI Career Assessment", ok: true },
                    { text: "Dashboard Overview", ok: true },
                    { text: "24/7 AI Mentor Chat", ok: false },
                    { text: "50+ Premium Courses", ok: false },
                    { text: "Giveaway Cash Entries", ok: false },
                  ].map((f) => (
                    <li key={f.text} className={`flex items-center gap-3 ${f.ok ? "text-white" : "text-gray-600 line-through"}`}>
                      {f.ok ? <CheckCircle className="w-5 h-5 text-gray-500 shrink-0" /> : <XIcon className="w-5 h-5 text-gray-700 shrink-0" />}
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium Card */}
              <div className="rounded-[32px] border border-yellow-400/40 bg-gradient-to-br from-yellow-500/10 to-transparent p-8 relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.1)] transform md:-translate-y-2">
                <div className="absolute top-6 right-6 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">Pro Access</div>
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">Premium Tier</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <p className="text-4xl font-black text-white">Rs. {price}</p>
                  <p className="text-gray-400 text-sm font-bold">/mo</p>
                </div>
                <p className="text-gray-300 text-xs mb-8 font-medium">Full arsenal to hit 100K PKR.</p>
                <ul className="space-y-4 text-sm font-bold text-white mb-8">
                  {[
                    "Unlimited 24/7 AI Mentor",
                    "Complete Vault of Premium Courses",
                    "Saved & Interactive AI Roadmap",
                    "Entry into Rs. 35,000+ Giveaway",
                    "Official Certification",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setUpgradeOpen(true)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-6 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:scale-[1.02] transition-all"
                >
                  Get Premium Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              The Vault
            </h2>
          </div>

          {!user?.subscription_status && (
            <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-gray-300 text-sm font-medium">
                Premium courses are locked. Upgrade to unlock the full database.
              </p>
              <Button size="sm" onClick={() => setUpgradeOpen(true)} className="ml-auto bg-yellow-400 text-black font-black shrink-0 px-6">
                Unlock
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesLoading
              ? Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="bg-white/5 border-white/10 rounded-[24px]">
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-5 w-3/4 bg-white/10" />
                      <Skeleton className="h-4 w-1/2 bg-white/10" />
                      <Skeleton className="h-2 w-full bg-white/10 mt-4" />
                    </CardContent>
                  </Card>
                ))
              : sortedCourses.map((course) => {
                  const prog = getProgress(course.id);
                  const isLocked = !user?.subscription_status;
                  const isCompleted = prog?.is_completed === true;
                  const progressPct = prog ? Math.min(100, (prog.lessons_completed / 10) * 100) : 0;
                  const isRecommended = isTagMatch(course);

                  return (
                    <Card
                      key={course.id}
                      onClick={() => { if (isLocked) setUpgradeOpen(true); else router.push(`/course/${course.id}`); }}
                      className={`
                        relative group backdrop-blur-md rounded-[24px] overflow-hidden
                        transition-all duration-300 cursor-pointer border
                        ${isRecommended
                          ? "bg-gradient-to-br from-yellow-500/10 to-black border-yellow-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(250,204,21,0.15)]"
                          : isLocked
                          ? "bg-white/5 border-white/5 opacity-80 hover:border-white/20"
                          : isCompleted
                          ? "bg-green-900/10 border-green-500/30 hover:border-green-500/50 hover:-translate-y-1"
                          : "bg-white/5 border-white/10 hover:border-yellow-400/30 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
                        }
                      `}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="flex flex-col gap-2">
                            <Badge className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-gray-300 border-none w-fit px-2 py-1">
                              {course.category}
                            </Badge>
                            {isRecommended && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-black bg-yellow-400 px-2.5 py-1 rounded-sm w-fit uppercase tracking-widest">
                                Target Skill
                              </span>
                            )}
                          </div>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                          ) : isCompleted ? (
                            <Award className="w-5 h-5 text-green-400 shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-black text-lg text-white mb-2 leading-snug group-hover:text-yellow-400 transition-colors">{course.title}</h3>
                        <p className="text-gray-400 text-xs mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                        <div className="space-y-2 mt-auto">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span>Status</span>
                            <span className={isCompleted ? "text-green-400" : "text-yellow-400"}>{isCompleted ? "Verified" : `${prog?.lessons_completed ?? 0} Nodes`}</span>
                          </div>
                          <Progress value={isCompleted ? 100 : progressPct} className={`h-1 ${isCompleted ? "bg-green-900 [&>div]:bg-green-400" : "bg-white/10 [&>div]:bg-yellow-400"}`} />
                        </div>

                        {isCompleted && !isLocked && (
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-black text-[10px] uppercase tracking-widest mt-4"
                            onClick={(e) => { e.stopPropagation(); downloadCertificate(course); }}
                          >
                            <Download className="w-4 h-4 mr-2" /> Download Proof
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            <p className="text-white font-black tracking-widest text-sm">BYONSOFT <span className="text-yellow-400">OS</span></p>
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <Link href="/terms" className="hover:text-yellow-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy</Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
