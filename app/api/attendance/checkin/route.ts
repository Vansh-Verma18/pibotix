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

    // Identify employee record linked to the user
    const employee = await Employee.findOne({ userId: user.userId as string });
    if (!employee) {
      return NextResponse.json({ error: 'No employee record linked to this account.' }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);

    // Check if already checked in today
    let attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today
    });

    if (attendance && attendance.checkInTime) {
      return NextResponse.json({ error: 'Already checked in today.' }, { status: 400 });
    }

    if (!attendance) {
      attendance = new Attendance({
        employeeId: employee._id,
        date: today,
        status: 'Absent', // Will remain absent until hours are calculated or manually set
        workingHours: 0,
        overtimeHours: 0
      });
    }

    attendance.checkInTime = now;
    await attendance.save();

    return NextResponse.json({ success: true, attendance }, { status: 200 });

  } catch (error: any) {
    console.error('Error during check-in:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
