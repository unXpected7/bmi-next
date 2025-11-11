import { TaskEntity } from "../entities/Task";
import { ITaskRepository } from "../repositories/ITaskRepository";

export interface DeleteTaskRequest {
  id: string;
  userId: string;
}

export interface DeleteTaskResponse {
  success: boolean;
  error?: string;
}

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(request: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    try {
      if (!request.id) {
        return {
          success: false,
          error: "Task ID is required",
        };
      }

      if (!request.userId) {
        return {
          success: false,
          error: "User ID is required",
        };
      }

      const existingTask = await this.taskRepository.findById(request.id);

      if (!existingTask) {
        return {
          success: false,
          error: "Task not found",
        };
      }

      if (existingTask.userId !== request.userId) {
        return {
          success: false,
          error: "Unauthorized to delete this task",
        };
      }

      await this.taskRepository.delete(request.id);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}