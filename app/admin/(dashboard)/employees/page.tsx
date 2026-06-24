"use client";

import { useEffect, useState } from "react";
import { 
  Search, Filter, Plus, Users, UserCheck, 
  UserPlus, Building, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import Link from "next/link";
import EmployeeFormModal from "@/components/hrms/EmployeeFormModal";

type Employee = {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: string;
  employmentType: string;
};

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees?search=${searchTerm}&department=${departmentFilter}&status=${statusFilter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchEmployees();
      setCurrentPage(1); // Reset to page 1 on filter change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, departmentFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this employee?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmployees(employees.filter(e => e._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  // KPIs Calculation
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const currentMonth = new Date().getMonth();
  const newThisMonth = employees.filter(e => new Date(e.joiningDate).getMonth() === currentMonth).length;
  const uniqueDepartments = new Set(employees.map(e => e.department)).size;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Inactive': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'Resigned': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Terminated': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/10 text-gray-400 border-white/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Employee Management</h1>
          <p className="text-gray-400">Manage your workforce, departments, and employee records.</p>
        </div>
        <button 
          onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Employee
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-white/10 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Employees</p>
            <p className="text-2xl font-bold text-white">{totalEmployees}</p>
          </div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Employees</p>
            <p className="text-2xl font-bold text-white">{activeEmployees}</p>
          </div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">New This Month</p>
            <p className="text-2xl font-bold text-white">{newThisMonth}</p>
          </div>
        </div>
        <div className="bg-card border border-white/10 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Departments</p>
            <p className="text-2xl font-bold text-white">{uniqueDepartments}</p>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name, ID or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-40">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-background border border-white/10 rounded-lg text-white text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="all">All Depts</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-1 md:w-40 px-3 py-2 bg-background border border-white/10 rounded-lg text-white text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee ID</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name & Role</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joining Date</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading records...</td></tr>
              ) : currentEmployees.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No employees found.</td></tr>
              ) : (
                currentEmployees.map(emp => (
                  <tr key={emp._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-400">{emp.employeeId}</td>
                    <td className="p-4">
                      <div className="font-medium text-white">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{emp.designation} • {emp.employmentType}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">{emp.department}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/employees/${emp._id}`} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { setEditingEmployee(emp); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(emp._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Delete">
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400 bg-white/[0.02]">
            <div>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, employees.length)} of {employees.length} entries</div>
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

      {isModalOpen && (
        <EmployeeFormModal 
          employee={editingEmployee}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchEmployees(); }} 
        />
      )}
    </div>
  );
}
