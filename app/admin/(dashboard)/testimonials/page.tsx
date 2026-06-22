"use client";

import { useEffect, useState } from "react";
import { Star, Plus, Trash2 } from "lucide-react";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ clientName: "", company: "", role: "", content: "", rating: 5 });

  const fetchTestimonials = () => {
    setLoading(true);
    fetch("/api/admin/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ clientName: "", company: "", role: "", content: "", rating: 5 });
    setShowForm(false);
    fetchTestimonials();
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Testimonials...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Testimonials</h1>
            <p className="text-gray-400">Manage client reviews and testimonials.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-white/10 p-6 rounded-2xl space-y-4 max-w-2xl">
          <h3 className="text-lg font-bold text-white">New Testimonial</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Client Name" value={formData.clientName}
              onChange={e => setFormData({...formData, clientName: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
            <input 
              required type="text" placeholder="Company" value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Role" value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
            <input 
              required type="number" min="1" max="5" placeholder="Rating (1-5)" value={formData.rating}
              onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <textarea 
            required placeholder="Content" rows={3} value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg">Save</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-gray-400 font-medium text-sm">Client</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Company</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Rating</th>
              <th className="p-4 text-gray-400 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No testimonials found.</td>
              </tr>
            ) : (
              testimonials.map(item => (
                <tr key={item._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-medium">{item.clientName}</td>
                  <td className="p-4 text-gray-400">{item.company}</td>
                  <td className="p-4 text-gray-400">{item.rating} / 5</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
