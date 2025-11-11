import { TaskForm } from "../../../presentation/components/task"
import { createTaskFromJSON } from "../../../data/server-actions/taskActions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewTaskPage() {
  async function handleCreateTask(data: { title: string; description?: string }) {
    "use server"

    const result = await createTaskFromJSON(data);

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
          onSubmit={handleCreateTask}
          onCancel={() => redirect("/tasks")}
        />
      </div>
    </div>
  )
}