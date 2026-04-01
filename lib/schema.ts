import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  whatsapp: text("whatsapp"),
  skill: text("skill"), 
  is_premium: boolean("is_premium").default(false),
  referral_code: text("referral_code").unique(),
  referred_by: integer("referred_by"),
  created_at: timestamp("created_at").defaultNow(),
});
