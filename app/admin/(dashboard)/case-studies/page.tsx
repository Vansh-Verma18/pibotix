"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function CaseStudiesPage() {
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    clientIndustry: "",
    challenge: "",
    solution: "",
    results: "",
    technologiesUsed: "",
    isActive: true,
  });

  const fetchStudies = () => {
    setLoading(true);
    fetch("/api/admin/case-studies")
      .then((res) => res.json())
      .then((data) => { setStudies(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchStudies(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    fetchStudies();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/case-studies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchStudies();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", slug: "", clientIndustry: "", challenge: "", solution: "", results: "", technologiesUsed: "", isActive: true });
    setShowForm(false);
    fetchStudies();
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Case Studies...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Case Studies</h1>
            <p className="text-gray-400">{studies.length} case stud{studies.length !== 1 ? 'ies' : 'y'} total</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Case Study
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-white/10 p-6 rounded-2xl space-y-4 max-w-3xl">
          <h3 className="text-lg font-bold text-white">New Case Study</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input required type="text" placeholder="Automotive Welding Automation" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug *</label>
              <input required type="text" placeholder="automotive-welding" value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Client Industry *</label>
            <input required type="text" placeholder="Automotive Manufacturing" value={formData.clientIndustry}
              onChange={e => setFormData({ ...formData, clientIndustry: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Challenge *</label>
            <textarea required rows={2} placeholder="Describe the client's challenge..." value={formData.challenge}
              onChange={e => setFormData({ ...formData, challenge: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Solution *</label>
            <textarea required rows={2} placeholder="Describe the solution implemented..." value={formData.solution}
              onChange={e => setFormData({ ...formData, solution: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Results (comma-separated)</label>
              <input type="text" placeholder="40% faster, 99.8% uptime" value={formData.results}
                onChange={e => setFormData({ ...formData, results: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Technologies (comma-separated)</label>
              <input type="text" placeholder="ROS2, ABB Robotics, Python" value={formData.technologiesUsed}
                onChange={e => setFormData({ ...formData, technologiesUsed: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Save Case Study</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-gray-400 font-medium text-sm">Title</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Industry</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Status</th>
              <th className="p-4 text-gray-400 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No case studies found. Add your first one above.</td></tr>
            ) : (
              studies.map(study => (
                <tr key={study._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium">{study.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5 font-mono">{study.slug}</div>
                  </td>
                  <td className="p-4 text-gray-400">{study.clientIndustry}</td>
                  <td className="p-4">
                    <button onClick={() => handleToggleActive(study._id, study.isActive)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full transition-colors ${study.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                      {study.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {study.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(study._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
