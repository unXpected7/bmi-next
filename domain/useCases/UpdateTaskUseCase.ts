import { TaskEntity, TaskStatus } from "../entities/Task";
import { ITaskRepository } from "../repositories/ITaskRepository";

export interface UpdateTaskRequest {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskResponse {
  task?: TaskEntity;
  success: boolean;
  error?: string;
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(request: UpdateTaskRequest): Promise<UpdateTaskResponse> {
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
          error: "Unauthorized to update this task",
        };
      }

      if (request.title !== undefined) {
        if (!request.title || request.title.trim().length === 0) {
          return {
            success: false,
            error: "Task title cannot be empty",
          };
        }

        if (request.title.length > 255) {
          return {
            success: false,
            error: "Task title cannot exceed 255 characters",
          };
        }

        existingTask.updateTitle(request.title);
      }

      if (request.description !== undefined) {
        existingTask.updateDescription(request.description);
      }

      if (request.status !== undefined) {
        if (!["todo", "in_progress", "done"].includes(request.status)) {
          return {
            success: false,
            error: "Invalid task status",
          };
        }

        existingTask.updateStatus(request.status);
      }

      const updatedTask = await this.taskRepository.update(request.id, {
        title: existingTask.title,
        description: existingTask.description,
        status: existingTask.status,
      });

      return {
        success: true,
        task: updatedTask,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}