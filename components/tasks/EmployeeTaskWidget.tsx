"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, LayoutGrid, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EmployeeTaskWidget() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks") // Our API filters by Employee if the role is employee
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTasks(data.tasks.filter((t: any) => t.status !== 'Completed'));
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-white/10 p-6 rounded-2xl flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-white/10 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-primary" /> My Active Tasks
        </h3>
        <Link href="/admin/tasks" className="text-xs text-primary hover:underline">
          View Kanban
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-6 border border-dashed border-white/10 rounded-xl">
            No active tasks. You're all caught up!
          </div>
        ) : tasks.slice(0, 5).map(task => (
          <Link key={task._id} href={`/admin/tasks/${task._id}`}>
            <div className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  task.priority === 'High' ? 'bg-orange-500' :
                  task.priority === 'Medium' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors">{task.name}</h4>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{task.projectId?.name || "No Project"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium px-2 py-1 bg-white/10 rounded-md text-gray-300 whitespace-nowrap">
                {task.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
