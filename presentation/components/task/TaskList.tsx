"use client";

import { useState, useEffect } from "react";
import { TaskEntity } from "@/domain/entities/Task";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TaskFilter } from "./TaskFilter";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TaskListProps {
  initialTasks?: TaskEntity[];
  initialStats?: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

export function TaskList({
  initialTasks = [],
  initialStats = { total: 0, todo: 0, inProgress: 0, done: 0 },
}: TaskListProps) {
  const [tasks, setTasks] = useState<TaskEntity[]>(initialTasks);
  const [stats, setStats] = useState(initialStats);
  const [filteredTasks, setFilteredTasks] = useState<TaskEntity[]>(initialTasks);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskEntity | null>(null);

  useEffect(() => {
    filterTasks(currentFilter);
  }, [tasks, currentFilter]);

  const filterTasks = (filter: string) => {
    let filtered = tasks;

    switch (filter) {
      case "todo":
        filtered = tasks.filter(task => task.status === "todo");
        break;
      case "in_progress":
        filtered = tasks.filter(task => task.status === "in_progress");
        break;
      case "done":
        filtered = tasks.filter(task => task.status === "done");
        break;
      default:
        filtered = tasks;
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleStatusChange = async (taskId: string, newStatus: "todo" | "in_progress" | "done") => {
    setIsLoading(true);
    try {
      const result = await updateTask(taskId, { status: newStatus });

      if (result.success && result.task) {
        setTasks(prev => prev.map(task =>
          task.id === taskId ? result.task! : task
        ));
        toast.success("Task status updated successfully");
      } else {
        toast.error(result.error || "Failed to update task status");
      }
    } catch (error) {
      toast.error("An error occurred while updating task status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task: TaskEntity) => {
    setEditingTask(task);
    setShowCreateForm(false);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteTask(taskId);

      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } catch (error) {
      toast.error("An error occurred while deleting task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: { title: string; description?: string }) => {
    setIsLoading(true);
    try {
      const result = await createTaskFromJSON(data);

      if (result.success && result.task) {
        setTasks(prev => [result.task!, ...prev]);
        setShowCreateForm(false);
        toast.success("Task created successfully");
      } else {
        toast.error(result.error || "Failed to create task");
      }
    } catch (error) {
      toast.error("An error occurred while creating task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: {
    title: string;
    description?: string;
    status?: string
  }) => {
    if (!editingTask) return;

    setIsLoading(true);
    try {
      const result = await updateTask(editingTask.id, data);

      if (result.success && result.task) {
        setTasks(prev => prev.map(task =>
          task.id === editingTask.id ? result.task! : task
        ));
        setEditingTask(null);
        toast.success("Task updated successfully");
      } else {
        toast.error(result.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("An error occurred while updating task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [tasksResult, statsResult] = await Promise.all([
        getTasks(),
        getTaskStats(),
      ]);

      if (tasksResult.success) {
        setTasks(tasksResult.tasks);
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      toast.success("Tasks refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh tasks");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };

  if (showCreateForm || editingTask) {
    return (
      <TaskForm
        task={editingTask || undefined}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <TaskFilter
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        taskCounts={stats}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        {isLoading && filteredTasks.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {currentFilter === "all"
                ? "No tasks yet. Create your first task!"
                : `No tasks with status "${currentFilter.replace("_", " ")}"`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Import server actions
async function createTaskFromJSON(data: { title: string; description?: string }) {
  const module = await import("@/data/server-actions/taskActions");
  return module.createTaskFromJSON(data);
}

async function getTasks() {
  const module = await import("@/data/server-actions/taskActions");
  return module.getTasks();
}

async function updateTask(id: string, data: any) {
  const module = await import("@/data/server-actions/taskActions");
  return module.updateTask(id, data);
}

async function deleteTask(id: string) {
  const module = await import("@/data/server-actions/taskActions");
  return module.deleteTask(id);
}

async function getTaskStats() {
  const module = await import("@/data/server-actions/taskActions");
  return module.getTaskStats();
}