import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { LeaveRequest } from '@/lib/models/LeaveRequest';
import { Employee } from '@/lib/models/Employee';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_fallback_key_for_development_only'
);

async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload; // { userId, role, email }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status');
    const typeFilter = url.searchParams.get('type');
    
    const query: any = {};

    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }
    if (typeFilter && typeFilter !== 'all') {
      query.leaveType = typeFilter;
    }

    if (user.role === 'employee') {
      // Employees only see their own leaves
      const employee = await Employee.findOne({ userId: user.userId as string });
      if (!employee) return NextResponse.json({ success: true, leaves: [] }, { status: 200 });
      query.employeeId = employee._id;
    } else if (user.role === 'manager') {
      // Managers see their team's leaves
      // Implementation depends on how teams are structured. For now, fetch all.
    }

    const leaves = await LeaveRequest.find(query)
      .populate('employeeId', 'firstName lastName employeeId department designation')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, leaves }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
