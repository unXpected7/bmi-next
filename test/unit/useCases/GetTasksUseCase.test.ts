import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetTasksUseCase } from "@/domain/useCases/GetTasksUseCase";
import { TaskEntity } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

describe("GetTasksUseCase", () => {
  let getTasksUseCase: GetTasksUseCase;
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

    getTasksUseCase = new GetTasksUseCase(mockTaskRepository);
  });

  it("should get all tasks successfully", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "todo", "user123"),
      new TaskEntity("2", "Task 2", "done", "user123"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(2);

    const result = await getTasksUseCase.execute({});

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(2);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({});
    expect(mockTaskRepository.count).toHaveBeenCalledWith({});
  });

  it("should get tasks filtered by userId", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "todo", "user123"),
      new TaskEntity("2", "Task 2", "in_progress", "user123"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(2);

    const result = await getTasksUseCase.execute({
      userId: "user123",
    });

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(2);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
      userId: "user123",
    });
    expect(mockTaskRepository.count).toHaveBeenCalledWith({
      userId: "user123",
    });
  });

  it("should get tasks filtered by status", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "done", "user123"),
      new TaskEntity("2", "Task 2", "done", "user456"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(2);

    const result = await getTasksUseCase.execute({
      status: "done",
    });

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(2);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
      status: "done",
    });
    expect(mockTaskRepository.count).toHaveBeenCalledWith({
      status: "done",
    });
  });

  it("should get tasks with pagination", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "todo", "user123"),
      new TaskEntity("2", "Task 2", "todo", "user123"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(5);

    const result = await getTasksUseCase.execute({
      limit: 2,
      offset: 0,
    });

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(5);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
      limit: 2,
      offset: 0,
    });
  });

  it("should get tasks with multiple filters", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "todo", "user123"),
      new TaskEntity("2", "Task 2", "todo", "user123"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(2);

    const result = await getTasksUseCase.execute({
      userId: "user123",
      status: "todo",
      limit: 10,
      offset: 0,
    });

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(2);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
      userId: "user123",
      status: "todo",
      limit: 10,
      offset: 0,
    });
  });

  it("should handle repository errors", async () => {
    vi.mocked(mockTaskRepository.findAll).mockRejectedValue(
      new Error("Database error")
    );

    const result = await getTasksUseCase.execute({});

    expect(result.success).toBe(false);
    expect(result.tasks).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.error).toBe("Database error");
  });

  it("should use getTasksByUserId helper method", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "todo", "user123"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(1);

    const result = await getTasksUseCase.getTasksByUserId("user123");

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(1);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
      userId: "user123",
    });
  });

  it("should use getTasksByStatus helper method", async () => {
    const tasks = [
      new TaskEntity("1", "Task 1", "done", "user123"),
    ];

    vi.mocked(mockTaskRepository.findAll).mockResolvedValue(tasks);
    vi.mocked(mockTaskRepository.count).mockResolvedValue(1);

    const result = await getTasksUseCase.getTasksByStatus("done");

    expect(result.success).toBe(true);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(1);
    expect(mockTaskRepository.findAll).toHaveBeenCalledWith({
      status: "done",
    });
  });
});