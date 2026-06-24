import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Employee } from '@/lib/models/Employee';
import { LeaveBalance } from '@/lib/models/LeaveBalance';
import { calculateAccumulatedEarnedLeave, LEAVE_POLICY } from '@/lib/utils/leaveCalculator';
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

    // Determine target employee ID
    const url = new URL(req.url);
    const requestedEmpId = url.searchParams.get('employeeId');
    
    let employee;
    if (requestedEmpId && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'manager')) {
      employee = await Employee.findById(requestedEmpId);
    } else {
      employee = await Employee.findOne({ userId: user.userId as string });
    }

    if (!employee) {
      return NextResponse.json({ error: 'Employee record not found.' }, { status: 404 });
    }

    const currentYear = new Date().getFullYear();
    
    // Fetch existing balance or initialize it
    let leaveBalance = await LeaveBalance.findOne({ employeeId: employee._id, year: currentYear });
    
    if (!leaveBalance) {
      // Initialize basic leave limits for the year
      const defaultBalances: any[] = [
        { leaveType: 'Annual Leave', totalAllocated: LEAVE_POLICY.ANNUAL_ALLOCATION, usedLeaves: 0, remainingLeaves: LEAVE_POLICY.ANNUAL_ALLOCATION, carryForwardLeaves: 0 },
        { leaveType: 'Casual Leave', totalAllocated: LEAVE_POLICY.CASUAL_ALLOCATION, usedLeaves: 0, remainingLeaves: LEAVE_POLICY.CASUAL_ALLOCATION, carryForwardLeaves: 0 },
        { leaveType: 'Sick Leave', totalAllocated: LEAVE_POLICY.SICK_ALLOCATION, usedLeaves: 0, remainingLeaves: LEAVE_POLICY.SICK_ALLOCATION, carryForwardLeaves: 0 },
        // Earned Leave allocation is dynamic, so default to 0 initial allocation, calculated later
        { leaveType: 'Earned Leave', totalAllocated: 0, usedLeaves: 0, remainingLeaves: 0, carryForwardLeaves: 0 }
      ];
      
      leaveBalance = await LeaveBalance.create({
        employeeId: employee._id,
        year: currentYear,
        balances: defaultBalances
      });
    }

    // Dynamically calculate Earned Leaves based on months worked
    const totalEarnedGenerated = calculateAccumulatedEarnedLeave(employee.joiningDate, new Date());
    
    // Check if there is carry forward logic applied from previous years (Mock implementation)
    // Here we would fetch last year's balance and carry forward remaining EL up to LEAVE_POLICY.MAX_CARRY_FORWARD.
    // For simplicity, we just bind current generated to remaining.
    
    const balancesResponse = leaveBalance.balances.map((b: any) => {
      if (b.leaveType === 'Earned Leave') {
        // dynamic calculation overrides DB allocation
        const totalEL = totalEarnedGenerated + b.carryForwardLeaves;
        const remainingEL = totalEL - b.usedLeaves;
        return {
          ...b.toObject(),
          totalAllocated: totalEL,
          remainingLeaves: remainingEL
        };
      }
      return b.toObject();
    });

    return NextResponse.json({ success: true, balances: balancesResponse }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching leave balance:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
