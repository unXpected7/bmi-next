import { TaskList } from "../../presentation/components/task"
import { getTasks, getTaskStats } from "../../data/server-actions/taskActions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default async function TasksPage() {
  const [tasksResult, statsResult] = await Promise.all([
    getTasks(),
    getTaskStats(),
  ]);

  const initialTasks = tasksResult.success ? tasksResult.tasks : [];
  const initialStats = statsResult.success ? statsResult.stats : {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4 py-4 px-4 lg:px-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:gap-6 px-4 lg:px-6">
        <TaskList
          initialTasks={initialTasks}
          initialStats={initialStats}
        />
      </div>
    </div>
  )
}