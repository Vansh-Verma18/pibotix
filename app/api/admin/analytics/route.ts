import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Lead } from '@/lib/models/Lead';
import { SiteAnalytics } from '@/lib/models/SiteAnalytics';
import { Service } from '@/lib/models/Service';

export async function GET() {
  try {
    await dbConnect();
    
    // Total Leads count
    const totalLeads = await Lead.countDocuments();
    
    // Website Visitors from SiteAnalytics (aggregate if there are multiple days, else mock)
    // For simplicity, we just sum up visitors
    const analytics = await SiteAnalytics.aggregate([
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: '$visitors' },
          totalPageViews: { $sum: '$pageViews' },
        }
      }
    ]);
    const totalVisitors = analytics[0]?.totalVisitors || 0;
    
    // Services
    const services = await Service.find().sort({ views: -1 }).limit(4);

    return NextResponse.json({
      totalVisitors,
      totalLeads,
      conversionRate: totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(2) : 0,
      services,
      // You can add more complex aggregations here if needed
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
