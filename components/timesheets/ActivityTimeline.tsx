import { Clock, CheckCircle, Play, Pause, FileText, User } from "lucide-react";
import { format } from "date-fns";

export interface TimelineEvent {
  id: string;
  time: string; // ISO string or HH:MM
  title: string;
  description?: string;
  type: 'start' | 'stop' | 'complete' | 'log' | 'meeting' | 'general';
}

export default function ActivityTimeline({ events, date }: { events: TimelineEvent[], date: Date }) {
  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  const getIcon = (type: string) => {
    switch (type) {
      case 'start': return <Play className="w-4 h-4 text-green-400" />;
      case 'stop': return <Pause className="w-4 h-4 text-orange-400" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'log': return <FileText className="w-4 h-4 text-primary" />;
      case 'meeting': return <User className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" /> Daily Activity Timeline
      </h3>
      <div className="text-sm text-gray-400 mb-6">
        {format(date, 'EEEE, MMMM dd, yyyy')}
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent hidden md:block">
        <div className="absolute top-0 bottom-0 left-[11px] w-0.5 bg-white/10" />
        
        {sortedEvents.length === 0 ? (
          <p className="text-gray-500 italic relative z-10 pl-4">No activity recorded for this day yet.</p>
        ) : (
          sortedEvents.map((event, idx) => (
            <div key={event.id || idx} className="relative z-10 pl-6 flex items-start gap-4 group">
              <div className="absolute left-[-16px] w-8 h-8 rounded-full bg-background border-2 border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                {getIcon(event.type)}
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 group-hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-white font-bold">{event.title}</h4>
                  <span className="text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded-lg">
                    {event.time.includes('T') ? format(new Date(event.time), 'HH:mm') : event.time}
                  </span>
                </div>
                {event.description && (
                  <p className="text-gray-400 text-sm mt-2">{event.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile view fallback without complex pseudo elements */}
      <div className="md:hidden space-y-4">
        {sortedEvents.map((event, idx) => (
          <div key={event.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(event.type)}
                  <h4 className="text-white font-bold">{event.title}</h4>
                </div>
                <span className="text-primary text-xs font-bold">{event.time.includes('T') ? format(new Date(event.time), 'HH:mm') : event.time}</span>
              </div>
              {event.description && <p className="text-gray-400 text-sm">{event.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
