import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { ProjectActivity } from '@/lib/models/ProjectActivity';
import { Employee } from '@/lib/models/Employee';
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

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const project = await Project.findById(params.id)
      .populate('managerId', 'firstName lastName email profilePhoto employeeId department')
      .populate('assignedEmployees.employeeId', 'firstName lastName email profilePhoto employeeId designation');

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Fetch Activity Logs separately
    const activities = await ProjectActivity.find({ projectId: project._id })
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, project, activities }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'manager')) {
      return NextResponse.json({ error: 'Unauthorized to update projects' }, { status: 403 });
    }

    const body = await req.json();
    
    const updatedProject = await Project.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });

    if (!updatedProject) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Optional: Log generic update
    await ProjectActivity.create({
      projectId: updatedProject._id,
      actorId: new mongoose.Types.ObjectId(user.userId as string),
      action: 'Other',
      details: 'Project details were updated manually.'
    });

    return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    if (!user || user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only Super Admin can delete projects' }, { status: 403 });
    }

    await ProjectActivity.deleteMany({ projectId: params.id });
    await Project.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
