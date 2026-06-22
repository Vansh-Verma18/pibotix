"use client";

import { useEffect, useState } from "react";
import { Database, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    icon: "settings",
    benefits: "",
    features: "",
    technologiesUsed: "",
    industriesServed: "",
    isActive: true,
  });

  const fetchServices = () => {
    setLoading(true);
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => { setServices(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    fetchServices();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchServices();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", slug: "", shortDescription: "", fullDescription: "", icon: "settings", benefits: "", features: "", technologiesUsed: "", industriesServed: "", isActive: true });
    setShowForm(false);
    fetchServices();
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Services...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Services Management</h1>
            <p className="text-gray-400">{services.length} service{services.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-white/10 p-6 rounded-2xl space-y-4 max-w-3xl">
          <h3 className="text-lg font-bold text-white">New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input required type="text" placeholder="AI Vision Inspection" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug *</label>
              <input required type="text" placeholder="ai-vision-inspection" value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Short Description *</label>
            <input required type="text" placeholder="Brief overview of the service" value={formData.shortDescription}
              onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Description *</label>
            <textarea required rows={3} placeholder="Detailed description" value={formData.fullDescription}
              onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Benefits (comma-separated)</label>
              <input type="text" placeholder="Improved accuracy, Faster throughput" value={formData.benefits}
                onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Technologies (comma-separated)</label>
              <input type="text" placeholder="OpenCV, Python, NVIDIA" value={formData.technologiesUsed}
                onChange={e => setFormData({ ...formData, technologiesUsed: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Save Service</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-gray-400 font-medium text-sm">Title</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Slug</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Status</th>
              <th className="p-4 text-gray-400 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No services found. Add your first service above.</td></tr>
            ) : (
              services.map(service => (
                <tr key={service._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium">{service.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5 max-w-xs truncate">{service.shortDescription}</div>
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-sm">{service.slug}</td>
                  <td className="p-4">
                    <button onClick={() => handleToggleActive(service._id, service.isActive)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full transition-colors ${service.isActive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                      {service.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {service.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(service._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
