'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Shield, ShieldAlert, ShieldCheck,
  CheckCircle2, XCircle, Clock, Ban,
  Search, Filter
} from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  role: {
    _id: string;
    name: 'superadmin' | 'admin' | 'user';
  };
  failedLoginAttempts: number;
  createdAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('Could not load users. You may not have permission.');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, updates: Partial<UserData>) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
      
      // Optimistic UI update
      setUsers(users.map(u => u._id === id ? { ...u, ...updates } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20"><CheckCircle2 className="w-3 h-3"/> Approved</span>;
      case 'pending': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20"><Clock className="w-3 h-3"/> Pending</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20"><XCircle className="w-3 h-3"/> Rejected</span>;
      case 'suspended': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs font-semibold border border-gray-500/20"><Ban className="w-3 h-3"/> Suspended</span>;
      default: return null;
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'superadmin': return <ShieldAlert className="w-4 h-4 text-primary" />;
      case 'admin': return <ShieldCheck className="w-4 h-4 text-primary/70" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) return <div className="p-8 text-white">Loading users...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Review and approve user registrations, manage roles and access.</p>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-sm font-semibold text-gray-400">User</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-400">Role</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-400">Joined</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No users found matching your filters.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role?.name)}
                      <span className="text-sm text-gray-300 capitalize">{user.role?.name || 'User'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(user.status)}
                    {user.failedLoginAttempts > 0 && (
                      <div className="text-[10px] text-red-400 mt-1">{user.failedLoginAttempts} failed logins</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'pending' && (
                        <>
                          <button onClick={() => updateUser(user._id, { status: 'approved' })} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-xs font-semibold transition-colors">Approve</button>
                          <button onClick={() => updateUser(user._id, { status: 'rejected' })} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold transition-colors">Reject</button>
                        </>
                      )}
                      {user.status === 'approved' && (
                        <button onClick={() => updateUser(user._id, { status: 'suspended' })} className="px-3 py-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border border-gray-500/20 rounded-lg text-xs font-semibold transition-colors">Suspend</button>
                      )}
                      {(user.status === 'suspended' || user.status === 'rejected') && (
                        <button onClick={() => updateUser(user._id, { status: 'approved' })} className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold transition-colors">Reactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
