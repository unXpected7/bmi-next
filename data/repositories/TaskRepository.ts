import { eq, and, desc, like, count } from "drizzle-orm";
import { db, task } from "../../db";
import { TaskEntity, TaskStatus } from "../../domain/entities/Task";
import {
  ITaskRepository,
  CreateTaskData,
  UpdateTaskData,
  TaskFilter
} from "../../domain/repositories/ITaskRepository";

export class TaskRepository implements ITaskRepository {
  async create(data: CreateTaskData): Promise<TaskEntity> {
    const [newTask] = await db
      .insert(task)
      .values({
        title: data.title,
        description: data.description || null,
        userId: data.userId,
        status: "todo",
      })
      .returning();

    return this.mapToEntity(newTask);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const [taskRecord] = await db
      .select()
      .from(task)
      .where(eq(task.id, id))
      .limit(1);

    return taskRecord ? this.mapToEntity(taskRecord) : null;
  }

  async findByUserId(userId: string, filter?: TaskFilter): Promise<TaskEntity[]> {
    return this.findAll({ userId, ...filter });
  }

  async findAll(filter?: TaskFilter): Promise<TaskEntity[]> {
    let query = db.select().from(task);

    const whereConditions = [];

    if (filter?.userId) {
      whereConditions.push(eq(task.userId, filter.userId));
    }

    if (filter?.status) {
      whereConditions.push(eq(task.status, filter.status));
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    query = query.orderBy(desc(task.createdAt));

    if (filter?.limit) {
      query = query.limit(filter.limit);
    }

    if (filter?.offset) {
      query = query.offset(filter.offset);
    }

    const taskRecords = await query;
    return taskRecords.map(this.mapToEntity);
  }

  async update(id: string, data: UpdateTaskData): Promise<TaskEntity> {
    const updateData: any = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description = data.description || null;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    updateData.updatedAt = new Date();

    const [updatedTask] = await db
      .update(task)
      .set(updateData)
      .where(eq(task.id, id))
      .returning();

    if (!updatedTask) {
      throw new Error("Task not found or update failed");
    }

    return this.mapToEntity(updatedTask);
  }

  async delete(id: string): Promise<void> {
    await db.delete(task).where(eq(task.id, id));
  }

  async count(filter?: TaskFilter): Promise<number> {
    let query = db.select({ count: count() }).from(task);

    const whereConditions = [];

    if (filter?.userId) {
      whereConditions.push(eq(task.userId, filter.userId));
    }

    if (filter?.status) {
      whereConditions.push(eq(task.status, filter.status));
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    const [result] = await query;
    return result?.count || 0;
  }

  private mapToEntity(taskRecord: any): TaskEntity {
    return new TaskEntity(
      taskRecord.id,
      taskRecord.title,
      taskRecord.status as TaskStatus,
      taskRecord.userId,
      taskRecord.description || undefined,
      new Date(taskRecord.createdAt),
      new Date(taskRecord.updatedAt)
    );
  }
}