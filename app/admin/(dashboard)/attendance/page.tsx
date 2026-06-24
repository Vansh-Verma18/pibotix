"use client";

import { useEffect, useState } from "react";
import { 
  Search, Filter, CalendarCheck, Clock, CheckCircle2, 
  XCircle, Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit, Download
} from "lucide-react";

type AttendanceRecord = {
  _id: string;
  date: string;
  employeeId: {
    _id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
  };
  checkInTime?: string;
  checkOutTime?: string;
  workingHours: number;
  overtimeHours: number;
  status: string;
};

export default function AttendanceDashboard() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${dateFilter}&status=${statusFilter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data.attendance || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    setCurrentPage(1);
  }, [dateFilter, statusFilter]);

  // Filter records locally by search term
  const filteredRecords = records.filter(record => {
    const fullName = `${record.employeeId?.firstName} ${record.employeeId?.lastName}`.toLowerCase();
    const empId = record.employeeId?.employeeId?.toLowerCase() || '';
    return fullName.includes(searchTerm.toLowerCase()) || empId.includes(searchTerm.toLowerCase());
  });

  // KPIs Calculation (Based on fetched records for the selected date)
  const presentToday = filteredRecords.filter(r => r.status === 'Present').length;
  const absentToday = filteredRecords.filter(r => r.status === 'Absent').length;
  const wfhToday = filteredRecords.filter(r => r.status === 'Work From Home').length;
  const leaveToday = filteredRecords.filter(r => r.status === 'Leave').length;
  const totalOvertime = filteredRecords.reduce((acc, r) => acc + r.overtimeHours, 0);
  
  const avgAttendancePct = filteredRecords.length > 0 
    ? Math.round(((presentToday + wfhToday + filteredRecords.filter(r => r.status === 'Half Day').length * 0.5) / filteredRecords.length) * 100)
    : 0;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Absent': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Half Day': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Leave': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Work From Home': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Holiday': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-white/10 text-gray-400 border-white/20';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Attendance Management</h1>
          <p className="text-gray-400">Monitor employee attendance, working hours, and overtime.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-lg font-medium transition-colors border border-white/10"
        >
          <Download className="w-5 h-5" /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="text-gray-400 flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-400" /> Present</div>
          <p className="text-2xl font-bold text-white">{presentToday}</p>
        </div>
        <div className="bg-card border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="text-gray-400 flex items-center gap-2 text-sm"><XCircle className="w-4 h-4 text-red-400" /> Absent</div>
          <p className="text-2xl font-bold text-white">{absentToday}</p>
        </div>
        <div className="bg-card border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="text-gray-400 flex items-center gap-2 text-sm"><CalendarIcon className="w-4 h-4 text-blue-400" /> WFH</div>
          <p className="text-2xl font-bold text-white">{wfhToday}</p>
        </div>
        <div className="bg-card border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="text-gray-400 flex items-center gap-2 text-sm"><CalendarCheck className="w-4 h-4 text-yellow-400" /> On Leave</div>
          <p className="text-2xl font-bold text-white">{leaveToday}</p>
        </div>
        <div className="bg-card border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="text-gray-400 flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-purple-400" /> Avg Att. %</div>
          <p className="text-2xl font-bold text-white">{avgAttendancePct}%</p>
        </div>
        <div className="bg-card border border-white/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="text-gray-400 flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-orange-400" /> Overtime (Hrs)</div>
          <p className="text-2xl font-bold text-white">{totalOvertime.toFixed(1)}</p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap w-full md:w-auto gap-3">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 [color-scheme:dark]"
            />
            <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-1 md:w-40 px-3 py-2 bg-background border border-white/10 rounded-lg text-white text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
                <option value="Work From Home">Work From Home</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Check In</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Check Out</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Hrs Worked</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Overtime</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading records...</td></tr>
              ) : currentRecords.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No attendance records found.</td></tr>
              ) : (
                currentRecords.map(record => (
                  <tr key={record._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{record.employeeId?.firstName} {record.employeeId?.lastName}</div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono">{record.employeeId?.employeeId}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{record.employeeId?.department}</td>
                    <td className="p-4 text-sm text-gray-300 font-mono">{formatTime(record.checkInTime)}</td>
                    <td className="p-4 text-sm text-gray-300 font-mono">{formatTime(record.checkOutTime)}</td>
                    <td className="p-4 text-sm font-medium text-white text-right">{record.workingHours.toFixed(2)}h</td>
                    <td className="p-4 text-sm text-orange-400 text-right">{record.overtimeHours > 0 ? `+${record.overtimeHours.toFixed(2)}h` : '-'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400 bg-white/[0.02]">
            <div>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} entries</div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50"
              ><ChevronLeft className="w-4 h-4" /></button>
              
              <div className="flex gap-1">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
                  <button 
                    key={num} 
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 rounded flex items-center justify-center font-medium ${currentPage === num ? 'bg-red-600 text-white' : 'hover:bg-white/10'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50"
              ><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
