"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, CheckCircle, AlertTriangle, PenTool, Database, QrCode, User, Briefcase, Wrench, Shield, History } from "lucide-react";
import { format } from "date-fns";

export default function AssetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // Form states
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [assignData, setAssignData] = useState({ employeeId: "", projectId: "", notes: "" });
  const [returnData, setReturnData] = useState({ condition: "Good", notes: "" });
  const [maintData, setMaintData] = useState({ maintenanceType: "Preventive", serviceDate: format(new Date(), 'yyyy-MM-dd'), technician: "", cost: 0, notes: "" });

  const fetchAssetData = async () => {
    try {
      const res = await fetch(`/api/assets/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setAsset(data.asset);
        setActivities(data.activities);
        setMaintenance(data.maintenance);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [empRes, projRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/projects')
      ]);
      const empData = await empRes.json();
      const projData = await projRes.json();
      if (empData.success) setEmployees(empData.employees);
      if (projData.success) setProjects(projData.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssetData();
    fetchDropdownData();
  }, [params.id]);

  const handleAssign = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/assets/${params.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignData)
      });
      if (res.ok) {
        setShowAssignModal(false);
        fetchAssetData();
      }
    } catch (err) {}
  };

  const handleReturn = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/assets/${params.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
      });
      if (res.ok) {
        setShowReturnModal(false);
        fetchAssetData();
      }
    } catch (err) {}
  };

  const handleMaintenance = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/assets/${params.id}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maintData)
      });
      if (res.ok) {
        setShowMaintenanceModal(false);
        fetchAssetData();
      }
    } catch (err) {}
  };

  if (loading) return <div className="p-20 text-center text-white">Loading Asset...</div>;
  if (!asset) return <div className="p-20 text-center text-white">Asset not found</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Available": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Assigned": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "In Maintenance": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Damaged": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Retired": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/assets" className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold px-2 py-1 bg-white/10 text-gray-300 rounded-md">
              {asset.assetId}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
        </div>
        
        {/* Actions based on status */}
        <div className="flex gap-3">
          {asset.status === 'Available' && (
            <button onClick={() => setShowAssignModal(true)} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
              Assign Asset
            </button>
          )}
          {asset.status === 'Assigned' && (
            <button onClick={() => setShowReturnModal(true)} className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors">
              Return Asset
            </button>
          )}
          {(asset.status === 'Available' || asset.status === 'Damaged') && (
            <button onClick={() => setShowMaintenanceModal(true)} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
              Send to Maintenance
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-white/10 p-6 rounded-2xl grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Category</h3>
              <p className="text-white font-medium">{asset.category}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Department</h3>
              <p className="text-white font-medium">{asset.department || 'Unassigned'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Manufacturer</h3>
              <p className="text-white font-medium">{asset.manufacturer || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Serial Number</h3>
              <p className="text-white font-mono">{asset.serialNumber || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Purchase Cost</h3>
              <p className="text-white font-medium">${asset.purchaseCost?.toLocaleString() || '0'}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Condition</h3>
              <p className={`font-medium ${asset.condition === 'Critical' || asset.condition === 'Poor' ? 'text-red-400' : 'text-green-400'}`}>
                {asset.condition}
              </p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Lifecycle History
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {activities.map((activity, idx) => (
                <div key={activity._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Box className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{activity.action}</span>
                      <time className="text-xs text-gray-400">{format(new Date(activity.date), 'MMM d, yyyy')}</time>
                    </div>
                    <p className="text-sm text-gray-300">{activity.details}</p>
                    {(activity.targetEmployeeId || activity.targetProjectId) && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
                        {activity.targetEmployeeId && `To: ${activity.targetEmployeeId.firstName} ${activity.targetEmployeeId.lastName} `}
                        {activity.targetProjectId && `Project: ${activity.targetProjectId.name}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - QR & Assignment */}
        <div className="space-y-6">
          <div className="bg-card border border-white/10 p-6 rounded-2xl flex flex-col items-center">
            <h3 className="text-gray-400 font-medium mb-4 w-full text-center">Asset QR Code</h3>
            <div className="bg-white p-2 rounded-xl mb-4">
              {/* Fallback to API generated QR */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${asset.qrCode}`} alt="QR Code" className="w-32 h-32" />
            </div>
            <p className="text-xs text-gray-500 font-mono">{asset.qrCode}</p>
            <button className="mt-4 text-primary text-sm hover:underline">Print Tag</button>
          </div>

          {asset.status === 'Assigned' && (
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
              <h3 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Current Assignment
              </h3>
              {asset.assignedEmployee && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400">Assigned To</p>
                  <p className="text-white font-medium">{asset.assignedEmployee.firstName} {asset.assignedEmployee.lastName}</p>
                  <p className="text-xs text-gray-500">{asset.assignedEmployee.department}</p>
                </div>
              )}
              {asset.assignedProject && (
                <div>
                  <p className="text-xs text-gray-400">Project</p>
                  <p className="text-white font-medium">{asset.assignedProject.name}</p>
                </div>
              )}
            </div>
          )}

          {maintenance.length > 0 && (
            <div className="bg-card border border-white/10 p-6 rounded-2xl">
              <h3 className="text-orange-400 font-medium mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5" /> Recent Maintenance
              </h3>
              <div className="space-y-4">
                {maintenance.slice(0,3).map(m => (
                  <div key={m._id} className="border-l-2 border-orange-500/50 pl-3">
                    <p className="text-white text-sm font-medium">{m.maintenanceType}</p>
                    <p className="text-xs text-gray-400">{format(new Date(m.serviceDate), 'MMM d, yyyy')} • {m.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals for Actions */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Assign Asset</h2>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Employee</label>
                <select value={assignData.employeeId} onChange={e => setAssignData({...assignData, employeeId: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white">
                  <option value="">Select Employee...</option>
                  {employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project</label>
                <select value={assignData.projectId} onChange={e => setAssignData({...assignData, projectId: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white">
                  <option value="">Select Project...</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea value={assignData.notes} onChange={e => setAssignData({...assignData, notes: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white h-24" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReturnModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Return Asset</h2>
            <form onSubmit={handleReturn} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Return Condition</label>
                <select value={returnData.condition} onChange={e => setReturnData({...returnData, condition: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white">
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor (Damaged)</option>
                  <option value="Critical">Critical (Broken)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Return Notes</label>
                <textarea value={returnData.notes} onChange={e => setReturnData({...returnData, notes: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white h-24" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowReturnModal(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg">Confirm Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Log Maintenance</h2>
            <form onSubmit={handleMaintenance} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Maintenance Type</label>
                <select value={maintData.maintenanceType} onChange={e => setMaintData({...maintData, maintenanceType: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white">
                  <option value="Preventive">Preventive</option>
                  <option value="Repair">Repair</option>
                  <option value="Calibration">Calibration</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Technician Name</label>
                <input type="text" value={maintData.technician} onChange={e => setMaintData({...maintData, technician: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Est. Cost ($)</label>
                <input type="number" value={maintData.cost} onChange={e => setMaintData({...maintData, cost: Number(e.target.value)})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea value={maintData.notes} onChange={e => setMaintData({...maintData, notes: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white h-24" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowMaintenanceModal(false)} className="px-4 py-2 text-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Start Maintenance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
