import { TaskList } from "../../presentation/components/task"
import { getTasks, getTaskStats } from "../../data/server-actions/taskActions"

export default async function Page() {
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
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <TaskList
          initialTasks={initialTasks}
          initialStats={initialStats}
        />
      </div>
    </div>
  )
}