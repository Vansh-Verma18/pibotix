import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { ProjectActivity } from '@/lib/models/ProjectActivity';
import { Employee } from '@/lib/models/Employee';
import { LeaveRequest } from '@/lib/models/LeaveRequest';
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

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'manager')) {
      return NextResponse.json({ error: 'Unauthorized to assign employees' }, { status: 403 });
    }

    const { employeeId, role } = await req.json();

    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const employee = await Employee.findById(employeeId);
    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });

    // Check for Leave Conflicts
    const conflictingLeaves = await LeaveRequest.find({
      employeeId: employee._id,
      status: 'Approved',
      $or: [
        { startDate: { $lte: project.endDate }, endDate: { $gte: project.startDate } }
      ]
    });

    if (conflictingLeaves.length > 0) {
      return NextResponse.json({ 
        error: 'Employee has approved leave during this project timeline. Assignment blocked or requires manager override.',
        conflictingLeaves 
      }, { status: 400 });
    }

    // Check if already assigned
    const exists = project.assignedEmployees.find(e => e.employeeId.toString() === employeeId);
    if (exists) {
      return NextResponse.json({ error: 'Employee is already assigned to this project' }, { status: 400 });
    }

    project.assignedEmployees.push({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      role
    });

    await project.save();

    await ProjectActivity.create({
      projectId: project._id,
      actorId: new mongoose.Types.ObjectId(user.userId as string),
      action: 'Employee Assigned',
      details: `${employee.firstName} ${employee.lastName} assigned as ${role}.`
    });

    return NextResponse.json({ success: true, project }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
