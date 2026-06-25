"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Box, CheckCircle, AlertTriangle, PenTool, Database, QrCode } from "lucide-react";
import { format } from "date-fns";
import AssetAnalytics from "@/components/assets/AssetAnalytics";

export default function AssetsDashboard() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "", category: "Industrial Automation", subCategory: "", manufacturer: "",
    modelNumber: "", serialNumber: "", purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    purchaseCost: 0, warrantyExpiry: "", supplier: "", department: "", condition: "Excellent"
  });

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets?search=${search}&category=${filterCategory}&status=${filterStatus}`);
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, filterCategory, filterStatus]);

  const handleAddAsset = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchAssets();
      } else {
        alert(data.error || "Failed to add asset");
      }
    } catch (err) {
      alert("Error adding asset");
    }
  };

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

  const totalValue = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const assignedCount = assets.filter(a => a.status === 'Assigned').length;
  const maintenanceCount = assets.filter(a => a.status === 'In Maintenance').length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Asset & Inventory Hub</h1>
          <p className="text-gray-400">Manage industrial equipment, robotics, and IT assets.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium border border-white/10">
            <QrCode className="w-5 h-5" /> Scan Asset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" /> Add Asset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Assets</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{assets.length}</p>
          <p className="text-sm text-green-400 mt-2">Valued at ${totalValue.toLocaleString()}</p>
        </div>
        
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Available</h3>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{availableCount}</p>
          <p className="text-sm text-gray-400 mt-2">Ready for deployment</p>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Assigned</h3>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Box className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{assignedCount}</p>
          <p className="text-sm text-gray-400 mt-2">Currently in use</p>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Maintenance</h3>
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{maintenanceCount}</p>
          <p className="text-sm text-orange-400 mt-2">Requires attention</p>
        </div>
      </div>

      <div className="mb-8">
        <AssetAnalytics />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search assets by name, ID, serial number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary min-w-[150px]"
        >
          <option value="all">All Categories</option>
          <option value="Industrial Automation">Industrial Automation</option>
          <option value="Robotics">Robotics</option>
          <option value="PLC">PLC</option>
          <option value="IT Equipment">IT Equipment</option>
          <option value="Safety">Safety</option>
        </select>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary min-w-[150px]"
        >
          <option value="all">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="In Maintenance">In Maintenance</option>
          <option value="Damaged">Damaged</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      {/* Asset Table */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading inventory...</div>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No assets found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Asset ID / Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {assets.map((asset) => (
                  <tr key={asset._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Database className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{asset.name}</div>
                          <div className="text-xs text-primary font-mono mt-0.5">{asset.assetId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{asset.category}</div>
                      {asset.manufacturer && <div className="text-xs text-gray-500 mt-0.5">{asset.manufacturer} {asset.modelNumber}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                      {asset.condition === 'Critical' && (
                        <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Critical Condition
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {asset.status === 'Assigned' ? (
                        <div>
                          <div className="text-gray-300">{asset.assignedEmployee ? `${asset.assignedEmployee.firstName} ${asset.assignedEmployee.lastName}` : 'System'}</div>
                          {asset.assignedProject && <div className="text-xs text-gray-500 mt-0.5">{asset.assignedProject.name}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/assets/${asset._id}`}
                        className="text-white hover:bg-white/10 font-medium px-4 py-2 border border-white/20 rounded-lg transition-colors inline-block"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" /> Add New Asset
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddAsset} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Asset Name *</label>
                  <input required type="text" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary" placeholder="e.g. Fanuc CRX-10iA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                  <select required value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary">
                    <option value="Industrial Automation">Industrial Automation</option>
                    <option value="Robotics">Robotics</option>
                    <option value="PLC">PLC</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Safety">Safety</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Manufacturer</label>
                  <input type="text" value={newAsset.manufacturer} onChange={e => setNewAsset({...newAsset, manufacturer: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Serial Number</label>
                  <input type="text" value={newAsset.serialNumber} onChange={e => setNewAsset({...newAsset, serialNumber: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Cost ($)</label>
                  <input type="number" value={newAsset.purchaseCost} onChange={e => setNewAsset({...newAsset, purchaseCost: Number(e.target.value)})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                  <input type="text" value={newAsset.department} onChange={e => setNewAsset({...newAsset, department: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary" placeholder="e.g. Engineering" />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-gray-400 hover:text-white font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
