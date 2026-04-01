import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

// 1. Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  whatsapp: text("whatsapp"),
  skill: text("skill"), 
  is_premium: boolean("is_premium").default(false),
  subscription_status: boolean("subscription_status").default(false),
  payment_status: text("payment_status").default("unpaid"),
  tid: text("tid"),
  screenshot: text("screenshot"),
  role: text("role").default("user"),
  referral_code: text("referral_code").unique(),
  referred_by: integer("referred_by"),
  created_at: timestamp("created_at").defaultNow(),
});

// 2. Courses Table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  video_url: text("video_url"),
  drive_folder_id: text("drive_folder_id"),
  category: text("category"),
  is_premium: boolean("is_premium").default(true),
  tags: text("tags"),
  created_at: timestamp("created_at").defaultNow(),
});

// 3. Payment Settings Table (Yahi Missing Tha!)
export const payment_settings = pgTable("payment_settings", {
  id: serial("id").primaryKey(),
  method_name: text("method_name").notNull(),
  account_title: text("account_title"),
  account_number: text("account_number"),
  account_details: text("account_details"),
  is_active: boolean("is_active").default(true),
});

// 4. Coupons Table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  coupon_code: text("coupon_code").notNull().unique(),
  custom_price: integer("custom_price").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});
