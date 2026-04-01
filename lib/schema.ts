import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  whatsapp: text("whatsapp"),
  skill: text("skill"), 
  is_premium: boolean("is_premium").default(false),
  payment_status: text("payment_status").default("unpaid"),
  tid: text("tid"),
  screenshot: text("screenshot"),
  role: text("role").default("user"), // 🔴 Naya Column
  subscription_expiry_date: timestamp("subscription_expiry_date"), // 🔴 Naya Column
  referral_bonus_count: integer("referral_bonus_count").default(0), // 🔴 Naya Column
  referral_code: text("referral_code").unique(),
  referred_by: integer("referred_by"),
  created_at: timestamp("created_at").defaultNow(),
});

// Coupons Table (Optional: Agar aapne SQL mein create ki hai)
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  coupon_code: text("coupon_code").notNull().unique(),
  custom_price: integer("custom_price").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  drive_folder_id: text("drive_folder_id"), // 🔴 Naya Column
  category: text("category"),
  is_premium: boolean("is_premium").default(true),
  created_at: timestamp("created_at").defaultNow(),
});
