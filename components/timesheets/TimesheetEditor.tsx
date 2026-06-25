"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Send, AlertTriangle, Play, Square } from "lucide-react";
import { format } from "date-fns";

export default function TimesheetEditor({ initialData, onClose }: { initialData?: any, onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    projectId: "",
    taskId: "",
    startTime: "09:00",
    endTime: "17:00",
    totalHoursWorked: 8,
    workSummary: "",
    challengesFaced: "",
    blockers: "",
    tasksPlanned: "",
    estimatedHours: 0,
    priority: "Medium",
    tasksCompleted: 0,
    currentProgress: 0,
    clientName: "",
    machine: "",
    department: "",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isReadOnly = initialData && initialData.status !== 'Draft' && initialData.status !== 'Request Changes';

  useEffect(() => {
    // Fetch dependencies
    fetch('/api/projects').then(r => r.json()).then(d => { if(d.success) setProjects(d.projects) });
    fetch('/api/tasks').then(r => r.json()).then(d => { if(d.success) setTasks(d.tasks) });

    if (initialData) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0],
        projectId: initialData.projectId?._id || initialData.projectId || "",
        taskId: initialData.taskId?._id || initialData.taskId || "",
      });
    }
  }, [initialData]);

  // Calculate hours automatically
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const [sh, sm] = formData.startTime.split(':').map(Number);
      const [eh, em] = formData.endTime.split(':').map(Number);
      let diff = (eh + em/60) - (sh + sm/60);
      if (diff < 0) diff += 24; // overnight
      setFormData(prev => ({ ...prev, totalHoursWorked: Number(diff.toFixed(2)) }));
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const url = initialData ? `/api/worklogs/${initialData._id}` : '/api/worklogs';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData })
      });
      const data = await res.json();
      
      if (data.success) {
        onClose();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      alert("Error saving log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="flex gap-3">
          {!isReadOnly && (
            <button 
              onClick={handleSaveDraft} 
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <h2 className="text-2xl font-bold text-white">Daily Work Log</h2>
          {initialData?.status && (
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium">
              Status: {initialData.status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Project</label>
            <select 
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">General Work (No Project)</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Task</label>
            <select 
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">No Specific Task</option>
              {tasks.filter(t => !formData.projectId || t.projectId?._id === formData.projectId).map(t => (
                <option key={t._id} value={t._id}>{t.taskId} - {t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Time *</label>
            <input 
              type="time" 
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">End Time *</label>
            <input 
              type="time" 
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={isReadOnly}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Total Hours</label>
            <input 
              type="number" 
              name="totalHoursWorked"
              value={formData.totalHoursWorked}
              readOnly
              className="w-full bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-primary font-bold focus:outline-none cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Today's Work Summary *</label>
            <p className="text-xs text-gray-500 mb-2">Detail your activities: code written, PLCs calibrated, meetings attended.</p>
            <textarea 
              name="workSummary"
              value={formData.workSummary}
              onChange={handleChange}
              disabled={isReadOnly}
              rows={6}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 font-mono text-sm"
              placeholder="e.g., Developed API routes for timesheets, reviewed PRs..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" /> Challenges & Blockers
              </label>
              <textarea 
                name="blockers"
                value={formData.blockers}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={4}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500/50 focus:outline-none disabled:opacity-50 font-mono text-sm"
                placeholder="List anything blocking your progress..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Tomorrow's Plan</label>
              <textarea 
                name="tasksPlanned"
                value={formData.tasksPlanned}
                onChange={handleChange}
                disabled={isReadOnly}
                rows={4}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none disabled:opacity-50 font-mono text-sm"
                placeholder="What are you working on tomorrow?"
              />
            </div>
          </div>
        </div>

        {/* Task Progress Update Section */}
        {formData.taskId && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Task Progress Update</h3>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Progress (%)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    name="currentProgress"
                    min="0" max="100"
                    value={formData.currentProgress}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-white font-bold w-12 text-right">{formData.currentProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {initialData?.managerNotes && (
          <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <h4 className="text-sm font-bold text-orange-400 mb-2">Manager Review Notes:</h4>
            <p className="text-gray-300 text-sm">{initialData.managerNotes}</p>
          </div>
        )}

      </div>
    </div>
  );
}
