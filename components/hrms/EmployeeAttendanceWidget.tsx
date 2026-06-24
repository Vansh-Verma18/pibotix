"use client";

import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut, Loader2, AlertCircle } from "lucide-react";

export default function EmployeeAttendanceWidget() {
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const todayStr = new Date().toISOString().split('T')[0];
      // Note: role logic is handled in the backend. 
      // Admin might see their own if they have an Employee profile linked.
      const res = await fetch(`/api/attendance?date=${todayStr}`);
      const data = await res.json();
      if (data.success && data.attendance && data.attendance.length > 0) {
        setAttendance(data.attendance[0]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError("");
    try {
      const res = await fetch("/api/attendance/checkin", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check-in failed");
      setAttendance(data.attendance);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError("");
    try {
      const res = await fetch("/api/attendance/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check-out failed");
      setAttendance(data.attendance);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "--:--";
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (loading) {
    return (
      <div className="bg-card border border-white/10 p-6 rounded-2xl flex items-center justify-center min-h-[150px]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  // Calculate live working hours if checked in but not checked out
  let liveHours = 0;
  if (attendance?.checkInTime && !attendance?.checkOutTime) {
    const diffMs = currentTime.getTime() - new Date(attendance.checkInTime).getTime();
    liveHours = diffMs / (1000 * 60 * 60);
  } else if (attendance?.workingHours) {
    liveHours = attendance.workingHours;
  }

  return (
    <div className="bg-card border border-white/10 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Today's Attendance
        </h3>
        <div className="text-gray-400 font-mono text-lg">{currentTime.toLocaleTimeString()}</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Area */}
        <div className="flex flex-col justify-center bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="text-sm text-gray-400 mb-1">Current Status</div>
          <div className="text-2xl font-bold text-white">
            {attendance?.status || "Not Checked In"}
          </div>
          {attendance?.status === 'Present' && attendance.overtimeHours > 0 && (
             <div className="text-xs text-orange-400 mt-1">+{attendance.overtimeHours.toFixed(2)}h Overtime</div>
          )}
        </div>

        {/* Timers Area */}
        <div className="flex flex-col justify-center bg-white/5 p-4 rounded-xl border border-white/5">
           <div className="flex justify-between items-center mb-2">
             <div className="text-sm text-gray-400">Check In</div>
             <div className="text-white font-mono">{formatTime(attendance?.checkInTime)}</div>
           </div>
           <div className="flex justify-between items-center mb-2">
             <div className="text-sm text-gray-400">Check Out</div>
             <div className="text-white font-mono">{formatTime(attendance?.checkOutTime)}</div>
           </div>
           <div className="flex justify-between items-center pt-2 border-t border-white/10">
             <div className="text-sm text-gray-400 font-medium">Working Hrs</div>
             <div className="text-primary font-mono font-bold">{liveHours > 0 ? liveHours.toFixed(2) + 'h' : '--'}</div>
           </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col justify-center gap-3">
           {!attendance?.checkInTime ? (
             <button 
               onClick={handleCheckIn}
               disabled={actionLoading}
               className="w-full py-3 bg-primary hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
               Check In
             </button>
           ) : !attendance?.checkOutTime ? (
             <button 
               onClick={handleCheckOut}
               disabled={actionLoading}
               className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
               Check Out
             </button>
           ) : (
             <div className="w-full py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl font-medium flex items-center justify-center gap-2">
               <Clock className="w-5 h-5" /> Shift Completed
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
