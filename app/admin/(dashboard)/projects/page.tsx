"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, LayoutGrid, KanbanSquare, Calendar, Filter, Target, Clock, CheckCircle } from "lucide-react";
import KanbanBoard from "@/components/pm/KanbanBoard";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'kanban'>('kanban');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleStatusUpdate = async (projectId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Update local state optimistically
        setProjects(projects.map(p => p._id === projectId ? { ...p, status: newStatus } : p));
      }
    } catch (err) {
      console.error(err);
      fetchProjects(); // Revert on error
    }
  };

  // KPIs
  const total = projects.length;
  const inProgress = projects.filter(p => p.status === 'In Progress' || p.status === 'Testing').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  
  // Calculate Delayed (endDate < today and not completed)
  const today = new Date();
  const delayed = projects.filter(p => new Date(p.endDate) < today && p.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Project Management</h1>
          <p className="text-gray-400">Manage industrial automation projects, teams, and timelines.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" /> New Project
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Total Projects</div>
            <div className="text-3xl font-bold text-white">{total}</div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl"><Target className="w-6 h-6 text-blue-400" /></div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Active / In Progress</div>
            <div className="text-3xl font-bold text-white">{inProgress}</div>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-xl"><Clock className="w-6 h-6 text-yellow-400" /></div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Completed</div>
            <div className="text-3xl font-bold text-white">{completed}</div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-xl"><CheckCircle className="w-6 h-6 text-green-400" /></div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Delayed Projects</div>
            <div className="text-3xl font-bold text-red-400">{delayed}</div>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl"><Calendar className="w-6 h-6 text-red-400" /></div>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        <button 
          onClick={() => setView('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <KanbanSquare className="w-4 h-4" /> Kanban Board
        </button>
        <button 
          onClick={() => setView('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <LayoutGrid className="w-4 h-4" /> List View
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : view === 'kanban' ? (
        <KanbanBoard projects={projects} onStatusUpdate={handleStatusUpdate} />
      ) : (
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
          {/* List View Implementation Placeholder */}
          <div className="p-8 text-center text-gray-400">
            List view components rendered here... (Switch back to Kanban to see the primary view)
          </div>
        </div>
      )}
    </div>
  );
}
