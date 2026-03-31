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
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}
