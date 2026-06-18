"use client";

import { useEffect, useState } from "react";
import { 
  Search, Filter, CheckCircle, Clock, 
  ChevronDown, Mail, Trash2, X, MessageSquare
} from "lucide-react";

type Contact = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
};

const statusColors = {
  unread: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  replied: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setContacts(contacts.map(contact => contact._id === id ? { ...contact, status: newStatus as 'unread' | 'read' | 'replied' } : contact));
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus as 'unread' | 'read' | 'replied' });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update contact status');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact request?')) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete contact');
      
      setContacts(contacts.filter(contact => contact._id !== id));
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to delete contact request');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openContactDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
    // Auto-mark as read if unread
    if (contact.status === 'unread') {
      updateContactStatus(contact._id, 'read');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading Contacts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Contact Requests</h1>
          <p className="text-gray-400">Manage and reply to messages from the contact form.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search messages by name or email..." 
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
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
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
                <th className="p-4 text-sm font-medium text-gray-400">Name</th>
                <th className="p-4 text-sm font-medium text-gray-400">Email</th>
                <th className="p-4 text-sm font-medium text-gray-400">Date</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No contact requests found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-medium text-white">
                      {contact.name}
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-300 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-500" /> {contact.email}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border appearance-none cursor-pointer outline-none ${statusColors[contact.status]}`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openContactDetail(contact)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> View
                        </button>
                        <button 
                          onClick={() => deleteContact(contact._id)}
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
      {isDetailModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedContact.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Submitted: {new Date(selectedContact.createdAt).toLocaleString()}</span>
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
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sender Info</h3>
                  <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-gray-300" />
                      </div>
                      <a href={`mailto:${selectedContact.email}`} className="text-white hover:text-primary transition-colors break-all">
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Status</h3>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center h-[calc(100%-24px)]">
                    <select
                      value={selectedContact.status}
                      onChange={(e) => updateContactStatus(selectedContact._id, e.target.value)}
                      className={`w-full p-3 rounded-lg border outline-none cursor-pointer font-medium appearance-none ${statusColors[selectedContact.status]}`}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</h3>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-between bg-white/[0.02] rounded-b-2xl">
              <button 
                onClick={() => deleteContact(selectedContact._id)}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <div className="flex gap-3">
                <a 
                  href={`mailto:${selectedContact.email}`}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
