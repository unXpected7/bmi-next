"use client";

import { TaskEntity } from "@/domain/entities/Task";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskEntity;
  onStatusChange: (taskId: string, newStatus: "todo" | "in_progress" | "done") => void;
  onEdit: (task: TaskEntity) => void;
  onDelete: (taskId: string) => void;
  isLoading?: boolean;
}

export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isLoading = false,
}: TaskCardProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "done":
        return "default";
      case "in_progress":
        return "secondary";
      case "todo":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "todo":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const handleStatusChange = (newStatus: "todo" | "in_progress" | "done") => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold text-lg",
            task.status === "done" && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={getStatusBadgeVariant(task.status)}
            className={cn("min-w-[100px]", getStatusColor(task.status))}
          >
            {task.status.replace("_", " ").toUpperCase()}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("todo")}
                disabled={task.status === "todo"}
              >
                Mark as Todo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("in_progress")}
                disabled={task.status === "in_progress"}
              >
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("done")}
                disabled={task.status === "done"}
              >
                Mark as Done
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {task.description}
          </p>
        )}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}