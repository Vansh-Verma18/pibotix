"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { ProjectCategories, ProjectPriorities } from "@/types/project";

export default function NewProjectModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    clientCompany: "",
    description: "",
    category: ProjectCategories[0],
    priority: ProjectPriorities[1],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    budget: 0,
    managerId: ""
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/employees")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEmployees(data.employees || []);
            if (data.employees?.length > 0) {
              setFormData(prev => ({ ...prev, managerId: data.employees[0]._id }));
            }
          }
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, budget: Number(formData.budget) })
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert("Error: " + (data.error || "Failed to create project"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="sticky top-0 bg-[#111] border-b border-white/10 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white">Create New Project</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Automate Assembly Line A" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client Contact Name</label>
              <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client Company</label>
              <input required type="text" value={formData.clientCompany} onChange={e => setFormData({...formData, clientCompany: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Acme Corp" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Detailed description of the project goals..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                {ProjectCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                {ProjectPriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Estimated End Date</label>
              <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
              <input required type="number" min="0" value={formData.budget} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Manager</label>
              <select required value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
