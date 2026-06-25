import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { ProjectActivity } from '@/lib/models/ProjectActivity';
import { Employee } from '@/lib/models/Employee';
import { ProjectZodSchema } from '@/types/project';
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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    let query: any = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;

    // Filter logic based on Role
    if (user.role === 'employee') {
      const employee = await Employee.findOne({ userId: user.userId as string });
      if (employee) {
        // Find projects where the employee is the manager OR in the assigned team
        query.$or = [
          { managerId: employee._id },
          { 'assignedEmployees.employeeId': employee._id }
        ];
      } else {
        return NextResponse.json({ success: true, projects: [] }, { status: 200 });
      }
    }

    const projects = await Project.find(query)
      .populate('managerId', 'firstName lastName email profilePhoto')
      .populate('assignedEmployees.employeeId', 'firstName lastName email profilePhoto designation')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, projects }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized to create projects' }, { status: 403 });
    }

    const body = await req.json();
    
    // Validate payload
    const validationResult = ProjectZodSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: (validationResult.error as any).errors 
      }, { status: 400 });
    }

    // Create Project
    const newProject = await Project.create({
      ...validationResult.data,
      createdBy: new mongoose.Types.ObjectId(user.userId as string)
    });

    // Automatically create the initial activity log
    await ProjectActivity.create({
      projectId: newProject._id,
      actorId: new mongoose.Types.ObjectId(user.userId as string),
      action: 'Created',
      details: 'Project was successfully created and entered the Planning phase.'
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
