"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface TaskFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  taskCounts?: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  isLoading?: boolean;
}

export function TaskFilter({
  currentFilter,
  onFilterChange,
  taskCounts,
  isLoading = false,
}: TaskFilterProps) {
  const filters = [
    {
      key: "all",
      label: "All Tasks",
      count: taskCounts?.total || 0,
    },
    {
      key: "todo",
      label: "To Do",
      count: taskCounts?.todo || 0,
    },
    {
      key: "in_progress",
      label: "In Progress",
      count: taskCounts?.inProgress || 0,
    },
    {
      key: "done",
      label: "Done",
      count: taskCounts?.done || 0,
    },
  ];

  const getStatusVariant = (filterKey: string) => {
    if (filterKey === currentFilter) {
      switch (filterKey) {
        case "done":
          return "default";
        case "in_progress":
          return "secondary";
        case "todo":
          return "outline";
        default:
          return "default";
      }
    }
    return "outline";
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={currentFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter.key)}
                disabled={isLoading}
                className="gap-2"
              >
                {filter.label}
                <Badge variant={getStatusVariant(filter.key)} className="text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}