"use client";

import { useState } from "react";
import { Clock, MessageSquare, Paperclip, MoreVertical, AlertCircle } from "lucide-react";
import Link from "next/link";

interface KanbanBoardProps {
  tasks: any[];
  onStatusUpdate: (taskId: string, newStatus: string) => void;
}

export default function TaskKanbanBoard({ tasks, onStatusUpdate }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns = [
    { id: 'Backlog', label: 'Backlog', color: 'border-gray-500' },
    { id: 'To Do', label: 'To Do', color: 'border-blue-500' },
    { id: 'In Progress', label: 'In Progress', color: 'border-yellow-500' },
    { id: 'Testing', label: 'Testing', color: 'border-purple-500' },
    { id: 'Under Review', label: 'Under Review', color: 'border-orange-500' },
    { id: 'Completed', label: 'Completed', color: 'border-green-500' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTaskId) {
      onStatusUpdate(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  const getPriorityColor = (prio: string) => {
    switch(prio) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
      {columns.map(col => (
        <div 
          key={col.id}
          className="min-w-[320px] w-[320px] bg-card border border-white/5 rounded-2xl flex flex-col snap-start"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className={`p-4 border-b-2 ${col.color} flex justify-between items-center bg-white/[0.02] rounded-t-2xl`}>
            <h3 className="font-bold text-white text-sm">{col.label}</h3>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
              {tasks.filter(t => t.status === col.id).length}
            </span>
          </div>
          
          <div className="p-3 flex-1 flex flex-col gap-3 min-h-[500px]">
            {tasks.filter(t => t.status === col.id).map(task => (
              <div 
                key={task._id}
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
                className={`bg-[#111] p-4 rounded-xl border border-white/10 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all ${draggedTaskId === task._id ? 'opacity-50' : 'opacity-100'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getPriorityColor(task.priority)} uppercase tracking-wider`}>
                    {task.priority}
                  </span>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/admin/tasks/${task._id}`}>
                  <h4 className="text-white font-medium mb-1 hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {task.name}
                  </h4>
                </Link>
                
                <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                  {task.projectId?.name || "Unknown Project"}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold" title={`${task.assignedEmployee?.firstName} ${task.assignedEmployee?.lastName}`}>
                      {task.assignedEmployee?.firstName?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    {task.actualHours > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-yellow-500/70" /> {task.actualHours.toFixed(1)}h
                      </span>
                    )}
                    {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === col.id).length === 0 && (
              <div className="h-full border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-gray-600 text-sm">
                Drop tasks here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
