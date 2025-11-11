import { pgTable, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const TaskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export const task = pgTable("task", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", {
    enum: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]
  }).notNull().default(TaskStatus.TODO),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];