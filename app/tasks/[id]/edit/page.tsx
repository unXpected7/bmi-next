import { TaskForm } from "../../../../presentation/components/task"
import { getTasks, updateTask } from "../../../../data/server-actions/taskActions"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TaskEntity } from "../../../../domain/entities/Task"

interface EditTaskPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  const tasksResult = await getTasks();

  if (!tasksResult.success) {
    notFound();
  }

  const task = tasksResult.tasks.find(t => t.id === id);

  if (!task) {
    notFound();
  }

  async function handleUpdateTask(data: {
    title: string;
    description?: string;
    status?: string;
  }) {
    "use server"

    const result = await updateTask(id, data);

    if (result.success) {
      redirect("/tasks");
    }

    return result;
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4 py-4 px-4 lg:px-6">
        <Link href="/tasks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:gap-6 px-4 lg:px-6">
        <TaskForm
          task={task}
          onSubmit={handleUpdateTask}
          onCancel={() => redirect("/tasks")}
        />
      </div>
    </div>
  )
}