"use client";

import { useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function LeaveCalendar({ leaves }: { leaves: any[] }) {
  // Simplistic current-month calendar view
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calendarDays = useMemo(() => {
    const days = [];
    // Padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [year, month, daysInMonth, firstDayOfMonth]);

  const getLeavesForDate = (date: Date) => {
    return leaves.filter(l => {
      if (l.status !== 'Approved') return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return date >= start && date <= end;
    });
  };

  const getTypeShort = (type: string) => {
    switch (type) {
      case 'Annual Leave': return 'AL';
      case 'Sick Leave': return 'SL';
      case 'Casual Leave': return 'CL';
      case 'Earned Leave': return 'EL';
      case 'Work From Home': return 'WFH';
      default: return 'LV';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Annual Leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Sick Leave': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Casual Leave': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Work From Home': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden mt-8">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" /> Leave Calendar
        </h3>
        <div className="flex items-center gap-4 text-white font-medium">
          <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded"><ChevronLeft className="w-4 h-4" /></button>
          <span>{monthNames[month]} {year}</span>
          <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, i) => {
            if (!date) return <div key={i} className="min-h-[80px] rounded-xl bg-white/[0.01] border border-white/[0.02]"></div>;
            
            const dayLeaves = getLeavesForDate(date);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div key={i} className={`min-h-[80px] rounded-xl border p-2 flex flex-col gap-1 transition-colors ${isToday ? 'border-primary/50 bg-primary/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                <div className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-gray-400'}`}>{date.getDate()}</div>
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                  {dayLeaves.map((l, idx) => (
                    <div key={idx} className={`text-[10px] font-medium px-1.5 py-0.5 rounded border truncate ${getTypeColor(l.leaveType)}`} title={`${l.employeeId?.firstName} - ${l.leaveType}`}>
                      {getTypeShort(l.leaveType)}: {l.employeeId?.firstName || 'Me'}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> AL = Annual Leave</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> SL = Sick Leave</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> CL = Casual Leave</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span> EL = Earned Leave</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> WFH = Work From Home</div>
        </div>
      </div>
    </div>
  );
}
