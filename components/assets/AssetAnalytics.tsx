"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

export default function AssetAnalytics() {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/assets');
        const data = await res.json();
        if (data.success) {
          setAssets(data.assets);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (assets.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No asset data available for analytics.</div>;
  }

  // 1. Asset Distribution by Category
  const categoryCount = assets.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryData = Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] }));

  // 2. Asset Utilization (Assigned vs Available vs Maintenance)
  const statusCount = assets.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const utilizationData = Object.keys(statusCount).map(key => ({ name: key, value: statusCount[key] }));

  // 3. Inventory Value by Department
  const deptValue = assets.reduce((acc, curr) => {
    const dept = curr.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + (curr.purchaseCost || 0);
    return acc;
  }, {} as Record<string, number>);
  const valueData = Object.keys(deptValue).map(key => ({ name: key, value: deptValue[key] }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Distribution */}
      <div className="bg-card border border-white/10 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Asset Categories</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Utilization */}
      <div className="bg-card border border-white/10 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Asset Utilization</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={utilizationData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label
              >
                {utilizationData.map((entry, index) => {
                  let color = COLORS[index % COLORS.length];
                  if (entry.name === 'Available') color = '#10b981';
                  if (entry.name === 'Assigned') color = '#3b82f6';
                  if (entry.name === 'In Maintenance') color = '#f59e0b';
                  if (entry.name === 'Damaged' || entry.name === 'Critical') color = '#ef4444';
                  if (entry.name === 'Retired') color = '#6b7280';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Value */}
      <div className="bg-card border border-white/10 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Value by Department</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <RechartsTooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
