import { pgTable, serial, text, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const providersTable = pgTable("providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  serviceArea: text("service_area").notNull(),
  city: text("city"),
  state: text("state"),
  portfolio: text("portfolio"),
  experience: integer("experience").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  ngoId: integer("ngo_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProviderSchema = createInsertSchema(providersTable).omit({ id: true, createdAt: true });
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providersTable.$inferSelect;
