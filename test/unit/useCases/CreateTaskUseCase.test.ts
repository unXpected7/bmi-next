import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTaskUseCase } from "@/domain/useCases/CreateTaskUseCase";
import { TaskEntity } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

describe("CreateTaskUseCase", () => {
  let createTaskUseCase: CreateTaskUseCase;
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

    createTaskUseCase = new CreateTaskUseCase(mockTaskRepository);
  });

  it("should create a task successfully with valid data", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      userId: "user123",
    };

    const expectedTask = new TaskEntity(
      "task123",
      "Test Task",
      "todo",
      "user123",
      "Test Description"
    );

    vi.mocked(mockTaskRepository.create).mockResolvedValue(expectedTask);

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(true);
    expect(result.task).toEqual(expectedTask);
    expect(mockTaskRepository.create).toHaveBeenCalledWith({
      title: "Test Task",
      description: "Test Description",
      userId: "user123",
    });
  });

  it("should create a task without description", async () => {
    const taskData = {
      title: "Test Task",
      userId: "user123",
    };

    const expectedTask = new TaskEntity("task123", "Test Task", "todo", "user123");

    vi.mocked(mockTaskRepository.create).mockResolvedValue(expectedTask);

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(true);
    expect(result.task).toEqual(expectedTask);
    expect(mockTaskRepository.create).toHaveBeenCalledWith({
      title: "Test Task",
      description: undefined,
      userId: "user123",
    });
  });

  it("should return error when userId is missing", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
    } as any;

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("User ID is required");
    expect(mockTaskRepository.create).not.toHaveBeenCalled();
  });

  it("should return error when title is empty", async () => {
    const taskData = {
      title: "",
      description: "Test Description",
      userId: "user123",
    };

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task title is required");
    expect(mockTaskRepository.create).not.toHaveBeenCalled();
  });

  it("should return error when title is only whitespace", async () => {
    const taskData = {
      title: "   ",
      description: "Test Description",
      userId: "user123",
    };

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task title is required");
    expect(mockTaskRepository.create).not.toHaveBeenCalled();
  });

  it("should return error when title exceeds 255 characters", async () => {
    const taskData = {
      title: "a".repeat(256),
      description: "Test Description",
      userId: "user123",
    };

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Task title cannot exceed 255 characters");
    expect(mockTaskRepository.create).not.toHaveBeenCalled();
  });

  it("should handle repository errors", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      userId: "user123",
    };

    vi.mocked(mockTaskRepository.create).mockRejectedValue(
      new Error("Database error")
    );

    const result = await createTaskUseCase.execute(taskData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Database error");
  });
});