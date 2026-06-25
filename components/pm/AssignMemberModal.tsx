"use client";

import { useState, useEffect } from "react";
import { X, Loader2, UserPlus } from "lucide-react";

export default function AssignMemberModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  projectId
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    role: "Software Engineer"
  });

  const roles = [
    "Lead Engineer",
    "Automation Engineer",
    "Software Engineer",
    "Hardware Engineer",
    "QA Tester",
    "Intern"
  ];

  useEffect(() => {
    if (isOpen) {
      fetch("/api/employees")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setEmployees(data.employees || []);
            if (data.employees?.length > 0) {
              setFormData(prev => ({ ...prev, employeeId: data.employees[0]._id }));
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
      const res = await fetch(`/api/projects/${projectId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        alert("Error: " + (data.error || "Failed to assign member"));
        if (data.conflictingLeaves) {
            alert("The employee has an approved leave conflicting with this project's timeline!");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to assign member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Assign Team Member
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Select Employee</label>
            <select required value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.department})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Project Role</label>
            <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
