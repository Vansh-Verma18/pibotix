"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "",
    contactEmail: "",
    supportPhone: "",
    seo: { metaTitle: "", metaDescription: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.siteName) {
          setSettings(data);
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Settings saved successfully!");
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">System Settings</h1>
          <p className="text-gray-400">Manage global site configuration and preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-white/10 rounded-2xl p-6 space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">General Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Site Name</label>
              <input 
                type="text" 
                value={settings.siteName} 
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
              <input 
                type="email" 
                value={settings.contactEmail} 
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Support Phone</label>
              <input 
                type="text" 
                value={settings.supportPhone} 
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">SEO Configuration</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Meta Title</label>
              <input 
                type="text" 
                value={settings.seo?.metaTitle || ''} 
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
              <textarea 
                value={settings.seo?.metaDescription || ''} 
                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: e.target.value } })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>

      </form>
    </div>
  );
}
