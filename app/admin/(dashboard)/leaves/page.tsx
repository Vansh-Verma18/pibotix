"use client";

import { useEffect, useState } from "react";
import { 
  CalendarDays, CheckCircle, Clock, XCircle, FileText, 
  Plus, Loader2, RefreshCw, Calendar as CalendarIcon, Download 
} from "lucide-react";
import LeaveCalendar from "@/components/hrms/LeaveCalendar";

export default function LeaveManagementDashboard() {
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'team-leaves'>('my-leaves');
  const [balances, setBalances] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New Request Form
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave', startDate: '', endDate: '', reason: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [balRes, leavesRes] = await Promise.all([
        fetch('/api/leaves/balance'),
        fetch('/api/leaves')
      ]);
      const balData = await balRes.json();
      const leavesData = await leavesRes.json();

      if (balData.success) setBalances(balData.balances);
      if (leavesData.success) setLeaves(leavesData.leaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('submit');
    try {
      const res = await fetch('/api/leaves/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setShowRequestModal(false);
      setFormData({ leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/leaves/${action}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // KPIs
  const pendingRequests = leaves.filter(l => l.status === 'Pending').length;
  const approvedRequests = leaves.filter(l => l.status === 'Approved').length;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Cancelled': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Leave Management</h1>
          <p className="text-gray-400">Request time off, view balances, and manage team leaves.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('my-leaves')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors border ${activeTab === 'my-leaves' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            My Leaves
          </button>
          <button 
            onClick={() => setActiveTab('team-leaves')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors border ${activeTab === 'team-leaves' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            Team Requests
          </button>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" /> Request Leave
          </button>
        </div>
      </div>

      {activeTab === 'my-leaves' ? (
        <>
          {/* My Balances */}
          <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Available Balances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {balances.map((b, i) => (
              <div key={i} className="bg-card border border-white/10 p-5 rounded-2xl">
                <div className="text-sm text-gray-400 mb-2">{b.leaveType}</div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{b.remainingLeaves.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 mb-1">/ {b.totalAllocated} days</span>
                </div>
                <div className="mt-4 w-full bg-white/5 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (b.remainingLeaves / (b.totalAllocated || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* My Leave History */}
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Leave History</h2>
          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Leave Type</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Duration</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Total Days</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Reason</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading records...</td></tr>
                  ) : leaves.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No leave requests found.</td></tr>
                  ) : (
                    leaves.map(l => (
                      <tr key={l._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-sm font-medium text-white">{l.leaveType}</td>
                        <td className="p-4 text-sm text-gray-300">
                          {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-white font-mono">{l.totalDays} days</td>
                        <td className="p-4 text-sm text-gray-400 max-w-xs truncate" title={l.reason}>{l.reason}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(l.status)}`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Team Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Pending Requests</div>
                <div className="text-3xl font-bold text-white">{pendingRequests}</div>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl"><Clock className="w-6 h-6 text-yellow-400" /></div>
            </div>
            <div className="bg-card border border-white/10 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Approved Leaves</div>
                <div className="text-3xl font-bold text-white">{approvedRequests}</div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl"><CheckCircle className="w-6 h-6 text-green-400" /></div>
            </div>
          </div>

          {/* Team Leave Requests Table */}
          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden mt-8">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white">Review Team Requests</h3>
            </div>
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Employee</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Leave Type</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Duration</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Reason</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading records...</td></tr>
                  ) : leaves.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No requests to review.</td></tr>
                  ) : (
                    leaves.map(l => (
                      <tr key={l._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-white">{l.employeeId?.firstName} {l.employeeId?.lastName}</div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">{l.employeeId?.employeeId}</div>
                        </td>
                        <td className="p-4 text-sm font-medium text-white">{l.leaveType}</td>
                        <td className="p-4 text-sm text-gray-300">
                          <div>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">{l.totalDays} days</div>
                        </td>
                        <td className="p-4 text-sm text-gray-400 max-w-xs truncate" title={l.reason}>{l.reason}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(l.status)}`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {l.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleAction(l._id, 'approve')}
                                disabled={actionLoading === l._id}
                                className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                {actionLoading === l._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleAction(l._id, 'reject')}
                                disabled={actionLoading === l._id}
                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                {actionLoading === l._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <LeaveCalendar leaves={leaves} />
        </>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col">
             <div className="p-6 border-b border-white/10">
               <h2 className="text-xl font-bold text-white">Request Leave</h2>
               <p className="text-sm text-gray-400">Submit a new time-off request.</p>
             </div>
             <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Leave Type *</label>
                 <select 
                   required 
                   value={formData.leaveType}
                   onChange={e => setFormData({...formData, leaveType: e.target.value})}
                   className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                 >
                   <option value="Annual Leave">Annual Leave</option>
                   <option value="Casual Leave">Casual Leave</option>
                   <option value="Sick Leave">Sick Leave</option>
                   <option value="Earned Leave">Earned Leave</option>
                   <option value="Work From Home">Work From Home</option>
                   <option value="Compensatory Leave">Compensatory Leave</option>
                   <option value="Unpaid Leave">Unpaid Leave</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                   <input 
                     required type="date" 
                     value={formData.startDate}
                     onChange={e => setFormData({...formData, startDate: e.target.value})}
                     className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500 [color-scheme:dark]" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label>
                   <input 
                     required type="date" 
                     value={formData.endDate}
                     onChange={e => setFormData({...formData, endDate: e.target.value})}
                     className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500 [color-scheme:dark]" 
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Reason *</label>
                 <textarea 
                   required rows={3}
                   value={formData.reason}
                   onChange={e => setFormData({...formData, reason: e.target.value})}
                   className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500 resize-none"
                   placeholder="Briefly describe why you are requesting this leave..."
                 />
               </div>
               <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowRequestModal(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium transition-colors">Cancel</button>
                 <button 
                   type="submit" 
                   disabled={actionLoading === 'submit'}
                   className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                 >
                   {actionLoading === 'submit' ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : 'Submit Request'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}
