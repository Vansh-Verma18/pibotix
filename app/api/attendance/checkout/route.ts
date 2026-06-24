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
    return payload; 
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employee = await Employee.findOne({ userId: user.userId as string });
    if (!employee) {
      return NextResponse.json({ error: 'No employee record linked to this account.' }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return NextResponse.json({ error: 'You have not checked in today.' }, { status: 400 });
    }

    if (attendance.checkOutTime) {
      return NextResponse.json({ error: 'Already checked out today.' }, { status: 400 });
    }

    attendance.checkOutTime = now;

    // Calculate duration in hours
    const durationMs = attendance.checkOutTime.getTime() - attendance.checkInTime.getTime();
    const durationHours = Number((durationMs / (1000 * 60 * 60)).toFixed(2));

    attendance.workingHours = durationHours;

    if (durationHours >= 9) {
      attendance.status = 'Present';
      attendance.overtimeHours = Number((durationHours - 9).toFixed(2));
    } else if (durationHours >= 4) {
      attendance.status = 'Half Day';
      attendance.overtimeHours = 0;
    } else {
      attendance.status = 'Absent';
      attendance.overtimeHours = 0;
    }

    await attendance.save();

    return NextResponse.json({ success: true, attendance }, { status: 200 });

  } catch (error: any) {
    console.error('Error during check-out:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
