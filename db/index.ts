import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from './schema/auth';
import * as taskSchema from './schema/task';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...taskSchema }
});

export * from './schema/auth';
export * from './schema/task';