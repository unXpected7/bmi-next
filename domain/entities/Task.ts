export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskEntity implements Task {
  constructor(
    public id: string,
    public title: string,
    public status: TaskStatus = "todo",
    public userId: string,
    public description?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(title: string, userId: string, description?: string): TaskEntity {
    if (!title || title.trim().length === 0) {
      throw new Error("Task title is required");
    }

    if (title.length > 255) {
      throw new Error("Task title cannot exceed 255 characters");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    return new TaskEntity(
      crypto.randomUUID(),
      title.trim(),
      "todo",
      userId,
      description?.trim()
    );
  }

  updateTitle(newTitle: string): void {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("Task title is required");
    }

    if (newTitle.length > 255) {
      throw new Error("Task title cannot exceed 255 characters");
    }

    this.title = newTitle.trim();
    this.updatedAt = new Date();
  }

  updateDescription(newDescription?: string): void {
    this.description = newDescription?.trim();
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: TaskStatus): void {
    if (!["todo", "in_progress", "done"].includes(newStatus)) {
      throw new Error("Invalid task status");
    }

    if (this.status === newStatus) {
      return;
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  markAsInProgress(): void {
    this.updateStatus("in_progress");
  }

  markAsDone(): void {
    this.updateStatus("done");
  }

  markAsTodo(): void {
    this.updateStatus("todo");
  }

  isCompleted(): boolean {
    return this.status === "done";
  }

  isInProgress(): boolean {
    return this.status === "in_progress";
  }

  isTodo(): boolean {
    return this.status === "todo";
  }

  belongsTo(userId: string): boolean {
    return this.userId === userId;
  }

  toJSON(): Task {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}