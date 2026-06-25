"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Banknote, CalendarDays, Calculator, ArrowRight,
  TrendingUp, Download, Search, FileText, CheckCircle, Clock
} from "lucide-react";

export default function PayrollDashboard() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Month / Year selectors for generation
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchPayrolls = async () => {
    try {
      const res = await fetch('/api/payroll');
      const data = await res.json();
      if (data.success) {
        setPayrolls(data.payrolls);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleGenerate = async () => {
    if (!confirm(`Are you sure you want to generate payroll for ${selectedMonth}/${selectedYear}? This will overwrite any Pending drafts for this period.`)) return;
    
    setGenerating(true);
    try {
      const res = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth, year: selectedYear })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchPayrolls();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Failed to generate payroll");
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  // KPIs
  const currentMonthPayrolls = payrolls.filter(p => p.salaryMonth === selectedMonth && p.salaryYear === selectedYear);
  const totalCost = currentMonthPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const pendingCount = currentMonthPayrolls.filter(p => p.paymentStatus === 'Pending').length;
  const paidCount = currentMonthPayrolls.filter(p => p.paymentStatus === 'Paid').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payroll & Salary</h1>
          <p className="text-gray-400">Manage enterprise payroll, generate payslips, and process salaries.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-card border border-white/10 p-2 rounded-xl">
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="bg-background border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="bg-background border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-primary"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {generating ? <Clock className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {generating ? "Running Engine..." : "Run Engine"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm">Monthly Cost</h3>
              <p className="text-2xl font-bold text-white">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">For Selected Month</div>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm">Salaries Paid</h3>
              <p className="text-2xl font-bold text-white">{paidCount}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Completed transactions</div>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-500/10 text-yellow-400 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm">Pending Approval</h3>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Awaiting finance review</div>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-400 font-medium text-sm">Total Slips Generated</h3>
              <p className="text-2xl font-bold text-white">{currentMonthPayrolls.length}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">For selected period</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-card border border-white/10 rounded-2xl flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Payroll Records</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="bg-background border border-white/10 text-white text-sm rounded-xl pl-9 pr-4 py-2 outline-none focus:border-primary w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-gray-400">
                <th className="p-4 font-medium">Payroll ID</th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Period</th>
                <th className="p-4 font-medium">Gross Salary</th>
                <th className="p-4 font-medium">Deductions</th>
                <th className="p-4 font-medium">Net Salary</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">Loading payroll data...</td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">No payroll records found. Run the engine to generate.</td>
                </tr>
              ) : (
                payrolls.map((pr) => (
                  <tr key={pr._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono text-gray-300">{pr.payrollId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                          {pr.employeeId?.firstName?.[0]}{pr.employeeId?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{pr.employeeId?.firstName} {pr.employeeId?.lastName}</p>
                          <p className="text-xs text-gray-500">{pr.employeeId?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(0, pr.salaryMonth - 1).toLocaleString('default', { month: 'short' })} {pr.salaryYear}
                    </td>
                    <td className="p-4 text-gray-300">${pr.grossSalary?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="p-4 text-red-400">${pr.totalDeductions?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="p-4 font-bold text-green-400">${pr.netSalary?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(pr.paymentStatus)}`}>
                        {pr.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/payroll/${pr._id}`} className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                        Review <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
