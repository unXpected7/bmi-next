import { TaskEntity, TaskStatus } from "../entities/Task";
import { ITaskRepository, TaskFilter } from "../repositories/ITaskRepository";

export interface GetTasksRequest {
  userId?: string;
  status?: TaskStatus;
  limit?: number;
  offset?: number;
}

export interface GetTasksResponse {
  tasks: TaskEntity[];
  total: number;
  success: boolean;
  error?: string;
}

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(request: GetTasksRequest): Promise<GetTasksResponse> {
    try {
      const filter: TaskFilter = {
        userId: request.userId,
        status: request.status,
        limit: request.limit,
        offset: request.offset,
      };

      const tasks = await this.taskRepository.findAll(filter);
      const total = await this.taskRepository.count(filter);

      return {
        success: true,
        tasks,
        total,
      };
    } catch (error) {
      return {
        success: false,
        tasks: [],
        total: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getTasksByUserId(userId: string, filter?: Omit<TaskFilter, "userId">): Promise<GetTasksResponse> {
    return this.execute({ userId, ...filter });
  }

  async getTasksByStatus(status: TaskStatus, filter?: Omit<TaskFilter, "status">): Promise<GetTasksResponse> {
    return this.execute({ status, ...filter });
  }
}