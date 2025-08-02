// shared/schema.ts
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentLevel: integer("current_level").default(1),
  completedLevels: integer("completed_levels").array().default([]),
  totalScore: integer("total_score").default(0),
  unlockedLevels: integer("unlocked_levels").default(1),
  lastPlayed: timestamp("last_played").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type GameProgress = typeof gameProgress.$inferSelect;
export type NewGameProgress = typeof gameProgress.$inferInsert;