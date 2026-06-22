"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Trash2 } from "lucide-react";

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", position: "", bio: "" });

  const fetchTeam = () => {
    setLoading(true);
    fetch("/api/admin/team")
      .then((res) => res.json())
      .then((data) => {
        setTeam(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    fetchTeam();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ name: "", position: "", bio: "" });
    setShowForm(false);
    fetchTeam();
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Team...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Team Management</h1>
            <p className="text-gray-400">Manage your team members and their roles.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-white/10 p-6 rounded-2xl space-y-4 max-w-2xl">
          <h3 className="text-lg font-bold text-white">New Team Member</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Name" value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
            <input 
              required type="text" placeholder="Position" value={formData.position}
              onChange={e => setFormData({...formData, position: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <textarea 
            required placeholder="Bio" rows={3} value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
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
              <th className="p-4 text-gray-400 font-medium text-sm">Name</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Position</th>
              <th className="p-4 text-gray-400 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">No team members found.</td>
              </tr>
            ) : (
              team.map(member => (
                <tr key={member._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-medium">{member.name}</td>
                  <td className="p-4 text-gray-400">{member.position}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(member._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
