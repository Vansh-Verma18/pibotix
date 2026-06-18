import connectToDatabase from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { Mail, Phone, Briefcase, Calendar } from 'lucide-react';

// Force dynamic rendering for admin dashboard
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();
  
  // Fetch latest leads
  const leads = await Lead.find({}).sort({ createdAt: -1 }).limit(10).lean();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 font-medium mb-2">Total Leads (All Time)</h3>
          <div className="text-4xl font-bold text-white">{await Lead.countDocuments()}</div>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 font-medium mb-2">New Inquiries (30d)</h3>
          <div className="text-4xl font-bold text-primary">
            {await Lead.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })}
          </div>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 font-medium mb-2">Active Services</h3>
          <div className="text-4xl font-bold text-white">8</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Recent Project Inquiries</h2>
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Interest</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No leads found yet.</td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead._id.toString()} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{lead.company}</td>
                    <td className="px-6 py-4 text-gray-300">{lead.serviceOfInterest || 'General'}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {lead.status}
                      </span>
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
