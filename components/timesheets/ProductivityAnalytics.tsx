"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ProductivityAnalytics({ logs }: { logs: any[] }) {
  // Aggregate data for Daily Productivity (last 7 days)
  const dailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(dateStr => {
      const dayLogs = logs.filter(l => new Date(l.date).toISOString().split('T')[0] === dateStr);
      const hours = dayLogs.reduce((sum, l) => sum + (l.totalHoursWorked || 0), 0);
      return {
        date: dateStr.slice(5), // MM-DD
        hours: Number(hours.toFixed(1))
      };
    });
  }, [logs]);

  // Aggregate Hours per Project
  const projectData = useMemo(() => {
    const projMap: Record<string, number> = {};
    logs.forEach(l => {
      const pName = l.projectId?.name || "General/Admin";
      projMap[pName] = (projMap[pName] || 0) + (l.totalHoursWorked || 0);
    });
    return Object.entries(projMap)
      .map(([name, hours]) => ({ name, value: Number(hours.toFixed(1)) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5
  }, [logs]);

  // Aggregate Top Employees
  const employeeData = useMemo(() => {
    const empMap: Record<string, number> = {};
    logs.forEach(l => {
      const empName = l.employeeId ? `${l.employeeId.firstName} ${l.employeeId.lastName}` : l.employeeName;
      empMap[empName] = (empMap[empName] || 0) + (l.totalHoursWorked || 0);
    });
    return Object.entries(empMap)
      .map(([name, hours]) => ({ name, hours: Number(hours.toFixed(1)) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5); // top 5
  }, [logs]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const handleExportCSV = () => {
    const rows = [
      ["Log ID", "Date", "Employee", "Project", "Task", "Hours", "Status"],
      ...logs.map(l => [
        l.logId,
        new Date(l.date).toISOString().split('T')[0],
        l.employeeId ? `${l.employeeId.firstName} ${l.employeeId.lastName}` : l.employeeName,
        l.projectId?.name || "General",
        l.taskId?.name || "None",
        l.totalHoursWorked,
        l.status
      ])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `timesheet_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-card border border-white/10 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Timesheet Analytics & Reports</h2>
          <p className="text-sm text-gray-400">Visualizing productivity across {logs.length} total recorded logs.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl font-medium hover:bg-primary/30 transition-colors"
        >
          Export Full CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Team Hours (Last 7 Days)</h3>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Hours per Project</h3>
          <div className="h-[300px] w-full min-w-0 flex items-center justify-center">
            {projectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No project data available</div>
            )}
          </div>
        </div>

      </div>

      <div className="bg-card border border-white/10 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Top Performers (Most Hours Logged)</h3>
        <div className="space-y-4">
          {employeeData.map((emp, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="text-gray-200 font-medium">{emp.name}</span>
              </div>
              <div className="text-white font-bold">{emp.hours} hrs</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
