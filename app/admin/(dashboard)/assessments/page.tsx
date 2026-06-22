"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, CheckCircle, Mail, Phone, Building, Briefcase } from "lucide-react";

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/admin/assessments");
      const data = await res.json();
      if (res.ok) setAssessments(data.assessments);
    } catch (error) {
      console.error("Failed to fetch assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    try {
      const res = await fetch(`/api/admin/assessments/${id}`, { method: "DELETE" });
      if (res.ok) fetchAssessments();
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'New' ? 'Contacted' : 'New';
    try {
      const res = await fetch(`/api/admin/assessments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchAssessments();
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Automation Assessments</h1>
          <p className="text-gray-400">Review readiness assessments submitted by potential clients.</p>
        </div>
      </div>

      <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#111] text-gray-400 border-b border-white/10 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Company & Contact</th>
                <th className="px-6 py-4 font-medium">Scores</th>
                <th className="px-6 py-4 font-medium">Budget & ROI</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assessments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No assessments found.</td>
                </tr>
              ) : (
                assessments.map((a) => (
                  <tr key={a._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-white mb-1">
                        <Building className="w-4 h-4 text-primary" /> {a.companyName}
                      </div>
                      <div className="text-gray-400 flex items-center gap-2 mb-1">
                        <Briefcase className="w-3 h-3" /> {a.name}
                      </div>
                      <div className="text-gray-500 text-xs flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {a.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 w-16 text-xs">Auto:</span>
                        <div className="flex-1 bg-gray-800 h-1.5 rounded-full w-24">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${a.automationScore}%` }}></div>
                        </div>
                        <span className="font-mono text-white text-xs">{a.automationScore}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 w-16 text-xs">Digital:</span>
                        <div className="flex-1 bg-gray-800 h-1.5 rounded-full w-24">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${a.digitalTransformationScore}%` }}></div>
                        </div>
                        <span className="font-mono text-white text-xs">{a.digitalTransformationScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium mb-1">{a.automationBudget}</div>
                      <div className="text-xs text-green-400 bg-green-400/10 inline-block px-2 py-0.5 rounded border border-green-400/20">
                        ROI: {a.expectedROI}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(a._id, a.status)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                          a.status === 'Contacted' 
                            ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'
                        }`}
                      >
                        {a.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleStatus(a._id, a.status)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Toggle Status"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(a._id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
