"use client";

import { useEffect, useState } from "react";
import { Loader2, Briefcase, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function EmployeeProjectWidget() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          // Keep only active/upcoming projects for the widget
          const active = data.projects.filter((p: any) => p.status !== 'Completed' && p.status !== 'Cancelled');
          setProjects(active.slice(0, 3)); // Show top 3
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden mt-6">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Active Projects
        </h3>
        <Link href="/admin/projects" className="text-xs text-primary hover:text-red-400 font-medium flex items-center">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">No active projects assigned.</div>
        ) : (
          projects.map(p => (
            <Link key={p._id} href={`/admin/projects/${p._id}`} className="block">
              <div className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-4 rounded-xl transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">{p.name}</h4>
                  <span className="text-[10px] font-mono bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">{p.status}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Deadline: {new Date(p.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs font-bold text-primary">{p.progressPercentage}%</div>
                </div>
                <div className="mt-2 w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${p.progressPercentage}%` }} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
