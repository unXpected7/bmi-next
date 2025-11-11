"use server";

import { CreateTaskUseCase, GetTasksUseCase, UpdateTaskUseCase, DeleteTaskUseCase } from "../../domain/useCases";
import { TaskRepository } from "../repositories/TaskRepository";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";

const taskRepository = new TaskRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTasksUseCase = new GetTasksUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

export async function createTask(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const result = await createTaskUseCase.execute({
      title,
      description: description || undefined,
      userId: session.user.id,
    });

    return result;
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

export async function createTaskFromJSON(data: { title: string; description?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await createTaskUseCase.execute({
      title: data.title,
      description: data.description,
      userId: session.user.id,
    });

    return result;
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

export async function getTasks(filter?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
        tasks: [],
        total: 0,
      };
    }

    const result = await getTasksUseCase.execute({
      userId: session.user.id,
      status: filter?.status as any,
      limit: filter?.limit,
      offset: filter?.offset,
    });

    return result;
  } catch (error) {
    console.error("Error getting tasks:", error);
    return {
      success: false,
      error: "Internal server error",
      tasks: [],
      total: 0,
    };
  }
}

export async function updateTask(id: string, data: {
  title?: string;
  description?: string;
  status?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await updateTaskUseCase.execute({
      id,
      userId: session.user.id,
      title: data.title,
      description: data.description,
      status: data.status as any,
    });

    return result;
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

export async function deleteTask(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const result = await deleteTaskUseCase.execute({
      id,
      userId: session.user.id,
    });

    return result;
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

export async function getTaskStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
        stats: null,
      };
    }

    const [allTasks, todoTasks, inProgressTasks, doneTasks] = await Promise.all([
      getTasksUseCase.execute({ userId: session.user.id }),
      getTasksUseCase.execute({ userId: session.user.id, status: "todo" }),
      getTasksUseCase.execute({ userId: session.user.id, status: "in_progress" }),
      getTasksUseCase.execute({ userId: session.user.id, status: "done" }),
    ]);

    return {
      success: true,
      stats: {
        total: allTasks.total,
        todo: todoTasks.total,
        inProgress: inProgressTasks.total,
        done: doneTasks.total,
      },
    };
  } catch (error) {
    console.error("Error getting task stats:", error);
    return {
      success: false,
      error: "Internal server error",
      stats: null,
    };
  }
}