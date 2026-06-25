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

    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });

    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const newComment = {
      userId: new mongoose.Types.ObjectId(decoded.userId as string),
      text,
      createdAt: new Date()
    };

    task.comments.push(newComment as any);
    await task.save();

    await TaskActivity.create({
      taskId: task._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Comment Added',
      details: `Added a comment: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Task Comment Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
