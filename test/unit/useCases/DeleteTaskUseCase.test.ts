import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteTaskUseCase } from "@/domain/useCases/DeleteTaskUseCase";
import { TaskEntity } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

describe("DeleteTaskUseCase", () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let mockTaskRepository: ITaskRepository;

  beforeEach(() => {
    mockTaskRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    } as ITaskRepository;

    deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);
  });

  it("should delete task successfully with valid data", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Test Task",
      "todo",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);
    vi.mocked(mockTaskRepository.delete).mockResolvedValue(undefined);

    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task123");
    expect(mockTaskRepository.delete).toHaveBeenCalledWith("task123");
  });

  it("should return error when task ID is missing", async () => {
    const result = await deleteTaskUseCase.execute({
      id: "",
      userId: "user123",
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task ID is required");
    expect(mockTaskRepository.findById).not.toHaveBeenCalled();
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });

  it("should return error when user ID is missing", async () => {
    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "",
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe("User ID is required");
    expect(mockTaskRepository.findById).not.toHaveBeenCalled();
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });

  it("should return error when task is not found", async () => {
    vi.mocked(mockTaskRepository.findById).mockResolvedValue(null);

    const result = await deleteTaskUseCase.execute({
      id: "nonexistent",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task not found");
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("nonexistent");
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });

  it("should return error when user is not authorized", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Test Task",
      "todo",
      "differentUser"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);

    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized to delete this task");
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task123");
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });

  it("should handle repository errors during findById", async () => {
    vi.mocked(mockTaskRepository.findById).mockRejectedValue(
      new Error("Database connection error")
    );

    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Database connection error");
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });

  it("should handle repository errors during delete", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Test Task",
      "todo",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);
    vi.mocked(mockTaskRepository.delete).mockRejectedValue(
      new Error("Delete operation failed")
    );

    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Delete operation failed");
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task123");
    expect(mockTaskRepository.delete).toHaveBeenCalledWith("task123");
  });

  it("should allow owner to delete their task", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Test Task",
      "in_progress",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);
    vi.mocked(mockTaskRepository.delete).mockResolvedValue(undefined);

    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(true);
    expect(mockTaskRepository.delete).toHaveBeenCalledWith("task123");
  });

  it("should not allow deletion of tasks with different userId", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Test Task",
      "todo",
      "user456"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);

    const result = await deleteTaskUseCase.execute({
      id: "task123",
      userId: "user789",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized to delete this task");
    expect(mockTaskRepository.delete).not.toHaveBeenCalled();
  });
});