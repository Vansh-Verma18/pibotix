"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle, XCircle, Printer, Calculator, 
  CreditCard, Loader2, Save, Trash2, ShieldCheck 
} from "lucide-react";

export default function PayrollDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [payroll, setPayroll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Editable fields for Pending payrolls
  const [performanceBonus, setPerformanceBonus] = useState(0);
  const [projectBonus, setProjectBonus] = useState(0);
  const [incentives, setIncentives] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [remarks, setRemarks] = useState("");

  const fetchPayroll = async () => {
    try {
      const res = await fetch(`/api/payroll/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setPayroll(data.payroll);
        setPerformanceBonus(data.payroll.performanceBonus || 0);
        setProjectBonus(data.payroll.projectBonus || 0);
        setIncentives(data.payroll.incentives || 0);
        setOtherDeductions(data.payroll.otherDeductions || 0);
        setRemarks(data.payroll.remarks || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [params.id]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/payroll/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          performanceBonus, projectBonus, incentives, otherDeductions, remarks
        })
      });
      if (res.ok) {
        fetchPayroll();
        alert("Draft updated successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update draft");
      }
    } catch (err) {
      alert("Error saving draft");
    } finally {
      setSaving(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!confirm("Are you sure you want to process this payment? This action cannot be reversed.")) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/payroll/${params.id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'Bank Transfer' })
      });
      if (res.ok) {
        fetchPayroll();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to process payment");
      }
    } catch (err) {
      alert("Error processing payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this draft payroll?")) return;
    try {
      const res = await fetch(`/api/payroll/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/payroll');
      }
    } catch (err) {}
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!payroll) return <div className="p-20 text-center text-white">Payroll record not found</div>;

  const isPending = payroll.paymentStatus === 'Pending';
  const monthName = new Date(0, payroll.salaryMonth - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/payroll" className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Payslip Review</h1>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                isPending ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {payroll.paymentStatus}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{monthName} {payroll.salaryYear} • {payroll.payrollId}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium">
            <Printer className="w-4 h-4" /> Print PDF
          </button>
          
          {isPending && (
            <>
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors font-medium">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button onClick={handleProcessPayment} disabled={processing} className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Finalize & Process
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Editable adjustments (only if pending) */}
        <div className="space-y-6">
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Employee Summary</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                {payroll.employeeId?.firstName?.[0]}{payroll.employeeId?.lastName?.[0]}
              </div>
              <div>
                <p className="text-white font-medium text-lg">{payroll.employeeId?.firstName} {payroll.employeeId?.lastName}</p>
                <p className="text-sm text-gray-400">{payroll.employeeId?.designation} • {payroll.employeeId?.department}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Employee ID</span><span className="text-white font-mono">{payroll.employeeId?.employeeId}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Salary Month</span><span className="text-white">{monthName} {payroll.salaryYear}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Generated On</span><span className="text-white">{new Date(payroll.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          {isPending && (
            <div className="bg-card border border-white/10 p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-2">Manual Adjustments</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Performance Bonus ($)</label>
                  <input type="number" value={performanceBonus} onChange={e => setPerformanceBonus(Number(e.target.value))} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Project Bonus ($)</label>
                  <input type="number" value={projectBonus} onChange={e => setProjectBonus(Number(e.target.value))} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Other Incentives ($)</label>
                  <input type="number" value={incentives} onChange={e => setIncentives(Number(e.target.value))} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-red-400/70 mb-1">Other Deductions ($)</label>
                  <input type="number" value={otherDeductions} onChange={e => setOtherDeductions(Number(e.target.value))} className="w-full bg-background border border-red-500/30 rounded-lg px-3 py-2 text-red-400 outline-none focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Remarks</label>
                  <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-primary transition-colors h-20" placeholder="Add note for payslip..." />
                </div>
                <button onClick={handleSaveDraft} disabled={saving} className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Draft
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Standard Payslip Layout */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white text-black p-8 rounded-xl shadow-xl printable-payslip relative">
            {/* Watermark if pending */}
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
                <span className="text-8xl font-bold transform -rotate-45">DRAFT</span>
              </div>
            )}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start border-b-2 border-gray-200 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">PIBOTIX</h2>
                  <p className="text-gray-500 text-sm">Industrial Automation & Robotics</p>
                  <p className="text-gray-400 text-xs mt-1">123 Innovation Drive, Tech Park</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Payslip</h3>
                  <p className="text-gray-600 font-medium mt-1">{monthName} {payroll.salaryYear}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Employee Details</h4>
                  <div className="space-y-1">
                    <p><span className="font-semibold text-gray-700 inline-block w-24">Name:</span> {payroll.employeeId?.firstName} {payroll.employeeId?.lastName}</p>
                    <p><span className="font-semibold text-gray-700 inline-block w-24">ID:</span> {payroll.employeeId?.employeeId}</p>
                    <p><span className="font-semibold text-gray-700 inline-block w-24">Role:</span> {payroll.employeeId?.designation}</p>
                    <p><span className="font-semibold text-gray-700 inline-block w-24">Department:</span> {payroll.employeeId?.department}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Info</h4>
                  <div className="space-y-1">
                    <p><span className="font-semibold text-gray-700 inline-block w-24">Status:</span> {payroll.paymentStatus}</p>
                    <p><span className="font-semibold text-gray-700 inline-block w-24">Method:</span> {payroll.paymentMethod}</p>
                    {payroll.transactionId && <p><span className="font-semibold text-gray-700 inline-block w-24">Txn ID:</span> {payroll.transactionId}</p>}
                    {payroll.processedAt && <p><span className="font-semibold text-gray-700 inline-block w-24">Paid On:</span> {new Date(payroll.processedAt).toLocaleDateString()}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Earnings */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3 uppercase">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Basic Salary</span><span className="font-medium">${payroll.basicSalary.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">House Rent Allowance</span><span className="font-medium">${payroll.hra.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Medical Allowance</span><span className="font-medium">${payroll.medicalAllowance.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Travel Allowance</span><span className="font-medium">${payroll.travelAllowance.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Special Allowance</span><span className="font-medium">${payroll.specialAllowance.toFixed(2)}</span></div>
                    {payroll.overtimePay > 0 && <div className="flex justify-between"><span className="text-gray-600">Overtime Pay</span><span className="font-medium">${payroll.overtimePay.toFixed(2)}</span></div>}
                    {payroll.performanceBonus > 0 && <div className="flex justify-between text-green-700 bg-green-50 p-1 -mx-1 px-1 rounded"><span className="font-medium">Performance Bonus</span><span className="font-bold">${payroll.performanceBonus.toFixed(2)}</span></div>}
                    {payroll.projectBonus > 0 && <div className="flex justify-between text-green-700 bg-green-50 p-1 -mx-1 px-1 rounded"><span className="font-medium">Project Bonus</span><span className="font-bold">${payroll.projectBonus.toFixed(2)}</span></div>}
                    {payroll.incentives > 0 && <div className="flex justify-between text-green-700 bg-green-50 p-1 -mx-1 px-1 rounded"><span className="font-medium">Other Incentives</span><span className="font-bold">${payroll.incentives.toFixed(2)}</span></div>}
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Gross Earnings</span>
                    <span className="font-bold text-gray-900">${payroll.grossSalary.toFixed(2)}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3 uppercase">Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Income Tax (TDS)</span><span className="font-medium">${payroll.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Provident Fund (PF)</span><span className="font-medium">${payroll.providentFund.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Insurance Premium</span><span className="font-medium">${payroll.insurance.toFixed(2)}</span></div>
                    {payroll.latePenalty > 0 && <div className="flex justify-between"><span className="text-gray-600">Late Penalty</span><span className="font-medium">${payroll.latePenalty.toFixed(2)}</span></div>}
                    {payroll.leaveDeduction > 0 && <div className="flex justify-between text-red-700 bg-red-50 p-1 -mx-1 px-1 rounded"><span className="font-medium">Unpaid Leave Deduction</span><span className="font-bold">${payroll.leaveDeduction.toFixed(2)}</span></div>}
                    {payroll.otherDeductions > 0 && <div className="flex justify-between text-red-700 bg-red-50 p-1 -mx-1 px-1 rounded"><span className="font-medium">Other Deductions</span><span className="font-bold">${payroll.otherDeductions.toFixed(2)}</span></div>}
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Total Deductions</span>
                    <span className="font-bold text-gray-900">${payroll.totalDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary Block */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-1">Net Payable Salary</p>
                  <p className="text-4xl font-black text-primary">${payroll.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  {payroll.remarks && (
                    <div className="text-sm text-gray-600 max-w-xs italic mb-2">"{payroll.remarks}"</div>
                  )}
                  <p className="text-xs text-gray-400">Generated: {new Date(payroll.createdAt).toLocaleString()}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
