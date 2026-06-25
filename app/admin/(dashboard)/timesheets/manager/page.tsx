"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, FileText, XCircle, Search, Calendar, Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import ProductivityAnalytics from "@/components/timesheets/ProductivityAnalytics";

export default function ManagerTimesheetsDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Pending' | 'History'>('Pending');
  const [search, setSearch] = useState('');
  
  // Review Modal State
  const [reviewLog, setReviewLog] = useState<any>(null);
  const [managerNotes, setManagerNotes] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/worklogs'); // Managers see all
      const data = await res.json();
      if (data.success) {
        setLogs(data.worklogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAction = async (status: string) => {
    if (!reviewLog) return;
    try {
      const res = await fetch(`/api/worklogs/${reviewLog._id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, managerNotes })
      });
      const data = await res.json();
      if (data.success) {
        setReviewLog(null);
        setManagerNotes("");
        fetchLogs();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing review");
    }
  };

  const filteredLogs = logs.filter(log => {
    const isPending = log.status === 'Submitted';
    if (activeTab === 'Pending' && !isPending) return false;
    if (activeTab === 'History' && isPending) return false;
    if (log.status === 'Draft') return false; // Managers shouldn't see drafts

    if (search) {
      const term = search.toLowerCase();
      const empName = log.employeeId ? `${log.employeeId.firstName} ${log.employeeId.lastName}`.toLowerCase() : log.employeeName.toLowerCase();
      if (!empName.includes(term) && !log.logId.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Timesheets</h1>
          <p className="text-gray-400">Review, approve, and track your engineering team's daily productivity.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="text-gray-400 font-medium">Pending Reviews</h3>
          </div>
          <p className="text-3xl font-bold text-white">{logs.filter(l => l.status === 'Submitted').length}</p>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-gray-400 font-medium">Approved This Week</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {logs.filter(l => l.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-gray-400 font-medium">Active Loggers</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {new Set(logs.map(l => l.employeeId?._id || l.employeeName)).size}
          </p>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-gray-400 font-medium">Total Hours Logged</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {logs.reduce((acc, l) => acc + (l.totalHoursWorked || 0), 0).toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          <button 
            onClick={() => setActiveTab('Pending')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Pending' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Pending Review
          </button>
          <button 
            onClick={() => setActiveTab('History')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'History' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            History & Analytics
          </button>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by employee..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'Pending' ? (
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
          <div className="p-12 text-center text-gray-400">Loading timesheets...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No logs found in this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Project / Task</th>
                  <th className="px-6 py-4">Hours & Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        {log.employeeId ? `${log.employeeId.firstName} ${log.employeeId.lastName}` : log.employeeName}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{log.logId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">
                        {log.projectId ? log.projectId.name : "General Work"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {log.taskId ? log.taskId.name : "No specific task"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {log.totalHoursWorked}h
                      <div className="text-xs flex items-center gap-1 text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(log.date), 'MMM dd')} ({log.startTime}-{log.endTime})
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                        ${log.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                          log.status === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                          log.status === 'Request Changes' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'}
                      `}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setReviewLog(log)} 
                        className="text-white hover:bg-white/10 font-medium px-4 py-2 border border-white/20 rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      ) : (
        <ProductivityAnalytics logs={logs.filter(l => l.status !== 'Draft')} />
      )}

      {/* Review Modal */}
      {reviewLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setReviewLog(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" /> Review Work Log
              </h2>
              <p className="text-gray-400 mb-8 border-b border-white/10 pb-6">
                Submitted by <span className="text-white font-semibold">{reviewLog.employeeId ? `${reviewLog.employeeId.firstName} ${reviewLog.employeeId.lastName}` : reviewLog.employeeName}</span> on {format(new Date(reviewLog.date), 'MMMM dd, yyyy')}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Project</span>
                  <span className="text-white font-medium">{reviewLog.projectId?.name || "General Work"}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Task</span>
                  <span className="text-white font-medium">{reviewLog.taskId?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Hours</span>
                  <span className="text-primary font-bold text-xl">{reviewLog.totalHoursWorked}h</span>
                  <span className="text-gray-500 text-sm ml-2">({reviewLog.startTime} - {reviewLog.endTime})</span>
                </div>
                {reviewLog.taskId && (
                  <div>
                    <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Task Progress</span>
                    <span className="text-white font-medium">{reviewLog.currentProgress}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-6 bg-background rounded-2xl p-6 border border-white/5 mb-8">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Work Summary</h4>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{reviewLog.workSummary}</p>
                </div>
                {reviewLog.blockers && (
                  <div>
                    <h4 className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Blockers / Challenges
                    </h4>
                    <p className="text-orange-200/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">{reviewLog.blockers}</p>
                  </div>
                )}
                {reviewLog.tasksPlanned && (
                  <div>
                    <h4 className="text-sm font-bold text-blue-400 mb-2">Tomorrow's Plan</h4>
                    <p className="text-blue-200/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">{reviewLog.tasksPlanned}</p>
                  </div>
                )}
              </div>

              {reviewLog.status === 'Submitted' && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-white">Manager Notes (Optional)</label>
                  <textarea 
                    value={managerNotes}
                    onChange={(e) => setManagerNotes(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                    placeholder="Leave feedback or reasons for requesting changes..."
                    rows={3}
                  />
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => handleAction('Approved')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Approve Timesheet
                    </button>
                    <button 
                      onClick={() => handleAction('Request Changes')}
                      className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 font-bold py-3 rounded-xl transition-colors"
                    >
                      Request Changes
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
