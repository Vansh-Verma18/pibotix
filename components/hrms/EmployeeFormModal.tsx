"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { IEmployeeForm } from "@/types/employee";

type Props = {
  employee?: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EmployeeFormModal({ employee, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!employee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Parse complex fields
    const emergencyContact = {
      name: formData.get("emergencyContact.name") as string,
      phone: formData.get("emergencyContact.phone") as string,
      relation: formData.get("emergencyContact.relation") as string,
    };
    
    const skillsString = formData.get("skills") as string;
    const skills = skillsString.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Partial<IEmployeeForm> = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      department: formData.get("department") as string,
      designation: formData.get("designation") as string,
      joiningDate: formData.get("joiningDate") as string,
      employmentType: formData.get("employmentType") as any,
      salary: Number(formData.get("salary")),
      status: formData.get("status") as any,
      emergencyContact,
      skills,
    };

    try {
      const url = isEditing ? `/api/employees/${employee._id}` : "/api/employees";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save employee");

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
            <p className="text-sm text-gray-400">Fill in the primary details for the employee record.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="employee-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                <input required name="firstName" defaultValue={employee?.firstName} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                <input required name="lastName" defaultValue={employee?.lastName} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input required type="email" name="email" defaultValue={employee?.email} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input required name="phone" defaultValue={employee?.phone} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department *</label>
                <select required name="department" defaultValue={employee?.department || ""} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500">
                  <option value="" disabled>Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Designation *</label>
                <input required name="designation" defaultValue={employee?.designation} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" placeholder="e.g. Senior Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Joining Date *</label>
                <input required type="date" name="joiningDate" defaultValue={employee?.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : ""} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500 [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Employment Type *</label>
                <select required name="employmentType" defaultValue={employee?.employmentType || "Full Time"} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500">
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Annual Salary ($) *</label>
                <input required type="number" min="0" step="1000" name="salary" defaultValue={employee?.salary} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
                <select required name="status" defaultValue={employee?.status || "Active"} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Address *</label>
              <input required name="address" defaultValue={employee?.address} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-t border-white/5 pt-6">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Contact Name *</label>
                  <input required name="emergencyContact.name" defaultValue={employee?.emergencyContact?.name} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Contact Phone *</label>
                  <input required name="emergencyContact.phone" defaultValue={employee?.emergencyContact?.phone} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Relation *</label>
                  <input required name="emergencyContact.relation" defaultValue={employee?.emergencyContact?.relation} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-t border-white/5 pt-6">Additional Info</h3>
              <label className="block text-sm font-medium text-gray-300 mb-2">Skills (Comma separated)</label>
              <input name="skills" defaultValue={employee?.skills?.join(", ")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500" placeholder="e.g. React, Node.js, Project Management" />
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/[0.02] rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-400 hover:text-white font-medium">
            Cancel
          </button>
          <button 
            type="submit" 
            form="employee-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}
