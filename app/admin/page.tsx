"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toEmbedUrl } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users, BookOpen, CreditCard, BarChart3, Check, X, Trash2, Edit3,
  Plus, LogOut, Shield, ChevronRight, RefreshCw, Settings, FolderOpen, Eye,
  Download, Share2, UserCheck, TrendingUp, Gift, Tag
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { GiveawayManagerWidget } from "@/components/GiveawayBanner";
import type { Course, Lesson, PaymentSetting, User, Coupon } from "@shared/schema";

// Interfaces
interface ReferralUserRow {
  id: number; name: string; email: string; referral_code: string;
  subscription_status: boolean; referred_by_name: string | null;
  referral_bonus_count: number; total_referrals: number; 
  successful_referrals: number; premium_conversions: number;
}

interface TxWithUser {
  id: number; user_id: number; amount: string; method: string;
  trx_id: string; status: string; created_at: string;
  user_name: string; user_email: string; screenshot_url: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // State variables
  const [courseDialog, setCourseDialog] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ title: "", category: "", description: "", tags: "" });
  
  const [editPayment, setEditPayment] = useState<PaymentSetting | null>(null);
  const [paymentDetails, setPaymentDetails] = useState("");
  
  const [lessonCourse, setLessonCourse] = useState<Course | null>(null);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", video_url: "", module_name: "" });
  
  const [priceInput, setPriceInput] = useState<string>("");
  const [driveUrl, setDriveUrl] = useState("");
  const [driveModuleName, setDriveModuleName] = useState("");
  const [driveDrafts, setDriveDrafts] = useState<{ title: string; video_url: string; module_name: string }[]>([]);
  const [driveFetching, setDriveFetching] = useState(false);
  
  const [screenshotTx, setScreenshotTx] = useState<TxWithUser | null>(null);
  const [editBonusDialog, setEditBonusDialog] = useState(false);
  const [editBonusUser, setEditBonusUser] = useState<{ id: number; name: string; bonus: number } | null>(null);
  const [bonusInput, setBonusInput] = useState("0");
  
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [referralRules, setReferralRules] = useState(
    JSON.stringify([
      { threshold: 1, label: "Bonus Lesson", icon: "📚" },
      { threshold: 3, label: "Free Premium Week", icon: "⭐" },
      { threshold: 5, label: "Extra Giveaway Ticket", icon: "🎟️" },
      { threshold: 10, label: "Free 1-Month Premium", icon: "👑" },
    ], null, 2)
  );
  
  const [referralSearch, setReferralSearch] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponPrice, setCouponPrice] = useState("");
  const [couponDesc, setCouponDesc] = useState("");

  [span_3](start_span)// Queries[span_3](end_span)
  const { data: users = [], refetch: refetchUsers } = useQuery<User[]>({ queryKey: ["/api/admin/users"] });
  const { data: courses = [], refetch: refetchCourses } = useQuery<Course[]>({ queryKey: ["/api/admin/courses"] });
  const { data: paymentSettings = [] } = useQuery<PaymentSetting[]>({ queryKey: ["/api/admin/payment-settings"] });
  const { data: transactions = [], refetch: refetchTx } = useQuery<TxWithUser[]>({ queryKey: ["/api/admin/transactions"] });
  
  const { data: referralData = [], refetch: refetchReferrals } = useQuery<ReferralUserRow[]>({
    queryKey: ["/api/admin/referrals"],
    queryFn: async () => {
      const token = localStorage.getItem("byonsoft_token");
      const r = await fetch("/api/admin/referrals", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      return Array.isArray(d) ? d : [];
    },
  });

  const { data: referralSettings, refetch: refetchReferralSettings } = useQuery<{ referral_enabled: boolean; referral_reward_rules: string }>({
    queryKey: ["/api/admin/referrals/settings"],
    queryFn: async () => {
      const token = localStorage.getItem("byonsoft_token");
      const r = await fetch("/api/admin/referrals/settings", { headers: { Authorization: `Bearer ${token}` } });
      return r.json();
    },
  });

  const { data: coupons = [], refetch: refetchCoupons } = useQuery<Coupon[]>({
    queryKey: ["/api/admin/coupons"],
  });

  const { data: priceSetting } = useQuery<{ subscription_price: number }>({
    queryKey: ["/api/settings/price"],
  });

  const { data: courseLessons = [] } = useQuery<Lesson[]>({
    queryKey: [`/api/admin/courses/${lessonCourse?.id}/lessons`],
    enabled: !!lessonCourse,
  });

  // Mutations
  const createCoupon = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/coupons", {
        coupon_code: couponCode.trim().toUpperCase(),
        custom_price: Number(couponPrice),
        description: couponDesc.trim(),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      setCouponCode(""); setCouponPrice(""); setCouponDesc("");
      toast({ title: "Coupon created!" });
    },
    onError: (e: Error) => toast({ title: e.message, variant: "destructive" }),
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/coupons/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] }); toast({ title: "Coupon deleted" }); },
  });

  const adjustBonus = useMutation({
    mutationFn: async ({ userId, bonus }: { userId: number; bonus: number }) => {
      const res = await apiRequest("PATCH", `/api/admin/referrals/${userId}/bonus`, { bonus });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/referrals"] });
      setEditBonusDialog(false);
      toast({ title: "Referral bonus updated!" });
    },
  });

  const saveReferralSettings = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/admin/referrals/settings", {
        referral_enabled: referralEnabled,
        referral_reward_rules: referralRules,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/referrals/settings"] });
      toast({ title: "Referral settings saved!" });
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const updateTxStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/transactions/${id}/status`, { status });
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: vars.status === "approved" ? "Payment Approved!" : "Payment Rejected", description: vars.status === "approved" ? "User subscription activated" : "Transaction rejected" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/users/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }); toast({ title: "User deleted" }); },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/role`, { role });
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }); toast({ title: "Role updated" }); },
  });

  const toggleSubscription = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/subscription`, { subscription_status: status });
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/giveaway/stats"] });
      toast({ title: vars.status ? "Subscription activated" : "Subscription deactivated" });
    },
  });

  const saveCourse = useMutation({
    mutationFn: async () => {
      if (editCourse) {
        const res = await apiRequest("PATCH", `/api/admin/courses/${editCourse.id}`, courseForm);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/admin/courses", courseForm);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setCourseDialog(false);
      setEditCourse(null);
      setCourseForm({ title: "", category: "", description: "", tags: "" });
      toast({ title: editCourse ? "Course updated!" : "Course created!" });
    },
  });

  const saveLesson = useMutation({
    mutationFn: async () => {
      if (!lessonCourse) return;
      const normalizedForm = { ...lessonForm, video_url: toEmbedUrl(lessonForm.video_url) };
      if (editLesson) {
        const res = await apiRequest("PATCH", `/api/admin/lessons/${editLesson.id}`, normalizedForm);
        return res.json();
      } else {
        const nextIndex = courseLessons.length;
        const res = await apiRequest("POST", `/api/admin/courses/${lessonCourse.id}/lessons`, {
          ...normalizedForm,
          order_index: nextIndex,
        });
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${lessonCourse?.id}/lessons`] });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${lessonCourse?.id}/lessons`] });
      setEditLesson(null);
      setLessonForm({ title: "", video_url: "", module_name: "" });
      toast({ title: editLesson ? "Lesson updated!" : "Lesson added!" });
    },
  });

  const deleteLesson = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/lessons/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${lessonCourse?.id}/lessons`] });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${lessonCourse?.id}/lessons`] });
      toast({ title: "Lesson deleted" });
    },
  });

  const savePayment = useMutation({
    mutationFn: async () => {
      if (!editPayment) return;
      const res = await apiRequest("PATCH", `/api/admin/payment-settings/${editPayment.id}`, { account_details: paymentDetails });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      setEditPayment(null);
      toast({ title: "Payment details updated!" });
    },
  });

  const savePrice = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/admin/settings/price", { subscription_price: parseInt(priceInput, 10) });
      return res.json();
    },
    onSuccess: (data: { subscription_price: number }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/price"] });
      setPriceInput(String(data.subscription_price));
      toast({ title: "Subscription price updated!", description: `New price: Rs. ${data.subscription_price}/month` });
    },
    onError: (err: any) => {
      toast({ title: "Failed to update price", description: err.message, variant: "destructive" });
    },
  });

  // Helpers
  const exportReferralCSV = async () => {
    const token = localStorage.getItem("byonsoft_token");
    const r = await fetch("/api/admin/referrals/export", { headers: { Authorization: `Bearer ${token}` } });
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "byonsoft-referrals.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  async function fetchDriveLessons() {
    if (!driveUrl.trim()) return;
    if (!driveModuleName.trim()) {
      toast({ title: "Module Name required", description: "Please enter a module name before fetching.", variant: "destructive" });
      return;
    }
    setDriveFetching(true);
    try {
      const res = await apiRequest("GET", `/api/admin/drive/import?folderUrl=${encodeURIComponent(driveUrl.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch from Google Drive");
      const drafts = (data.lessons as { title: string; video_url: string }[]).map((l) => ({
        ...l,
        module_name: driveModuleName.trim(),
      }));
      setDriveDrafts(drafts);
      if (drafts.length === 0) toast({ title: "No files found", description: "The folder appears to be empty." });
    } catch (err: any) {
      toast({ title: "Drive Fetch Failed", description: err.message, variant: "destructive" });
    } finally {
      setDriveFetching(false);
    }
  }

  const bulkImportDrive = useMutation({
    mutationFn: async () => {
      if (!lessonCourse || driveDrafts.length === 0) return;
      const baseIndex = courseLessons.length;
      for (let i = 0; i < driveDrafts.length; i++) {
        await apiRequest("POST", `/api/admin/courses/${lessonCourse.id}/lessons`, {
          ...driveDrafts[i],
          order_index: baseIndex + i,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/courses/${lessonCourse?.id}/lessons`] });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${lessonCourse?.id}/lessons`] });
      const count = driveDrafts.length;
      setDriveDrafts([]); setDriveUrl(""); setDriveModuleName("");
      toast({ title: `${count} lesson(s) imported!` });
    },
    onError: (err: any) => {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    },
  });

  // Effects
  useEffect(() => {
    if (referralSettings) {
      setReferralEnabled(referralSettings.referral_enabled ?? true);
      if (referralSettings.referral_reward_rules) {
        try { setReferralRules(JSON.stringify(JSON.parse(referralSettings.referral_reward_rules), null, 2)); } catch { /* keep default */ }
      }
    }
  }, [referralSettings]);

  useEffect(() => {
    if (priceSetting && !priceInput) setPriceInput(String(priceSetting.subscription_price));
  }, [priceSetting]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const openCourseEdit = (c: Course) => {
    setEditCourse(c);
    setCourseForm({ title: c.title, category: c.category, description: c.description, tags: c.tags ?? "" });
    setCourseDialog(true);
  };

  const openLessonManager = (c: Course) => {
    setLessonCourse(c);
    setEditLesson(null);
    setLessonForm({ title: "", video_url: "", module_name: "" });
    setLessonDialog(true);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
    approved: "bg-green-400/10 text-green-400 border-green-400/30",
    rejected: "bg-red-400/10 text-red-400 border-red-400/30",
  };

  const pendingTx = transactions.filter((t) => t.status === "pending");

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white leading-none uppercase tracking-wide">Command Center</p>
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Byonsoft OS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {pendingTx.length > 0 && (
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/40">
                {pendingTx.length} Pending Actions
              </Badge>
            )}
            <Button size="sm" variant="ghost" onClick={logout} className="text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, icon: Users, color: "text-blue-400" },
            { label: "Courses", value: courses.length, icon: BookOpen, color: "text-green-400" },
            { label: "Pending Approvals", value: pendingTx.length, icon: CreditCard, color: "text-yellow-400" },
            { label: "Premium Fleet", value: users.filter((u) => u.subscription_status).length, icon: BarChart3, color: "text-purple-400" },
          ].map((s) => (
            <Card key={s.label} className="bg-white/5 border border-white/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Giveaway Manager */}
        <div className="mb-8">
          <GiveawayManagerWidget />
        </div>

        <Tabs defaultValue="transactions">
          <TabsList className="bg-white/5 border border-white/10 mb-6 w-full flex flex-wrap h-auto p-1 rounded-xl">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">
              Transactions {pendingTx.length > 0 && <span className="ml-2 bg-red-600 text-white text-[10px] rounded-full px-2 py-0.5">{pendingTx.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">Users</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">Courses</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">Finances</TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">
              <Gift className="w-4 h-4 mr-1.5" /> Referrals
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">
              <Settings className="w-4 h-4 mr-1.5" /> Settings
            </TabsTrigger>
            <TabsTrigger value="coupons" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-gray-400 font-bold">
              <Tag className="w-4 h-4 mr-1.5" /> Coupons
            </TabsTrigger>
          </TabsList>

          {/* ─── TRANSACTIONS TAB ─── */}
          <TabsContent value="transactions">
            <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Payment Approvals</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => refetchTx()} className="text-yellow-400 hover:text-yellow-300">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-black/40">
                    <TableRow className="border-white/10 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                      <TableHead>User / Identity</TableHead>
                      <TableHead>Reference (TID)</TableHead>
                      <TableHead>Screenshot</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-white/[0.02] transition-colors border-white/5">
                        <TableCell className="p-4">
                          <p className="text-white font-bold text-sm">{tx.user_name}</p>
                          <p className="text-gray-500 text-xs">{tx.user_email}</p>
                        </TableCell>
                        <TableCell className="p-4">
                          <span className="bg-black border border-white/10 px-2 py-1 rounded font-mono text-xs text-yellow-400">{tx.trx_id || "N/A"}</span>
                        </TableCell>
                        <TableCell className="p-4">
                          {tx.screenshot_url ? (
                            <button onClick={() => setScreenshotTx(tx)} className="group relative w-16 h-10 rounded-lg overflow-hidden border border-white/10 cursor-pointer">
                              <img src={tx.screenshot_url} alt="Proof" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          ) : <span className="text-gray-600 text-xs italic">Missing</span>}
                        </TableCell>
                        <TableCell className="p-4 text-green-400 font-bold">Rs. {tx.amount}</TableCell>
                        <TableCell className="p-4"><Badge className={`text-[10px] font-bold uppercase tracking-widest ${statusColor[tx.status]}`}>{tx.status}</Badge></TableCell>
                        <TableCell className="p-4">
                          <div className="flex gap-2">
                            {tx.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black h-8 px-3" disabled={updateTxStatus.isPending} onClick={() => updateTxStatus.mutate({ id: tx.id, status: "approved" })}>
                                  <Check className="w-3 h-3 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" className="h-8 px-3 text-[10px] font-black" disabled={updateTxStatus.isPending} onClick={() => updateTxStatus.mutate({ id: tx.id, status: "rejected" })}>
                                  <X className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {transactions.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest">No pending transactions.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── USERS TAB ─── */}
          <TabsContent value="users">
            <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Global Network</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => refetchUsers()} className="text-yellow-400 hover:text-yellow-300">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-black/40">
                    <TableRow className="border-white/10 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                      <TableHead>Identity</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Operations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <TableRow key={u.id} className="hover:bg-white/[0.02] border-white/5">
                        <TableCell className="p-4">
                          <p className="text-white font-bold text-sm">{u.name}</p>
                          <p className="text-gray-500 text-xs">{u.email}</p>
                        </TableCell>
                        <TableCell className="p-4 text-xs font-mono text-gray-400">{(u as any).whatsapp_number || "---"}</TableCell>
                        <TableCell className="p-4"><Badge className={u.role === "admin" ? "bg-red-600/20 text-red-400 border-red-600/30" : "bg-white/10 text-gray-400"}>{u.role}</Badge></TableCell>
                        <TableCell className="p-4"><Badge className={u.subscription_status ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30" : "bg-white/5 text-gray-500"}>{u.subscription_status ? "Premium" : "Free"}</Badge></TableCell>
                        <TableCell className="p-4">
                          {u.email !== user.email && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className={`h-8 px-2 text-[10px] font-black border-white/10 bg-black ${u.subscription_status ? 'text-red-400 hover:text-red-300 hover:border-red-400' : 'text-green-400 hover:text-green-300 hover:border-green-400'}`} disabled={toggleSubscription.isPending} onClick={() => toggleSubscription.mutate({ id: u.id, status: !u.subscription_status })}>
                                {u.subscription_status ? "Mark Free" : "Mark Premium"}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 px-2 text-[10px] font-black text-gray-400 hover:text-white" onClick={() => updateRole.mutate({ id: u.id, role: u.role === "admin" ? "user" : "admin" })}>Toggle Admin</Button>
                              <Button size="sm" variant="ghost" className="h-8 px-2 text-red-500 hover:bg-red-900/30" onClick={() => deleteUser.mutate(u.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── COURSES TAB ─── */}
          <TabsContent value="courses">
            <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Vault Management</CardTitle>
                <Button size="sm" className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs" onClick={() => { setEditCourse(null); setCourseForm({ title: "", category: "", description: "", tags: "" }); setCourseDialog(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Add Course
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {courses.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between hover:border-white/20 transition-all">
                      <div>
                        <p className="text-white font-bold text-lg">{c.title}</p>
                        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">{c.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-white/10 bg-black text-purple-400 hover:text-purple-300 font-black text-xs" onClick={() => openLessonManager(c)}>
                          <BookOpen className="w-3 h-3 mr-1" /> Syllabus
                        </Button>
                        <Button size="sm" variant="ghost" className="text-blue-400" onClick={() => openCourseEdit(c)}><Edit3 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => deleteCourse.mutate(c.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── PAYMENTS SETTINGS ─── */}
          <TabsContent value="payments">
            <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Receiving Accounts</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {paymentSettings.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-black/40 border border-white/5">
                    {editPayment?.id === p.id ? (
                      <div className="space-y-3">
                        <p className="text-white font-bold">{p.method_name}</p>
                        <Textarea value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)} className="bg-black border border-white/10 text-white font-mono text-sm resize-none" rows={3} />
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 text-white font-bold" onClick={() => savePayment.mutate()} disabled={savePayment.isPending}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditPayment(null)} className="text-gray-400">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-bold text-lg mb-1">{p.method_name}</p>
                          <p className="text-yellow-400 font-mono text-sm whitespace-pre-wrap">{p.account_details}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-400" onClick={() => { setEditPayment(p); setPaymentDetails(p.account_details); }}><Edit3 className="w-4 h-4" /></Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── SETTINGS ─── */}
          <TabsContent value="settings">
            <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden max-w-xl">
              <CardHeader className="border-b border-white/10 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Global Price Config</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest">Monthly Subscription (PKR)</Label>
                <div className="flex gap-3">
                  <Input type="number" className="bg-black border border-white/10 text-white font-bold text-lg" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black" onClick={() => savePrice.mutate()} disabled={savePrice.isPending}>Save Price</Button>
                </div>
                {priceSetting && <p className="text-green-400 text-xs font-bold bg-green-900/20 p-3 rounded-lg border border-green-900/50">Live Platform Price: Rs. {priceSetting.subscription_price}/mo</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── REFERRALS ─── */}
          <TabsContent value="referrals">
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Referred", value: referralData.reduce((a, u) => a + u.total_referrals, 0) },
                  { label: "Successful", value: referralData.reduce((a, u) => a + u.successful_referrals, 0) },
                  { label: "Premium Converted", value: referralData.reduce((a, u) => a + u.premium_conversions, 0) },
                  { label: "Active Marketers", value: referralData.filter(u => u.total_referrals > 0).length },
                ].map(stat => (
                  <Card key={stat.label} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                <CardHeader className="border-b border-white/10 bg-white/[0.02] flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Viral Growth Engine</CardTitle>
                    <p className="text-gray-500 text-xs mt-1">Control referral rewards and tiers</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-widest ${referralEnabled ? "text-green-400" : "text-gray-500"}`}>{referralEnabled ? "Online" : "Offline"}</span>
                    <Switch checked={referralEnabled} onCheckedChange={setReferralEnabled} className="data-[state=checked]:bg-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Reward Logic (JSON Array)</Label>
                  <Textarea value={referralRules} onChange={e => setReferralRules(e.target.value)} rows={6} className="bg-black border border-white/10 text-yellow-400 font-mono text-sm resize-none" />
                  <Button onClick={() => saveReferralSettings.mutate()} disabled={saveReferralSettings.isPending} className="bg-blue-600 hover:bg-blue-500 text-white font-black">Update Engine</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ─── COUPONS ─── */}
          <TabsContent value="coupons">
            <Card className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/[0.02]">
                <CardTitle className="text-white text-lg font-black uppercase tracking-widest">Coupon Generator</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block">Code</Label>
                    <Input placeholder="BYON500" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="bg-black border border-white/10 text-white uppercase font-bold" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block">Final Price (PKR)</Label>
                    <Input type="number" placeholder="500" value={couponPrice} onChange={(e) => setCouponPrice(e.target.value)} className="bg-black border border-white/10 text-white font-bold" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block">Tag (Optional)</Label>
                    <Input placeholder="Discount" value={couponDesc} onChange={(e) => setCouponDesc(e.target.value)} className="bg-black border border-white/10 text-white" />
                  </div>
                </div>
                <Button onClick={() => createCoupon.mutate()} disabled={createCoupon.isPending || !couponCode || !couponPrice} className="bg-blue-600 text-white font-black">Generate Link Code</Button>

                <div className="mt-10">
                  <h3 className="text-white font-black uppercase tracking-widest mb-4">Active Database</h3>
                  <div className="space-y-2">
                    {coupons.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                        <div>
                          <p className="text-yellow-400 font-mono font-bold text-lg">{c.coupon_code} <span className="text-green-400 text-sm ml-2">Rs. {c.custom_price}</span></p>
                          <p className="text-gray-500 text-xs">{c.description || "System generated"}</p>
                        </div>
                        <Button variant="ghost" className="text-red-500 hover:bg-red-900/30" onClick={() => deleteCoupon.mutate(c.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      {/* ─── MODALS ─── */}
      {/* Screenshot Viewer */}
      <Dialog open={!!screenshotTx} onOpenChange={(o) => { if (!o) setScreenshotTx(null); }}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-2xl rounded-[32px] overflow-hidden">
          <DialogHeader className="p-6 border-b border-white/10 bg-white/[0.02]">
            <DialogTitle className="text-white flex items-center gap-2 font-black uppercase tracking-widest">
              <Eye className="w-5 h-5 text-yellow-400" /> Evidence: {screenshotTx?.user_name}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            {screenshotTx?.screenshot_url ? (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
                <img src={screenshotTx.screenshot_url} alt="Proof" className="w-full max-h-[60vh] object-contain" />
              </div>
            ) : <div className="text-center py-10 text-gray-500">No Image Detected</div>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Dialog */}
      <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
        <DialogContent className="bg-black border border-white/10 text-white rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-widest">{editCourse ? "Edit Vault Item" : "Create Vault Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Title</Label><Input className="bg-white/5 border-white/10 mt-1" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} /></div>
            <div><Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Category</Label><Input className="bg-white/5 border-white/10 mt-1" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} /></div>
            <div><Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Description</Label><Textarea className="bg-white/5 border-white/10 mt-1 resize-none" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} /></div>
            <div><Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tags</Label><Input className="bg-white/5 border-white/10 mt-1" value={courseForm.tags} onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })} placeholder="SEO, Shopify" /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCourseDialog(false)} className="text-gray-400">Cancel</Button>
            <Button className="bg-yellow-400 text-black font-black" onClick={() => saveCourse.mutate()} disabled={saveCourse.isPending || !courseForm.title}>Commit Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Manager Dialog (WITH DRIVE SYNC) */}
      <Dialog open={lessonDialog} onOpenChange={(open) => { setLessonDialog(open); if (!open) { setEditLesson(null); setLessonForm({ title: "", video_url: "", module_name: "" }); setDriveUrl(""); setDriveModuleName(""); setDriveDrafts([]); } }}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-3xl rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-black uppercase tracking-widest text-yellow-400">
              <FolderOpen className="w-5 h-5" /> Syllabus Sync — {lessonCourse?.title}
            </DialogTitle>
          </DialogHeader>

          {/* Existing Lessons */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {courseLessons.map((lesson, idx) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-white text-sm font-bold">{idx + 1}. {lesson.title}</p>
                  <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">{lesson.module_name || "General"}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-400 h-8 w-8 p-0" onClick={() => { setEditLesson(lesson); setLessonForm({ title: lesson.title, video_url: lesson.video_url, module_name: lesson.module_name || "" }); }}><Edit3 className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 h-8 w-8 p-0" onClick={() => deleteLesson.mutate(lesson.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-8">
             {/* Manual Add */}
             <div className="space-y-3">
               <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Manual Node Upload</p>
               <Input className="bg-white/5 border-white/10 text-xs" placeholder="Lesson Title" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} />
               <Input className="bg-white/5 border-white/10 text-xs" placeholder="Module Group" value={lessonForm.module_name} onChange={e => setLessonForm({...lessonForm, module_name: e.target.value})} />
               <Input className="bg-white/5 border-white/10 text-xs" placeholder="Video / Drive Link" value={lessonForm.video_url} onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})} />
               <Button className="w-full bg-blue-600 font-black text-xs" onClick={() => saveLesson.mutate()} disabled={saveLesson.isPending}>Commit Node</Button>
             </div>
             
             {/* Drive Batch Import */}
             <div className="space-y-3 bg-blue-900/10 p-4 rounded-2xl border border-blue-500/20">
               <p className="text-blue-400 text-xs font-black uppercase tracking-widest">G-Drive Batch Sync</p>
               <Input className="bg-black/60 border-blue-500/30 text-xs" placeholder="Module Group Name" value={driveModuleName} onChange={e => setDriveModuleName(e.target.value)} />
               <div className="flex gap-2">
                 <Input className="bg-black/60 border-blue-500/30 text-xs flex-1" placeholder="Drive Folder URL" value={driveUrl} onChange={e => setDriveUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchDriveLessons()} />
                 <Button size="sm" className="bg-blue-600 font-black" onClick={fetchDriveLessons} disabled={driveFetching || !driveUrl || !driveModuleName}>{driveFetching ? "..." : "Pull"}</Button>
               </div>
               {driveDrafts.length > 0 && (
                 <Button className="w-full bg-green-600 text-white font-black text-xs mt-2" onClick={() => bulkImportDrive.mutate()} disabled={bulkImportDrive.isPending}>
                   Sync {driveDrafts.length} Items to Cloud
                 </Button>
               )}
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
