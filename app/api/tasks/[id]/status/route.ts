import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";
import { Project } from "@/lib/models/Project";
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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { status, completionPercentage } = await req.json();
    
    if (!status && completionPercentage === undefined) {
      return NextResponse.json({ error: 'Status or completion percentage required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (completionPercentage !== undefined) updateData.completionPercentage = completionPercentage;
    
    // Auto mark completion date if it just hit Completed or 100%
    if (status === 'Completed' || completionPercentage === 100) {
      updateData.status = 'Completed';
      updateData.completionPercentage = 100;
      updateData.completionDate = new Date();
    } else if (status && status !== 'Completed') {
      // If moving OUT of completed
      updateData.completionDate = null;
      if (updateData.completionPercentage === 100) {
          updateData.completionPercentage = 90; // Reset slightly
      }
    }

    const task = await Task.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    await TaskActivity.create({
      taskId: task._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Status Changed',
      details: `Updated status to ${task.status} (${task.completionPercentage}%)`
    });

    // CRITICAL: Auto-calculate Project Progress!
    // We fetch ALL tasks for this project
    const allProjectTasks = await Task.find({ projectId: task.projectId });
    if (allProjectTasks.length > 0) {
      const completedTasks = allProjectTasks.filter(t => t.status === 'Completed').length;
      // Formula: simple ratio of completed tasks to total tasks
      const newProjectProgress = Math.round((completedTasks / allProjectTasks.length) * 100);
      
      // Update the parent project
      let projectStatus = undefined;
      if (newProjectProgress === 100) projectStatus = 'Completed';
      else if (newProjectProgress > 0 && newProjectProgress < 100) projectStatus = 'In Progress';
      
      const pUpdateData: any = { progressPercentage: newProjectProgress };
      if (projectStatus) pUpdateData.status = projectStatus;

      await Project.findByIdAndUpdate(task.projectId, pUpdateData);
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
