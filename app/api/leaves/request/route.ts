import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { LeaveRequest } from '@/lib/models/LeaveRequest';
import { Employee } from '@/lib/models/Employee';
import { LeaveRequestZodSchema } from '@/types/leave';
import { calculateWorkingDays } from '@/lib/utils/leaveCalculator';
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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate payload
    const validationResult = LeaveRequestZodSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: (validationResult.error as any).errors 
      }, { status: 400 });
    }

    const { leaveType, startDate, endDate, reason, attachmentUrl } = validationResult.data;

    // Find Employee linked to the user
    const employee = await Employee.findOne({ userId: user.userId as string });
    if (!employee) {
      return NextResponse.json({ error: 'No employee record linked to this account.' }, { status: 404 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return NextResponse.json({ error: 'Start date cannot be after end date.' }, { status: 400 });
    }

    // Calculate exact working days (excluding weekends)
    const totalDays = calculateWorkingDays(start, end);

    if (totalDays <= 0) {
      return NextResponse.json({ error: 'The selected date range does not contain any working days.' }, { status: 400 });
    }

    // (Optional enhancement: Fetch LeaveBalance and check if remainingLeaves >= totalDays here)

    const newRequest = await LeaveRequest.create({
      employeeId: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      attachmentUrl,
      status: 'Pending'
    });

    return NextResponse.json({ success: true, leaveRequest: newRequest }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating leave request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
