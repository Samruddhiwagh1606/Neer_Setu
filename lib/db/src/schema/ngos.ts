import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const ngosTable = pgTable("ngos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organizationName: text("organization_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  ngoId: integer("ngo_id").references(() => ngosTable.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetAudience: text("target_audience"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status").notNull().default("planned"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNgoSchema = createInsertSchema(ngosTable).omit({ id: true, createdAt: true });
export type InsertNgo = z.infer<typeof insertNgoSchema>;
export type Ngo = typeof ngosTable.$inferSelect;

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({ id: true, createdAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;
