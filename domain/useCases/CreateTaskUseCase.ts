import { TaskEntity } from "../entities/Task";
import { ITaskRepository } from "../repositories/ITaskRepository";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  userId: string;
}

export interface CreateTaskResponse {
  task: TaskEntity;
  success: boolean;
  error?: string;
}

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    try {
      if (!request.userId) {
        return {
          success: false,
          error: "User ID is required",
        };
      }

      if (!request.title || request.title.trim().length === 0) {
        return {
          success: false,
          error: "Task title is required",
        };
      }

      if (request.title.length > 255) {
        return {
          success: false,
          error: "Task title cannot exceed 255 characters",
        };
      }

      const task = TaskEntity.create(
        request.title,
        request.userId,
        request.description
      );

      const createdTask = await this.taskRepository.create({
        title: task.title,
        description: task.description,
        userId: task.userId,
      });

      return {
        success: true,
        task: createdTask,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}