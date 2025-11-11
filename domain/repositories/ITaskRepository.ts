import { TaskEntity, TaskStatus } from "../entities/Task";

export interface CreateTaskData {
  title: string;
  description?: string;
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskFilter {
  status?: TaskStatus;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<TaskEntity>;

  findById(id: string): Promise<TaskEntity | null>;

  findByUserId(userId: string, filter?: TaskFilter): Promise<TaskEntity[]>;

  findAll(filter?: TaskFilter): Promise<TaskEntity[]>;

  update(id: string, data: UpdateTaskData): Promise<TaskEntity>;

  delete(id: string): Promise<void>;

  count(filter?: TaskFilter): Promise<number>;
}