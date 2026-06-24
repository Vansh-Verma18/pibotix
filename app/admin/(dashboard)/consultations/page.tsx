"use client";

import { useEffect, useState } from "react";
import { 
  Search, Filter, CalendarCheck, Clock, Calendar,
  ChevronDown, Mail, Phone, Trash2, X, Building, Download, CheckCircle, XCircle, RefreshCw
} from "lucide-react";

type Consultation = {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  service: string;
  industry: string;
  budget: string;
  documentUrl?: string;
  preferredDate: string;
  timeSlot: string;
  topic: string;
  message: string;
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'cancelled' | 'rejected' | 'rescheduled';
  createdAt: string;
};

const statusColors: any = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  scheduled: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  rescheduled: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  
  // Reschedule Form State
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/admin/consultations');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string, extraData: any = {}) => {
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, ...extraData }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      const updatedConsultation = { ...consultations.find(c => c._id === id), status: newStatus, ...extraData } as Consultation;
      setConsultations(consultations.map(c => c._id === id ? updatedConsultation : c));
      
      if (selectedConsultation && selectedConsultation._id === id) {
        setSelectedConsultation(updatedConsultation);
      }
      setIsRescheduleMode(false);
      
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const deleteConsultation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation request?')) return;
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setConsultations(consultations.filter(c => c._id !== id));
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to delete consultation request');
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetail = (c: Consultation) => {
    setSelectedConsultation(c);
    setIsRescheduleMode(false);
    setNewDate(c.preferredDate);
    setNewTime(c.timeSlot);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading Consultations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Consultation Bookings</h1>
          <p className="text-gray-400">Manage, approve, reject, and reschedule client consultations.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name, email or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-sm font-medium text-gray-400">Client Info</th>
                <th className="p-4 text-sm font-medium text-gray-400">Service / Budget</th>
                <th className="p-4 text-sm font-medium text-gray-400">Requested Time</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No consultation bookings found.
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((c) => (
                  <tr key={c._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3" /> {c.company} ({c.industry || 'Unknown'})
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-white font-medium">{c.service || c.topic}</div>
                      <div className="text-xs text-gray-500 mt-1">{c.budget || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-300 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-500" /> {new Date(c.preferredDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-500" /> {c.timeSlot}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[c.status] || statusColors.pending} capitalize`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openDetail(c)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded transition-colors flex items-center gap-1"
                        >
                          <CalendarCheck className="w-3 h-3" /> View & Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedConsultation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Booking Management</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Requested on {new Date(selectedConsultation.createdAt).toLocaleString()}</span>
                  <span className={`px-2 py-0.5 rounded text-xs border uppercase tracking-wider font-bold ${statusColors[selectedConsultation.status]}`}>
                    {selectedConsultation.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Client Profile</h3>
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-white font-medium">{selectedConsultation.name}</div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedConsultation.company} <span className="text-gray-500">({selectedConsultation.industry || 'Unknown'})</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedConsultation.email}`} className="text-gray-300 hover:text-primary transition-colors">
                        {selectedConsultation.email}
                      </a>
                    </div>
                    {selectedConsultation.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedConsultation.phone}`} className="text-gray-300 hover:text-primary transition-colors">
                          {selectedConsultation.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Overview</h3>
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="text-gray-400">Service:</span>
                      <span className="text-white font-medium">{selectedConsultation.service || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="text-gray-400">Topic:</span>
                      <span className="text-white font-medium">{selectedConsultation.topic}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-green-400 font-bold">{selectedConsultation.budget || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-1">
                      <span className="text-gray-400">Document:</span>
                      {selectedConsultation.documentUrl ? (
                        <a href={selectedConsultation.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <Download className="w-3 h-3" /> View Attachment
                        </a>
                      ) : (
                        <span className="text-gray-600 italic">None attached</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detailed Description</h3>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedConsultation.message || 'No description provided.'}
                </div>
              </div>

              {/* Scheduling Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time Slot Management</h3>
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {!isRescheduleMode ? (
                    <>
                      <div>
                        <div className="flex items-center gap-3 text-lg text-white font-medium mb-1">
                          <Calendar className="w-5 h-5 text-primary" />
                          {new Date(selectedConsultation.preferredDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 font-medium">
                          <Clock className="w-5 h-5 text-primary" />
                          {selectedConsultation.timeSlot}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setIsRescheduleMode(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" /> Reschedule
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">New Date</label>
                          <input 
                            type="date" 
                            value={newDate} 
                            onChange={e => setNewDate(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white [color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">New Time</label>
                          <select 
                            value={newTime} 
                            onChange={e => setNewTime(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white"
                          >
                            <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                            <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                            <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                            <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setIsRescheduleMode(false)}
                          className="px-3 py-1.5 text-gray-400 hover:text-white text-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => updateStatus(selectedConsultation._id, 'rescheduled', { preferredDate: newDate, timeSlot: newTime })}
                          className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90"
                        >
                          Save & Notify Client
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Modal Footer (Admin Actions) */}
            <div className="p-6 border-t border-white/10 flex flex-wrap gap-3 bg-white/[0.02] rounded-b-2xl justify-between items-center">
              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(selectedConsultation._id, 'approved')}
                  disabled={selectedConsultation.status === 'approved'}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" /> Approve Meeting
                </button>
                <button 
                  onClick={() => updateStatus(selectedConsultation._id, 'rejected')}
                  disabled={selectedConsultation.status === 'rejected'}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => deleteConsultation(selectedConsultation._id)}
                  className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete completely"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <select
                  value={selectedConsultation.status}
                  onChange={(e) => updateStatus(selectedConsultation._id, e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-background border border-white/10 outline-none cursor-pointer font-medium appearance-none text-white text-sm"
                >
                  <option value="" disabled>Manual Status Change</option>
                  <option value="pending">Mark Pending</option>
                  <option value="scheduled">Mark Scheduled</option>
                  <option value="completed">Mark Completed</option>
                  <option value="cancelled">Mark Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
