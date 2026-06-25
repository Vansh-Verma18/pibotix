"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, Calendar as CalendarIcon, CheckCircle, AlertCircle, FileText } from "lucide-react";
import TimesheetEditor from "@/components/timesheets/TimesheetEditor";
import ActivityTimeline from "@/components/timesheets/ActivityTimeline";
import { format } from "date-fns";

export default function TimesheetsDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/worklogs');
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

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setShowEditor(true);
  };

  const handleEditorClose = (refresh: boolean) => {
    setShowEditor(false);
    setEditingLog(null);
    if (refresh) fetchLogs();
  };

  const handleSubmit = async (id: string) => {
    if (!confirm("Are you sure you want to submit this log? It cannot be edited after submission.")) return;
    try {
      const res = await fetch(`/api/worklogs/${id}/submit`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("Log submitted successfully!");
        fetchLogs();
      } else {
        alert(data.error || "Failed to submit");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting log");
    }
  };

  if (showEditor) {
    return <TimesheetEditor initialData={editingLog} onClose={() => handleEditorClose(true)} />;
  }

  // Calculate metrics
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysLogs = logs.filter(l => new Date(l.date).toISOString().startsWith(todayStr));
  const todayHours = todaysLogs.reduce((acc, l) => acc + (l.totalHoursWorked || 0), 0);
  const pendingLogs = logs.filter(l => l.status === 'Draft' || l.status === 'Request Changes');

  // Compute timeline events from today's logs
  const timelineEvents = todaysLogs.map(l => ({
    id: l._id,
    time: l.startTime,
    title: l.projectId ? `Worked on ${l.projectId.name}` : "General Work",
    description: l.workSummary,
    type: 'log' as const
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Timesheets & Work Logs</h1>
          <p className="text-gray-400">Track your daily engineering and automation tasks.</p>
        </div>
        <button
          onClick={() => {
            setEditingLog(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-lg font-medium"
        >
          <Plus className="w-5 h-5" /> New Work Log
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Today's Hours</p>
            <p className="text-3xl font-bold text-white">{todayHours.toFixed(1)}h</p>
          </div>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Pending Submission</p>
            <p className="text-3xl font-bold text-white">{pendingLogs.length}</p>
          </div>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Logs</p>
            <p className="text-3xl font-bold text-white">{logs.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Logs List */}
          <div className="bg-card border border-white/10 rounded-2xl overflow-hidden h-full">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Recent Work Logs
              </h2>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading timesheets...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No work logs found. Click "New Work Log" to create your first entry.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-white/5">
                    <tr>
                      <th className="px-6 py-4">ID / Date</th>
                      <th className="px-6 py-4">Project / Task</th>
                      <th className="px-6 py-4">Hours</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{log.logId}</div>
                          <div className="text-xs flex items-center gap-1 text-gray-400 mt-1">
                            <CalendarIcon className="w-3 h-3" />
                            {format(new Date(log.date), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-primary">
                            {log.projectId ? log.projectId.name : "General Work"}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[200px] mt-1">
                            {log.taskId ? log.taskId.name : "No specific task"}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {log.totalHoursWorked}h
                          <div className="text-xs text-gray-500 mt-1">
                            {log.startTime} - {log.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                            ${log.status === 'Draft' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 
                              log.status === 'Submitted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                              log.status === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                              log.status === 'Request Changes' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 
                              'bg-purple-500/20 text-purple-400 border-purple-500/30'}
                          `}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(log.status === 'Draft' || log.status === 'Request Changes') ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(log)} className="text-primary hover:text-primary/80 font-medium px-3 py-1 bg-primary/10 rounded-lg">
                                Edit
                              </button>
                              <button onClick={() => handleSubmit(log._id)} className="text-green-400 hover:text-green-300 font-medium px-3 py-1 bg-green-500/10 rounded-lg">
                                Submit
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => handleEdit(log)} className="text-gray-400 hover:text-white font-medium px-3 py-1 bg-white/5 rounded-lg">
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ActivityTimeline events={timelineEvents} date={new Date()} />
        </div>
      </div>
    </div>
  );
}
