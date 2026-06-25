import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payroll = await Payroll.findById(id).populate('employeeId');
    if (!payroll) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Restrict employee from seeing others
    if (decoded.role === 'employee') {
      const Employee = mongoose.models.Employee;
      const emp = await Employee.findOne({ userId: decoded.userId });
      if (!emp || emp._id.toString() !== payroll.employeeId._id.toString()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, payroll });
  } catch (error: any) {
    console.error("GET Payroll Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded || decoded.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const payroll = await Payroll.findById(id);
    if (!payroll) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (payroll.paymentStatus !== 'Pending') {
      return NextResponse.json({ error: 'Cannot edit processed payroll' }, { status: 400 });
    }

    // Only allow updating specific fields
    const { performanceBonus, projectBonus, incentives, remarks, otherDeductions } = body;
    
    if (performanceBonus !== undefined) payroll.performanceBonus = Number(performanceBonus);
    if (projectBonus !== undefined) payroll.projectBonus = Number(projectBonus);
    if (incentives !== undefined) payroll.incentives = Number(incentives);
    if (otherDeductions !== undefined) payroll.otherDeductions = Number(otherDeductions);
    if (remarks !== undefined) payroll.remarks = remarks;

    // Recalculate Gross and Net
    const totalEarnings = payroll.basicSalary + payroll.hra + payroll.medicalAllowance + 
      payroll.travelAllowance + payroll.specialAllowance + payroll.overtimePay +
      payroll.performanceBonus + payroll.projectBonus + payroll.incentives;

    const totalDeductions = payroll.tax + payroll.providentFund + payroll.insurance + 
      payroll.latePenalty + payroll.leaveDeduction + payroll.otherDeductions;

    payroll.grossSalary = totalEarnings;
    payroll.totalDeductions = totalDeductions;
    payroll.netSalary = Math.max(totalEarnings - totalDeductions, 0);

    await payroll.save();

    return NextResponse.json({ success: true, payroll });
  } catch (error: any) {
    console.error("PUT Payroll Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded || decoded.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const payroll = await Payroll.findById(id);
    if (!payroll) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (payroll.paymentStatus !== 'Pending') {
      return NextResponse.json({ error: 'Cannot delete processed payroll' }, { status: 400 });
    }

    await Payroll.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    console.error("DELETE Payroll Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
