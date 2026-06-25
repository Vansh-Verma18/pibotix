import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Project } from '@/lib/models/Project';
import { ProjectActivity } from '@/lib/models/ProjectActivity';
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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'manager')) {
      return NextResponse.json({ error: 'Unauthorized to update status' }, { status: 403 });
    }

    const { status } = await req.json();

    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const oldStatus = project.status;
    project.status = status;
    
    if (status === 'Completed') {
      project.actualCompletion = new Date();
      project.progressPercentage = 100;
    }
    
    await project.save();

    await ProjectActivity.create({
      projectId: project._id,
      actorId: new mongoose.Types.ObjectId(user.userId as string),
      action: 'Status Changed',
      details: `Project status changed from ${oldStatus} to ${status}.`
    });

    return NextResponse.json({ success: true, project }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
