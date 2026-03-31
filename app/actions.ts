"use server";

import { db } from "../lib/db";
import { users } from "../lib/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

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

    // Password ko encrypt (hide) karna taake hack na ho
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
