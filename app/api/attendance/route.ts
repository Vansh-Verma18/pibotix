import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Attendance } from '@/lib/models/Attendance';
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
    return payload; // contains { userId, role, email }
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

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId') || '';
    const date = searchParams.get('date') || '';
    const status = searchParams.get('status') || '';

    const query: any = {};
    if (employeeId) query.employeeId = employeeId;
    if (date) {
      // Expecting YYYY-MM-DD
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (status && status !== 'all') query.status = status;

    // RBAC
    if (user.role === 'employee') {
      // Employees can only see their own attendance
      const employeeRecord = await Employee.findOne({ userId: user.userId as string });
      if (!employeeRecord) {
        return NextResponse.json({ success: true, attendance: [] }, { status: 200 });
      }
      query.employeeId = employeeRecord._id;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeId department designation')
      .sort({ date: -1 });

    return NextResponse.json({ success: true, attendance: attendanceRecords }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
