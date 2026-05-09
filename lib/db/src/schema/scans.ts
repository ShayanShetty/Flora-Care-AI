import { pgTable, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scansTable = pgTable("scans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  imageUrl: text("image_url").notNull(),
  plantName: text("plant_name").notNull(),
  diseaseName: text("disease_name").notNull(),
  confidence: real("confidence").notNull(),
  isHealthy: boolean("is_healthy").notNull().default(false),
  description: text("description").notNull().default(""),
  symptoms: text("symptoms"),
  treatment: text("treatment"),
  prevention: text("prevention"),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
});

export const insertScanSchema = createInsertSchema(scansTable).omit({ scannedAt: true });
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scansTable.$inferSelect;
