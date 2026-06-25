"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, LayoutGrid, KanbanSquare, Calendar, Filter, Target, Clock, CheckCircle } from "lucide-react";
import TaskKanbanBoard from "@/components/tasks/TaskKanbanBoard";
import Link from "next/link";

export default function TasksDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        department: departmentFilter,
        priority: priorityFilter
      }).toString();
      const res = await fetch(`/api/tasks?${query}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, departmentFilter, priorityFilter]);

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    // Optimistic Update
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        fetchTasks(); // Revert on failure
      }
    } catch (err) {
      console.error(err);
      fetchTasks(); 
    }
  };

  // KPIs
  const total = tasks.length;
  const inProgress = tasks.filter(p => p.status === 'In Progress' || p.status === 'Testing').length;
  const completed = tasks.filter(p => p.status === 'Completed').length;
  const today = new Date();
  const overdue = tasks.filter(p => new Date(p.dueDate) < today && p.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Task Management</h1>
          <p className="text-gray-400">Enterprise granular task tracking & time management.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/tasks/analytics" className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
            <Target className="w-5 h-5" /> <span className="hidden sm:inline">Analytics</span>
          </Link>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" /> Create Task
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-card border border-white/10 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Search Tasks</label>
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Department</label>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Priority</label>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-white">{total}</div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl"><Target className="w-6 h-6 text-blue-400" /></div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">In Progress</div>
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
            <div className="text-sm text-gray-400 mb-1">Overdue Tasks</div>
            <div className="text-3xl font-bold text-red-400">{overdue}</div>
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
        <TaskKanbanBoard tasks={tasks} onStatusUpdate={handleStatusUpdate} />
      ) : (
        <div className="bg-card border border-white/10 rounded-2xl p-8 text-center text-gray-400">
          List view components rendered here...
        </div>
      )}
    </div>
  );
}
