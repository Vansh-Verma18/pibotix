import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Employee } from "@/lib/models/Employee";
import { Attendance } from "@/lib/models/Attendance";
import { LeaveRequest } from "@/lib/models/LeaveRequest";
import { Payroll } from "@/lib/models/Payroll";
import { jwtVerify } from 'jose';
import mongoose from "mongoose";

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
    
    const decoded = await verifyAuth(req);
    // Only superadmin or admin can generate payroll
    if (!decoded || decoded.role === 'employee') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { month, year } = await req.json();
    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    // 1. Delete any existing 'Pending' payrolls for this month/year so we can regenerate
    await Payroll.deleteMany({ salaryMonth: month, salaryYear: year, paymentStatus: 'Pending' });

    // 2. Fetch all active employees
    const employees = await Employee.find({ status: 'Active' });
    
    // 3. Define date ranges for queries
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const daysInMonth = endDate.getDate();

    let generatedCount = 0;

    for (const emp of employees) {
      // Check if a Processing/Paid payroll already exists
      const existing = await Payroll.findOne({ employeeId: emp._id, salaryMonth: month, salaryYear: year });
      if (existing) continue; // Skip employees who are already locked in

      const annualSalary = emp.salary || 0;
      const grossMonthly = annualSalary / 12;
      
      const basicSalary = grossMonthly * 0.50;
      const hra = grossMonthly * 0.20;
      const medicalAllowance = grossMonthly * 0.10;
      const travelAllowance = grossMonthly * 0.10;
      const specialAllowance = grossMonthly * 0.10;

      // Attendance Analytics
      // Find all unpaid leave requests for the month
      const unpaidLeaves = await LeaveRequest.find({
        employeeId: emp._id,
        leaveType: 'Unpaid Leave',
        status: 'Approved',
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      });

      let totalUnpaidLeaveDays = 0;
      unpaidLeaves.forEach(leave => {
        // Calculate overlap with the current month
        const leaveStart = new Date(Math.max(leave.startDate.getTime(), startDate.getTime()));
        const leaveEnd = new Date(Math.min(leave.endDate.getTime(), endDate.getTime()));
        const diffTime = Math.abs(leaveEnd.getTime() - leaveStart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        totalUnpaidLeaveDays += diffDays;
      });

      // Find Attendance Absences that are NOT covered by approved leaves
      const absences = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: startDate, $lte: endDate },
        status: 'Absent'
      });

      // Very simple logic: Total deductions = unpaid leaves + unaccounted absent days
      // In a robust engine, we'd check if the 'Absent' day already falls within an 'Unpaid' or 'Paid' leave window.
      // For this implementation, we assume Unpaid Leaves are already tracked, and 'Absent' means unexcused absence.
      const unexcusedAbsenceDays = absences.length;
      
      const totalDeductionDays = totalUnpaidLeaveDays + unexcusedAbsenceDays;
      const perDaySalary = grossMonthly / daysInMonth;
      const leaveDeduction = totalDeductionDays * perDaySalary;

      // Overtime Pay calculation (Basic assumed: Overtime is paid at basic/hr * 1.5)
      // Assuming 8 hours a day, 22 working days = ~176 hours/month
      const hourlyBasic = basicSalary / 176;
      
      // Aggregate total overtime hours from Attendance
      const attendances = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: startDate, $lte: endDate }
      });
      const totalOvertimeHours = attendances.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
      const overtimePay = totalOvertimeHours * (hourlyBasic * 1.5);

      // Taxes & PF
      // Standard PF in India is 12% of Basic Salary
      const providentFund = basicSalary * 0.12;
      
      // Tax: Simplified slab. If Annual > 500k, 10% tax on monthly gross
      const tax = annualSalary > 500000 ? (grossMonthly * 0.10) : 0;
      
      const latePenalty = 0;
      const insurance = 0;
      const otherDeductions = 0;

      const totalEarnings = grossMonthly + overtimePay; // Performance bonuses can be added later manually
      const totalDeductions = tax + providentFund + insurance + latePenalty + leaveDeduction + otherDeductions;
      
      const netSalary = Math.max(totalEarnings - totalDeductions, 0);

      // Create Draft Payroll
      await Payroll.create({
        employeeId: emp._id,
        salaryMonth: month,
        salaryYear: year,
        basicSalary,
        hra,
        medicalAllowance,
        travelAllowance,
        specialAllowance,
        overtimePay,
        grossSalary: totalEarnings,
        tax,
        providentFund,
        insurance,
        latePenalty,
        leaveDeduction,
        otherDeductions,
        totalDeductions,
        netSalary,
        paymentStatus: 'Pending',
        paymentMethod: 'Bank Transfer',
        createdBy: new mongoose.Types.ObjectId(decoded.userId as string),
      });

      generatedCount++;
    }

    return NextResponse.json({ success: true, message: `Successfully generated ${generatedCount} payroll records.` });
  } catch (error: any) {
    console.error("POST Generate Payroll Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
