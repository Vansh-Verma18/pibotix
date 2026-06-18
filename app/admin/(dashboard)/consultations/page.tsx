"use client";

import { useEffect, useState } from "react";
import { 
  Search, Filter, CalendarCheck, Clock, Calendar,
  ChevronDown, Mail, Phone, Trash2, X, Building
} from "lucide-react";

type Consultation = {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  preferredDate: string;
  timeSlot: string;
  topic: string;
  message: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setConsultations(consultations.map(c => c._id === id ? { ...c, status: newStatus as any } : c));
      if (selectedConsultation && selectedConsultation._id === id) {
        setSelectedConsultation({ ...selectedConsultation, status: newStatus as any });
      }
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
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading Consultations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Consultation Requests</h1>
          <p className="text-gray-400">Manage and schedule client consultations.</p>
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
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
                <th className="p-4 text-sm font-medium text-gray-400">Topic</th>
                <th className="p-4 text-sm font-medium text-gray-400">Requested Time</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No consultation requests found.
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((c) => (
                  <tr key={c._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3" /> {c.company}
                      </div>
                    </td>
                    <td className="p-4 text-white text-sm font-medium">
                      {c.topic}
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
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border appearance-none cursor-pointer outline-none ${statusColors[c.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openDetail(c)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded transition-colors flex items-center gap-1"
                        >
                          <CalendarCheck className="w-3 h-3" /> View
                        </button>
                        <button 
                          onClick={() => deleteConsultation(c._id)}
                          className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Consultation Details</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Requested on {new Date(selectedConsultation.createdAt).toLocaleString()}</span>
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
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Client Info</h3>
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-white font-medium mb-2">{selectedConsultation.name}</div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedConsultation.company}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedConsultation.email}`} className="text-gray-300 hover:text-primary transition-colors break-all">
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
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Requested Slot</h3>
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex flex-col justify-center gap-3">
                     <div className="flex items-center gap-3 text-sm text-primary font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedConsultation.preferredDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>
                     <div className="flex items-center gap-3 text-sm text-primary font-medium">
                        <Clock className="w-4 h-4" />
                        {selectedConsultation.timeSlot}
                     </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Topic</h3>
                <div className="p-3 bg-white/5 border border-white/5 text-white rounded-lg inline-block font-medium">
                  {selectedConsultation.topic}
                </div>
              </div>

              {selectedConsultation.message && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Notes</h3>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedConsultation.message}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                <select
                  value={selectedConsultation.status}
                  onChange={(e) => updateStatus(selectedConsultation._id, e.target.value)}
                  className={`w-full max-w-xs p-3 rounded-lg border outline-none cursor-pointer font-medium appearance-none ${statusColors[selectedConsultation.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-between bg-white/[0.02] rounded-b-2xl">
              <button 
                onClick={() => deleteConsultation(selectedConsultation._id)}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
