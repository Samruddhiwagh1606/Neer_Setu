import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schemesTable = pgTable("government_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  subsidy: text("subsidy").notNull(),
  eligibility: text("eligibility").notNull(),
  description: text("description"),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedProvidersTable = pgTable("saved_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  providerId: integer("provider_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSchemeSchema = createInsertSchema(schemesTable).omit({ id: true, createdAt: true });
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemesTable.$inferSelect;
