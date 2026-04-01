"use server";

import { db } from "../lib/db";
import { users, courses, coupons, payment_settings } from "../lib/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import Groq from "groq-sdk";

export async function signUpUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const password = formData.get("password") as string;
    const skill = formData.get("skill") as string; // 🔴 Test result yahan pakra

    if (!name || !email || !password || !whatsapp) {
      return { error: "Tamam fields zaroori hain!" };
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { error: "Yeh email pehle se registered hai! Koi aur use karein." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      whatsapp,
      skill, // 🔴 Database mein save kar diya
    });

    return { success: true };
  } catch (err: any) {
    console.error("Signup Error:", err);
    return { error: "Database se connect nahi ho paya. Thodi der baad try karein." };
  }
}


    const existingUsers = await db.select().from(users).where(eq(users.email, email));
    const user = existingUsers[0];

    if (!user) {
      return { error: "Yeh account mojood nahi. Pehle Signup karein." };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Password ghalat hai!" };
    }

    const cookieStore = await cookies();
    cookieStore.set("user_session", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (err: any) {
    console.error("Login Error:", err);
    return { error: "Server masla kar raha hai. Thodi der baad try karein." };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}

export async function generateRoadmap(formData: FormData) {
  try {
    const skillLevel = formData.get("skillLevel");
    const englishLevel = formData.get("englishLevel");
    const dedication = formData.get("dedication");
    const q1Skill = formData.get("q1Skill");
    const q2Struggle = formData.get("q2Struggle");
    const q3Time = formData.get("q3Time");
    const q4Market = formData.get("q4Market");

    if (!q1Skill || !q2Struggle) {
      return { error: "Bhai, zaroori sawalat ke jawabat toh dein!" };
    }

    const apiKeys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
      process.env.GROQ_API_KEY_6,
      process.env.GROQ_API_KEY_7,
    ].filter(Boolean) as string[];

    if (apiKeys.length === 0) {
      return { error: "Vercel mein API Keys set nahi hain!" };
    }

    const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const groq = new Groq({ apiKey: randomKey });

    const userContext = `
      User Stats:
      - Current Skill Level: ${skillLevel}%
      - English Communication: ${englishLevel}%
      - Dedication/Hardwork: ${dedication}%
      
      Answers:
      1. Main Skill: ${q1Skill}
      2. Biggest Struggle: ${q2Struggle}
      3. Daily Time: ${q3Time}
      4. Target Market: ${q4Market}
    `;

    const systemInstruction = `You are an elite AI Career Architect for Byonsoft Academy.
    The user's goal is to hit 100,000 PKR monthly profit by April.
    Based on the user's stats and answers, provide a highly personalized, aggressive plan.
    Use Roman Urdu mixed with simple English. 
    
    YOU MUST FORMAT YOUR RESPONSE EXACTLY IN THESE 3 SECTIONS:
    
    ### 💰 EARNING POTENTIAL
    (Give a realistic monthly earning estimate if they follow the plan, hype them up!)
    
    ### 🗺️ 30-DAY ACTION ROADMAP
    (Give specific, actionable steps for the next 30 days based on their daily time commitment. No fluff.)
    
    ### 🎯 HOW TO GET YOUR FIRST CLIENT
    (Give a direct strategy to get their first client based on their target market and struggle. E.g., Cold email script, Facebook group strategy, etc.)
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userContext }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "AI ne jawab nahi diya. Dobara try karein.";

    return { success: true, roadmap: aiResponse };

  } catch (err: any) {
    console.error("AI Error:", err);
    return { error: "AI Engine is waqt overload hai. Thodi der baad try karein." };
  }
}
export async function submitPayment(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) return { error: "Login zaroori hai!" };

    const tid = formData.get("tid") as string;
    if (!tid) return { error: "Transaction ID (TID) zaroori hai!" };

    // User ka status 'pending' kar do aur TID save kar lo
    await db.update(users)
      .set({ payment_status: "pending", tid: tid })
      .where(eq(users.id, parseInt(userId)));

    return { success: true };
  } catch (err: any) {
    console.error("Payment Error:", err);
    return { error: "System masla kar raha hai. Thodi der baad try karein." };
  }
}
// 🔴 Admin: Approve Payment
export async function approvePayment(userId: number) {
  try {
    await db.update(users)
      .set({ 
        is_premium: true, 
        payment_status: "paid" 
      })
      .where(eq(users.id, userId));
    return { success: true };
  } catch (err) {
    return { error: "Approval failed" };
  }
}

// 🔴 Admin: Reject Payment
export async function rejectPayment(userId: number) {
  try {
    await db.update(users)
      .set({ 
        payment_status: "unpaid", 
        tid: null, 
        screenshot: null 
      })
      .where(eq(users.id, userId));
    return { success: true };
  } catch (err) {
    return { error: "Rejection failed" };
  }
}
export async function getDriveVideos(folderId: string) {
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
  // Drive API se files fetch karna (Sirf MP4 aur videos)
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'video/'&orderBy=name&fields=files(id,name,thumbnailLink)&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error("Drive Fetch Error:", err);
    return [];
  }
}

// Course add karte waqt Folder ID save karne ka action
export async function addDriveCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const folderId = formData.get("folder_id") as string;
  await db.insert(courses).values({ 
    title, 
    drive_folder_id: folderId, 
    category: "Premium" 
  });
  return { success: true };
}
// 🔴 Secure Login Action
export async function loginUser(formData: FormData) {
  "use server";
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const foundUser = await db.select().from(users).where(eq(users.email, email));
    
    if (foundUser.length === 0) {
      return { error: "Yeh account mojood nahi. Pehle Signup karein." };
    }

    const user = foundUser[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { error: "Password ghalat hai!" };
    }

    const cookieStore = await cookies();
    cookieStore.set("user_session", String(user.id), { 
      path: "/", 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 30 
    });

    return { success: true };
  } catch (err: any) {
    console.error("Login Error:", err);
    return { error: "Server masla kar raha hai. Thodi der baad try karein." };
  }
}
