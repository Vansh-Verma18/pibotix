"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Clock, Play, Square, Loader2, CheckCircle, ListTodo, Paperclip, MessageSquare 
} from "lucide-react";
import Link from "next/link";

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerActionLoading, setTimerActionLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/tasks/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setTask(data.task);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [params.id]);

  const handleTimer = async (action: 'start' | 'stop') => {
    setTimerActionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${params.id}/timer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        setTimerRunning(action === 'start');
        if (action === 'stop') {
          // Timer stopped, refresh task to get updated actualHours
          fetchTask();
        }
      } else {
        alert(data.error || "Failed to toggle timer");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server");
    } finally {
      setTimerActionLoading(false);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${params.id}/subtask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSubtask })
      });
      if (res.ok) {
        setNewSubtask("");
        fetchTask();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${params.id}/subtask`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtaskId, isCompleted: !currentStatus })
      });
      if (res.ok) {
        fetchTask();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/tasks/${params.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment })
      });
      if (res.ok) {
        setNewComment("");
        fetchTask();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!task) return <div className="p-20 text-center text-white">Task not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tasks" className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold px-2 py-1 bg-white/10 text-gray-300 rounded-md">
              {task.taskId}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {task.priority} Priority
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{task.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Description</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Subtasks */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-primary" /> Subtasks
              </h2>
            </div>
            
            <form onSubmit={handleAddSubtask} className="flex gap-2 mb-4">
              <input 
                type="text"
                placeholder="Add new subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary text-sm"
              />
              <button disabled={actionLoading || !newSubtask.trim()} type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                Add
              </button>
            </form>

            {task.subtasks?.length > 0 ? (
              <div className="space-y-2">
                 {task.subtasks.map((st: any) => (
                   <div key={st._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 transition-colors hover:bg-white/10 cursor-pointer" onClick={() => handleToggleSubtask(st._id, st.isCompleted)}>
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${st.isCompleted ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                       {st.isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                     </div>
                     <span className={`text-sm ${st.isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{st.title}</span>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-white/10 rounded-lg">No subtasks created.</div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Comments & Activity
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {task.comments?.length > 0 ? (
                task.comments.map((comment: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold text-xs mt-1">
                      U
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-white text-sm">User</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">No comments yet.</div>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input 
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary text-sm"
              />
              <button disabled={actionLoading || !newComment.trim()} type="submit" className="px-5 py-2 bg-primary hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                Post
              </button>
            </form>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Time Tracker Widget */}
          <div className="bg-[#111] border border-primary/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.1)]">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Time Tracker
            </h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-mono font-bold text-white mb-1">
                {task.actualHours.toFixed(2)}<span className="text-xl text-gray-500">h</span>
              </div>
              <div className="text-xs text-gray-500">Logged Time</div>
            </div>
            
            {timerRunning ? (
              <button 
                onClick={() => handleTimer('stop')}
                disabled={timerActionLoading}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
              >
                {timerActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Square className="w-4 h-4 fill-current" /> Stop Timer</>}
              </button>
            ) : (
              <button 
                onClick={() => handleTimer('start')}
                disabled={timerActionLoading || task.status === 'Completed'}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {timerActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-4 h-4 fill-current" /> Start Timer</>}
              </button>
            )}
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-gray-400">
              <span>Estimated: {task.estimatedHours}h</span>
              <span className={task.actualHours > task.estimatedHours ? "text-red-400" : "text-green-400"}>
                {task.estimatedHours > 0 ? `${Math.round((task.actualHours / task.estimatedHours) * 100)}% Used` : 'No Estimate'}
              </span>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Project</div>
              <div className="text-sm font-medium text-white">{task.projectId?.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="text-sm font-medium text-white">{task.status}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Assigned To</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {task.assignedEmployee?.firstName?.[0]}
                </div>
                <span className="text-sm font-medium text-white">
                  {task.assignedEmployee?.firstName} {task.assignedEmployee?.lastName}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Due Date</div>
              <div className="text-sm font-medium text-white">
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
