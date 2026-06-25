"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Activity, Users, FileText, Calendar, 
  DollarSign, CheckCircle, Loader2, Link as LinkIcon, Plus 
} from "lucide-react";
import Link from "next/link";
import AssignMemberModal from "@/components/pm/AssignMemberModal";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProject(data.project);
          setActivities(data.activities);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!project) return <div className="py-20 text-center text-gray-500">Project not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <button onClick={() => router.back()} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <span className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-mono">
              {project.projectId}
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-gray-300 border border-white/20 rounded-full text-xs">
              {project.status}
            </span>
          </div>
          <p className="text-gray-400">{project.clientCompany} • {project.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Team */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1"><Calendar className="w-4 h-4" /> Start Date</div>
                <div className="font-medium text-white">{new Date(project.startDate).toLocaleDateString()}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1"><Calendar className="w-4 h-4" /> End Date</div>
                <div className="font-medium text-white">{new Date(project.endDate).toLocaleDateString()}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1"><DollarSign className="w-4 h-4" /> Budget</div>
                <div className="font-medium text-white">${project.budget?.toLocaleString()}</div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1"><Activity className="w-4 h-4" /> Priority</div>
                <div className="font-medium text-white">{project.priority}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Team Members
              </h2>
              <button onClick={() => setIsAssignModalOpen(true)} className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" /> Assign Member
              </button>
            </div>
            <div className="space-y-4">
              {/* Manager */}
              <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {project.managerId?.firstName?.[0]}{project.managerId?.lastName?.[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{project.managerId?.firstName} {project.managerId?.lastName}</div>
                    <div className="text-xs text-gray-500">Project Manager</div>
                  </div>
                </div>
              </div>
              
              {/* Assigned Employees */}
              {project.assignedEmployees?.map((emp: any) => (
                <div key={emp._id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-300">
                      {emp.employeeId?.firstName?.[0]}{emp.employeeId?.lastName?.[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">{emp.employeeId?.firstName} {emp.employeeId?.lastName}</div>
                      <div className="text-xs text-gray-500">{emp.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Activity */}
        <div className="space-y-6">
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Progress</h2>
            <div className="flex items-center justify-center mb-4">
              {/* Simple CSS Circle Progress */}
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-white/5">
                <div className="absolute text-2xl font-bold text-white">{project.progressPercentage}%</div>
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                  <circle 
                    cx="64" cy="64" r="56" fill="transparent" 
                    stroke="currentColor" strokeWidth="8" className="text-primary"
                    strokeDasharray={351.858} strokeDashoffset={351.858 - (351.858 * project.progressPercentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            {project.status === 'Completed' && (
              <div className="flex items-center justify-center gap-2 text-green-400 font-medium bg-green-500/10 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" /> Project Delivered
              </div>
            )}
          </div>

          <div className="bg-card border border-white/10 p-6 rounded-2xl h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Activity Log
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {activities.length === 0 ? (
                <div className="text-gray-500 text-sm">No activity recorded yet.</div>
              ) : activities.map((act) => (
                <div key={act._id} className="relative pl-4 border-l-2 border-white/10 pb-4 last:pb-0 last:border-transparent">
                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[5px] top-1.5 ring-4 ring-[#111]"></div>
                  <div className="text-sm font-medium text-white mb-0.5">{act.action}</div>
                  <div className="text-xs text-gray-400 mb-1">{act.details}</div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {new Date(act.createdAt).toLocaleString()} by {act.actorId?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AssignMemberModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          setIsAssignModalOpen(false);
          // Refresh data by manually re-fetching (simulating effect trigger)
          window.location.reload(); 
        }}
        projectId={params.id as string}
      />
    </div>
  );
}
