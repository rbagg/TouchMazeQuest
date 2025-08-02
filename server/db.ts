// server/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the connection
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
});

// Create the database instance
export const db = drizzle(client, { schema });

export type Database = typeof db;