import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { LeaveRequest } from '@/lib/models/LeaveRequest';
import { LeaveBalance } from '@/lib/models/LeaveBalance';
import { Attendance } from '@/lib/models/Attendance';
import { jwtVerify } from 'jose';
import mongoose from 'mongoose';

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

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    // Only Admin or Manager can approve
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { requestId } = await req.json();

    const leaveRequest = await LeaveRequest.findById(requestId);
    if (!leaveRequest) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    if (leaveRequest.status !== 'Pending') {
      return NextResponse.json({ error: `Cannot approve request that is already ${leaveRequest.status}` }, { status: 400 });
    }

    const currentYear = new Date(leaveRequest.startDate).getFullYear();

    // 1. Update Leave Balance
    const leaveBalance = await LeaveBalance.findOne({ 
      employeeId: leaveRequest.employeeId, 
      year: currentYear 
    });

    if (leaveBalance) {
      const balanceIndex = leaveBalance.balances.findIndex((b: any) => b.leaveType === leaveRequest.leaveType);
      if (balanceIndex !== -1) {
        leaveBalance.balances[balanceIndex].usedLeaves += leaveRequest.totalDays;
        
        // For static leaves, remaining is total - used. 
        // For Earned Leave, remaining is calculated dynamically during GET, but we update usedLeaves here.
        if (leaveRequest.leaveType !== 'Earned Leave') {
          leaveBalance.balances[balanceIndex].remainingLeaves -= leaveRequest.totalDays;
        }
        await leaveBalance.save();
      }
    }

    // 2. Mark Attendance as "Leave" for approved days
    const start = new Date(leaveRequest.startDate);
    const end = new Date(leaveRequest.endDate);
    const datesToMark = [];
    const curDate = new Date(start);
    curDate.setUTCHours(0,0,0,0);
    end.setUTCHours(0,0,0,0);

    while (curDate <= end) {
      const dayOfWeek = curDate.getUTCDay();
      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        datesToMark.push(new Date(curDate));
      }
      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }

    const attendanceOperations = datesToMark.map(date => ({
      updateOne: {
        filter: { employeeId: leaveRequest.employeeId, date },
        update: { 
          $set: { 
            employeeId: leaveRequest.employeeId, 
            date, 
            status: (leaveRequest.leaveType === 'Work From Home' ? 'Work From Home' : 'Leave') as "Work From Home" | "Leave",
            workingHours: leaveRequest.leaveType === 'Work From Home' ? 9 : 0,
            notes: `Approved ${leaveRequest.leaveType}` 
          } 
        },
        upsert: true
      }
    }));

    if (attendanceOperations.length > 0) {
      await Attendance.bulkWrite(attendanceOperations);
    }

    // 3. Update Request Status
    leaveRequest.status = 'Approved';
    leaveRequest.approvedBy = new mongoose.Types.ObjectId(user.userId as string);
    leaveRequest.approvedDate = new Date();
    await leaveRequest.save();

    return NextResponse.json({ success: true, message: 'Leave approved and attendance integrated.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error approving leave:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
