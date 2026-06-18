"use client";

import { useEffect, useState } from "react";
import { 
  Users, Activity, TrendingUp, MousePointerClick, 
  ArrowUpRight, Download, BarChart3, Clock
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Mock Analytics Data
const trafficData = [
  { name: 'Mon', visitors: 4000, leads: 240 },
  { name: 'Tue', visitors: 3000, leads: 139 },
  { name: 'Wed', visitors: 2000, leads: 980 },
  { name: 'Thu', visitors: 2780, leads: 390 },
  { name: 'Fri', visitors: 1890, leads: 480 },
  { name: 'Sat', visitors: 2390, leads: 380 },
  { name: 'Sun', visitors: 3490, leads: 430 },
];

const sourceData = [
  { name: 'Organic Search', value: 400, color: '#3b82f6' },
  { name: 'Direct', value: 300, color: '#10b981' },
  { name: 'Referral', value: 300, color: '#f59e0b' },
  { name: 'Social Media', value: 200, color: '#8b5cf6' },
];

const topServices = [
  { name: 'Robotic Welding', views: 12450 },
  { name: 'Predictive Maintenance', views: 8900 },
  { name: 'Warehouse AMRs', views: 7650 },
  { name: 'AI Vision Inspection', views: 6420 },
];

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = () => {
    // Dummy export functionality
    alert("Exporting analytics report as CSV...");
  };

  if (!mounted) return <div className="p-10 text-center text-gray-400">Loading Analytics...</div>;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Overview of your website traffic and lead conversions.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Visitors</h3>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">124,592</div>
          <p className="text-green-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12.5% this month
          </p>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Leads Generated</h3>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">3,039</div>
          <p className="text-green-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +8.2% this month
          </p>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Conversion Rate</h3>
            <MousePointerClick className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">2.44%</div>
          <p className="text-red-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4 rotate-180" /> -0.4% this month
          </p>
        </div>
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Avg. Session</h3>
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">3m 42s</div>
          <p className="text-green-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +1.1% this month
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-card border border-white/10 p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Traffic vs Leads (Last 7 Days)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis yAxisId="left" stroke="#888" />
                <YAxis yAxisId="right" orientation="right" stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Traffic Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {sourceData.map((source) => (
              <div key={source.name} className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                {source.name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Most Viewed Services</h3>
            <button className="text-sm text-primary hover:underline flex items-center">
              View All <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {topServices.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-gray-300 font-medium">{service.name}</span>
                <span className="text-white font-bold">{service.views.toLocaleString()} <span className="text-gray-500 text-sm font-normal">views</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <button className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary font-medium hover:bg-primary/20 transition-colors flex flex-col items-center text-center gap-2">
               <Users className="w-6 h-6" /> View New Leads
             </button>
             <button className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-medium hover:bg-blue-500/20 transition-colors flex flex-col items-center text-center gap-2">
               <FileText className="w-6 h-6" /> Publish Blog Post
             </button>
             <button className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-medium hover:bg-green-500/20 transition-colors flex flex-col items-center text-center gap-2">
               <BarChart3 className="w-6 h-6" /> Generate Report
             </button>
             <button className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 font-medium hover:bg-purple-500/20 transition-colors flex flex-col items-center text-center gap-2">
               <Settings className="w-6 h-6" /> System Settings
             </button>
          </div>
        </div>

      </div>

    </div>
  );
}
