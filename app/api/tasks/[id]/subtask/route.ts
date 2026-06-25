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
    return payload; 
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: 'Subtask title is required' }, { status: 400 });

    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const newSubtask = {
      title,
      isCompleted: false
    };

    task.subtasks.push(newSubtask as any);
    await task.save();

    await TaskActivity.create({
      taskId: task._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Updated',
      details: `Added subtask: "${title}"`
    });

    return NextResponse.json({ success: true, subtask: newSubtask });
  } catch (error) {
    console.error("Task Subtask Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subtaskId, isCompleted } = await req.json();

    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });

    subtask.isCompleted = isCompleted;

    // Recalculate completion percentage
    const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
    task.completionPercentage = task.subtasks.length > 0 
      ? Math.round((completedSubtasks / task.subtasks.length) * 100) 
      : task.completionPercentage;

    await task.save();

    await TaskActivity.create({
      taskId: task._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Updated',
      details: `Marked subtask "${subtask.title}" as ${isCompleted ? 'completed' : 'incomplete'}`
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Task Subtask Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
