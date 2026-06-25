"use client";

import { useState } from 'react';
import { ProjectStatuses } from '@/types/project';
import { Loader2, MoreVertical, Calendar } from 'lucide-react';

export default function KanbanBoard({ projects, onStatusUpdate }: { projects: any[], onStatusUpdate: (id: string, status: string) => void }) {
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const columns = ProjectStatuses.filter(s => s !== 'Cancelled' && s !== 'On Hold');

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.setData('text/plain', projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    if (!projectId || projectId === draggedProject) return;

    setUpdating(projectId);
    await onStatusUpdate(projectId, status);
    setUpdating(null);
    setDraggedProject(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar min-h-[500px]">
      {columns.map(status => (
        <div 
          key={status}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
          className="flex-shrink-0 w-80 bg-black/20 border border-white/5 rounded-xl flex flex-col"
        >
          <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-gray-300">{status}</h3>
            <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full text-gray-400">
              {projects.filter(p => p.status === status).length}
            </span>
          </div>

          <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
            {projects.filter(p => p.status === status).map(project => (
              <div
                key={project._id}
                draggable
                onDragStart={(e) => handleDragStart(e, project._id)}
                className="bg-card border border-white/10 p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{project.projectId}</div>
                  {updating === project._id ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <button className="text-gray-500 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                  )}
                </div>
                <h4 className="font-bold text-white text-sm leading-tight mb-1">{project.name}</h4>
                <div className="text-xs text-gray-400 mb-3 truncate">{project.clientCompany}</div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  {/* Avatar stack simulation */}
                  <div className="flex -space-x-2">
                    {project.assignedEmployees?.slice(0, 3).map((e: any, i: number) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-[#111] flex items-center justify-center text-[10px] text-white font-bold">
                        {e.employeeId?.firstName?.charAt(0)}{e.employeeId?.lastName?.charAt(0)}
                      </div>
                    ))}
                    {project.assignedEmployees?.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#111] flex items-center justify-center text-[10px] text-white">
                        +{project.assignedEmployees.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects.filter(p => p.status === status).length === 0 && (
              <div className="text-center py-8 text-xs text-gray-600 border-2 border-dashed border-white/5 rounded-lg m-2">
                Drop projects here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
