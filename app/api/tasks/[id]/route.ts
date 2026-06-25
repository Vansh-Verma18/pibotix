import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";
import { TaskActivity } from "@/lib/models/TaskActivity";
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
    return payload; // { userId, role, email }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    // Auth Check
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const task = await Task.findById(params.id)
      .populate('projectId', 'name clientId')
      .populate('assignedEmployee', 'firstName lastName department')
      .populate('assignedBy', 'name');

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Only Admin or Project Manager can fully edit tasks (unless Employee is updating progress)
    // We'll restrict employee edits directly in the UI, but here we allow basic updates
    const task = await Task.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    await TaskActivity.create({
      taskId: task._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Other',
      details: `Task details updated.`
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (decoded.role === 'employee') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const task = await Task.findByIdAndDelete(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    await TaskActivity.deleteMany({ taskId: params.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
