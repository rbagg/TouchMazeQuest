// server/storage.ts
import { db } from './db';
import { users, gameProgress, type User, type NewUser, type GameProgress, type NewGameProgress } from '../shared/schema';
import { eq } from 'drizzle-orm';

export const storage = {
  // User operations
  async createUser(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  },

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  },

  // Game progress operations
  async createGameProgress(progressData: NewGameProgress): Promise<GameProgress> {
    const [progress] = await db.insert(gameProgress).values(progressData).returning();
    return progress;
  },

  async getGameProgress(userId: number): Promise<GameProgress | null> {
    const [progress] = await db.select().from(gameProgress).where(eq(gameProgress.userId, userId));
    return progress || null;
  },

  async updateGameProgress(userId: number, updates: Partial<NewGameProgress>): Promise<GameProgress> {
    const [progress] = await db.update(gameProgress)
      .set({ ...updates, lastPlayed: new Date() })
      .where(eq(gameProgress.userId, userId))
      .returning();
    return progress;
  },

  async getOrCreateGameProgress(userId: number): Promise<GameProgress> {
    let progress = await this.getGameProgress(userId);
    
    if (!progress) {
      progress = await this.createGameProgress({ userId });
    }
    
    return progress;
  }
};