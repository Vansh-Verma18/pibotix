import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { WorkLog } from "@/lib/models/WorkLog";
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
    return payload; // { userId, role, email, employeeId }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');
    const employeeId = url.searchParams.get('employeeId');
    
    const query: any = {};
    if (projectId) query.projectId = projectId;
    if (status && status !== 'all') query.status = status;
    if (date) {
      const d = new Date(date);
      query.date = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999))
      };
    }
    
    // Authorization:
    // Employees can only see their own logs
    // Managers/Admins can see everything or filter by employeeId
    if (decoded.role === 'employee') {
      query.employeeId = new mongoose.Types.ObjectId(decoded.employeeId as string);
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    const worklogs = await WorkLog.find(query)
      .populate('projectId', 'name')
      .populate('taskId', 'name taskId')
      .populate('employeeId', 'firstName lastName department')
      .sort({ date: -1, createdAt: -1 });

    return NextResponse.json({ success: true, worklogs });
  } catch (error) {
    console.error("GET WorkLogs Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Required fields base check
    if (!body.date || !body.startTime || !body.endTime || !body.totalHoursWorked || !body.workSummary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine employee
    const targetEmployeeId = decoded.role === 'employee' && decoded.employeeId 
      ? decoded.employeeId 
      : body.employeeId || decoded.userId;

    const newLog = new WorkLog({
      ...body,
      employeeId: new mongoose.Types.ObjectId(targetEmployeeId as string),
      employeeName: body.employeeName || "Employee",
      status: "Draft",
    });

    await newLog.save();

    return NextResponse.json({ success: true, worklog: newLog }, { status: 201 });
  } catch (error: any) {
    console.error("POST WorkLogs Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
