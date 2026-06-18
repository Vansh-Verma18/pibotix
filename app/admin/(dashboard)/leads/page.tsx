"use client";

import { useEffect, useState } from "react";
import { 
  Search, Filter, MoreVertical, CheckCircle, 
  Clock, XCircle, ChevronDown, Mail, Phone, Building, Trash2, X
} from "lucide-react";

type Lead = {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  serviceOfInterest?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
};

const statusColors = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  qualified: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const statusIcons = {
  new: <Clock className="w-4 h-4" />,
  contacted: <Mail className="w-4 h-4" />,
  qualified: <CheckCircle className="w-4 h-4" />,
  closed: <XCircle className="w-4 h-4" />,
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus as 'new' | 'contacted' | 'qualified' | 'closed' } : lead));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus as 'new' | 'contacted' | 'qualified' | 'closed' });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update lead status');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete lead');
      
      setLeads(leads.filter(lead => lead._id !== id));
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to delete lead');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading Leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Lead Management</h1>
          <p className="text-gray-400">Manage and track your incoming business inquiries.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search leads by name, email, or company..." 
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
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
                <th className="p-4 text-sm font-medium text-gray-400">Name / Company</th>
                <th className="p-4 text-sm font-medium text-gray-400">Contact</th>
                <th className="p-4 text-sm font-medium text-gray-400">Date</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3" /> {lead.company}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-300 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-500" /> {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3 text-gray-500" /> {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border appearance-none cursor-pointer outline-none ${statusColors[lead.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openLeadDetail(lead)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => deleteLead(lead._id)}
                          className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Delete Lead"
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
      {isDetailModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedLead.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {selectedLead.company}</span>
                  <span>Submitted: {new Date(selectedLead.createdAt).toLocaleString()}</span>
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
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Info</h3>
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-gray-300" />
                      </div>
                      <a href={`mailto:${selectedLead.email}`} className="text-white hover:text-primary transition-colors break-all">
                        {selectedLead.email}
                      </a>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-gray-300" />
                        </div>
                        <a href={`tel:${selectedLead.phone}`} className="text-white hover:text-primary transition-colors">
                          {selectedLead.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lead Status</h3>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center h-[calc(100%-24px)]">
                    <select
                      value={selectedLead.status}
                      onChange={(e) => updateLeadStatus(selectedLead._id, e.target.value)}
                      className={`w-full p-3 rounded-lg border outline-none cursor-pointer font-medium appearance-none ${statusColors[selectedLead.status]}`}
                    >
                      <option value="new">New (Unread)</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedLead.serviceOfInterest && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Service of Interest</h3>
                  <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg inline-block font-medium">
                    {selectedLead.serviceOfInterest}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</h3>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-between bg-white/[0.02] rounded-b-2xl">
              <button 
                onClick={() => deleteLead(selectedLead._id)}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete Lead
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
