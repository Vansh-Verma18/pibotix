"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft, Mail, Phone, MapPin, Building, Calendar, 
  DollarSign, ShieldAlert, HeartPulse, UserCircle2, Briefcase, FileText
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Employee = {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  manager?: string;
  joiningDate: string;
  status: string;
  employmentType: string;
  salary: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  skills: string[];
  notes?: string;
};

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees/${params.id}`);
        if (!res.ok) {
          router.push('/admin/employees');
          return;
        }
        const data = await res.json();
        setEmployee(data.employee);
      } catch (error) {
        console.error(error);
        router.push('/admin/employees');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchEmployee();
    }
  }, [params.id, router]);

  if (loading) {
    return <div className="p-10 text-center text-gray-400 animate-pulse">Loading Profile...</div>;
  }

  if (!employee) return null;

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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <Link href="/admin/employees" className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {employee.firstName} {employee.lastName}
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(employee.status)}`}>
              {employee.status}
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">{employee.designation} • {employee.employeeId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal & Contact */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <UserCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{employee.firstName} {employee.lastName}</h2>
            <p className="text-primary text-sm font-medium mb-4">{employee.department}</p>
            
            <div className="w-full flex flex-wrap gap-2 justify-center mb-6">
              {employee.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Contact Information</h3>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Mail className="w-4 h-4 text-gray-500" />
              <a href={`mailto:${employee.email}`} className="hover:text-primary transition-colors">{employee.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={`tel:${employee.phone}`} className="hover:text-primary transition-colors">{employee.phone}</a>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <span>{employee.address}</span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-card border border-red-500/20 bg-red-500/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 border-b border-red-500/20 pb-2 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> Emergency Contact
            </h3>
            <div>
              <p className="text-white font-medium">{employee.emergencyContact.name}</p>
              <p className="text-xs text-gray-400 mb-2">{employee.emergencyContact.relation}</p>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href={`tel:${employee.emergencyContact.phone}`} className="hover:text-primary transition-colors">{employee.emergencyContact.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Employment & Extras */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Employment Details */}
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Employment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                <p className="text-white font-medium font-mono">{employee.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Employment Type</p>
                <p className="text-white font-medium">{employee.employmentType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Joining Date</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(employee.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Annual Salary</p>
                <p className="text-white font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  {employee.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  {employee.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Manager</p>
                <p className="text-white font-medium">{employee.manager || 'Not Assigned'}</p>
              </div>
            </div>
            
            {employee.notes && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Internal Notes</p>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl">{employee.notes}</p>
              </div>
            )}
          </div>

          {/* Placeholders for Future Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 border-dashed p-6 rounded-2xl flex flex-col items-center justify-center text-center h-48 opacity-70">
              <Briefcase className="w-8 h-8 text-gray-500 mb-3" />
              <h3 className="text-white font-semibold">Assigned Projects</h3>
              <p className="text-xs text-gray-400 mt-1">Module coming soon</p>
            </div>
            <div className="bg-white/5 border border-white/10 border-dashed p-6 rounded-2xl flex flex-col items-center justify-center text-center h-48 opacity-70">
              <Calendar className="w-8 h-8 text-gray-500 mb-3" />
              <h3 className="text-white font-semibold">Attendance & Leave</h3>
              <p className="text-xs text-gray-400 mt-1">Module coming soon</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
