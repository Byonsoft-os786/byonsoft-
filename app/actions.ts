"use server";

import { db } from "../lib/db";
import { users } from "../lib/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function signUpUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password || !whatsapp) {
      return { error: "Tamam fields zaroori hain!" };
    }

    // Check karein ke email pehle se toh nahi bani hui
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return { error: "Yeh email pehle se registered hai! Koi aur use karein." };
    }

    // Password ko encrypt (hide) karna
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database mein user save karna
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      whatsapp,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Signup Error:", err);
    return { error: "Database se connect nahi ho paya. Thodi der baad try karein." };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email aur Password dono zaroori hain!" };
    }

    // Database mein user dhoondna
    const existingUsers = await db.select().from(users).where(eq(users.email, email));
    const user = existingUsers[0];

    if (!user) {
      return { error: "Yeh account mojood nahi. Pehle Signup karein." };
    }

    // Password check karna
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Password ghalat hai!" };
    }

    // 🔴 FIX: Next.js 15 ke liye 'await cookies()' use kiya hai
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
// (Upar apka signUpUser aur loginUser likha hoga, uske neechay yeh paste karein)

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}
// (Upar apka purana code signup, login, logout wala mojood rahega)

import Groq from "groq-sdk";

export async function generateRoadmap(formData: FormData) {
  try {
    const userPrompt = formData.get("prompt") as string;
    
    if (!userPrompt) {
      return { error: "Bhai, kuch likh kar toh batao!" };
    }

    // 🔥 ADVANCED KEY ROTATION SYSTEM 🔥
    // System Vercel se sari keys uthayega aur jo khali hongi unko nikal dega
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

    // Randomly 7 mein se 1 key select karna taake load balance ho
    const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const groq = new Groq({ apiKey: randomKey });

    // AI ko instruction (System Prompt)
    const systemInstruction = `You are an elite AI Career Architect for Byonsoft Academy. 
    The user's goal is to reach 100,000 PKR monthly profit by April. 
    Write a highly actionable, aggressive, and direct 30-day roadmap based on their input. 
    Use Roman Urdu mixed with simple English. Keep it punchy, no fluff. Give 3 clear bullet points for the next 7 days.`;

    // Groq AI se jawab mangwana (Llama 3 model use kar rahe hain jo fast hai)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "AI ne jawab nahi diya. Dobara try karein.";

    return { success: true, roadmap: aiResponse };

  } catch (err: any) {
    console.error("AI Error:", err);
    return { error: "AI Engine is waqt overload hai. Thodi der baad try karein." };
  }
}
