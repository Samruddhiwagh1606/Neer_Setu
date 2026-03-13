import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { providersTable } from "./providers";

export const serviceRequestsTable = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  providerId: integer("provider_id").references(() => providersTable.id),
  requestType: text("request_type").notNull(),
  systemType: text("system_type").notNull(),
  location: text("location").notNull(),
  preferredDate: text("preferred_date"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  rating: integer("rating"),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequestsTable).omit({ id: true, createdAt: true });
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequestsTable.$inferSelect;
