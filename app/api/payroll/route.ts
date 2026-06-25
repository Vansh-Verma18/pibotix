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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const query: any = {};
    
    // If the user is an employee, they can ONLY see their own payroll
    if (decoded.role === 'employee') {
      // Find the employee mapping for this user
      const Employee = mongoose.models.Employee;
      const emp = await Employee.findOne({ userId: decoded.userId });
      if (!emp) return NextResponse.json({ error: 'Employee profile not linked' }, { status: 403 });
      
      query.employeeId = emp._id;
    } else if (employeeId) {
      query.employeeId = new mongoose.Types.ObjectId(employeeId);
    }

    if (month) query.salaryMonth = parseInt(month, 10);
    if (year) query.salaryYear = parseInt(year, 10);

    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'employeeId firstName lastName department designation profilePhoto')
      .sort({ salaryYear: -1, salaryMonth: -1, createdAt: -1 });

    return NextResponse.json({ success: true, payrolls });
  } catch (error: any) {
    console.error("GET Payroll Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
