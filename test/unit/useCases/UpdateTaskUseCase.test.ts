import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTaskUseCase } from "@/domain/useCases/UpdateTaskUseCase";
import { TaskEntity } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

describe("UpdateTaskUseCase", () => {
  let updateTaskUseCase: UpdateTaskUseCase;
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

    updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);
  });

  it("should update task successfully with valid data", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Original Title",
      "todo",
      "user123",
      "Original Description"
    );

    const updatedTask = new TaskEntity(
      "task123",
      "Updated Title",
      "in_progress",
      "user123",
      "Updated Description"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);
    vi.mocked(mockTaskRepository.update).mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
      title: "Updated Title",
      description: "Updated Description",
      status: "in_progress",
    });

    expect(result.success).toBe(true);
    expect(result.task).toEqual(updatedTask);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task123");
    expect(mockTaskRepository.update).toHaveBeenCalledWith("task123", {
      title: "Updated Title",
      description: "Updated Description",
      status: "in_progress",
    });
  });

  it("should update only title", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Original Title",
      "todo",
      "user123"
    );

    const updatedTask = new TaskEntity(
      "task123",
      "New Title",
      "todo",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);
    vi.mocked(mockTaskRepository.update).mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
      title: "New Title",
    });

    expect(result.success).toBe(true);
    expect(result.task).toEqual(updatedTask);
    expect(mockTaskRepository.update).toHaveBeenCalledWith("task123", {
      title: "New Title",
      description: undefined,
      status: "todo",
    });
  });

  it("should return error when task ID is missing", async () => {
    const result = await updateTaskUseCase.execute({
      id: "",
      userId: "user123",
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task ID is required");
    expect(mockTaskRepository.findById).not.toHaveBeenCalled();
  });

  it("should return error when user ID is missing", async () => {
    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "",
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe("User ID is required");
    expect(mockTaskRepository.findById).not.toHaveBeenCalled();
  });

  it("should return error when task is not found", async () => {
    vi.mocked(mockTaskRepository.findById).mockResolvedValue(null);

    const result = await updateTaskUseCase.execute({
      id: "nonexistent",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task not found");
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("nonexistent");
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it("should return error when user is not authorized", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Original Title",
      "todo",
      "differentUser"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized to update this task");
    expect(mockTaskRepository.findById).toHaveBeenCalledWith("task123");
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it("should return error when title is empty", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Original Title",
      "todo",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
      title: "",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task title cannot be empty");
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it("should return error when title exceeds 255 characters", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Original Title",
      "todo",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
      title: "a".repeat(256),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task title cannot exceed 255 characters");
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it("should return error when status is invalid", async () => {
    const existingTask = new TaskEntity(
      "task123",
      "Original Title",
      "todo",
      "user123"
    );

    vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask);

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
      status: "invalid" as any,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid task status");
    expect(mockTaskRepository.update).not.toHaveBeenCalled();
  });

  it("should handle repository errors", async () => {
    vi.mocked(mockTaskRepository.findById).mockRejectedValue(
      new Error("Database error")
    );

    const result = await updateTaskUseCase.execute({
      id: "task123",
      userId: "user123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Database error");
  });
});