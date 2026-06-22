"use client";

import { useEffect, useState } from "react";
import { PenTool, Plus, Trash2 } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", excerpt: "", content: "", author: "", status: "draft" });

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", slug: "", excerpt: "", content: "", author: "", status: "draft" });
    setShowForm(false);
    fetchPosts();
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Blog Posts...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Blog Management</h1>
            <p className="text-gray-400">Create and manage your blog posts.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-white/10 p-6 rounded-2xl space-y-4 max-w-3xl">
          <h3 className="text-lg font-bold text-white">Create Blog Post</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Title" value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
            <input 
              required type="text" placeholder="Slug (e.g. my-post)" value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Author" value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            />
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <textarea 
            required placeholder="Excerpt" rows={2} value={formData.excerpt}
            onChange={e => setFormData({...formData, excerpt: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
          />
          <textarea 
            required placeholder="Content (Markdown/HTML)" rows={6} value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary font-mono text-sm"
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
              <th className="p-4 text-gray-400 font-medium text-sm">Title</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Status</th>
              <th className="p-4 text-gray-400 font-medium text-sm">Author</th>
              <th className="p-4 text-gray-400 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No blog posts found.</td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-medium">{post.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{post.author}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(post._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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
