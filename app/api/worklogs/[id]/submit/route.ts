import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { WorkLog } from "@/lib/models/WorkLog";
import { Task } from "@/lib/models/Task";
import { Project } from "@/lib/models/Project";
import { TaskActivity } from "@/lib/models/TaskActivity";
import { ProjectActivity } from "@/lib/models/ProjectActivity";
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const worklog = await WorkLog.findById(id);
    if (!worklog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (worklog.status !== 'Draft' && worklog.status !== 'Request Changes') {
      return NextResponse.json({ error: 'Only Drafts can be submitted' }, { status: 400 });
    }

    if (decoded.role === 'employee' && worklog.employeeId.toString() !== decoded.employeeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    worklog.status = 'Submitted';
    await worklog.save();

    // Perform integrations with Task and Project
    if (worklog.taskId) {
      const task = await Task.findById(worklog.taskId);
      if (task) {
        task.actualHours = (task.actualHours || 0) + worklog.totalHoursWorked;
        // Optionally update task completion if worklog provided it
        if (worklog.currentProgress > task.completionPercentage) {
            task.completionPercentage = worklog.currentProgress;
            if (task.completionPercentage === 100) task.status = 'Completed';
            else if (task.status === 'Backlog' || task.status === 'To Do') task.status = 'In Progress';
        }
        await task.save();

        await TaskActivity.create({
          taskId: task._id,
          actorId: new mongoose.Types.ObjectId(decoded.userId as string),
          action: 'Other',
          details: `Work log submitted: ${worklog.totalHoursWorked} hours logged.`
        });
      }
    }

    if (worklog.projectId) {
      const project = await Project.findById(worklog.projectId);
      if (project) {
        await ProjectActivity.create({
          projectId: project._id,
          actorId: new mongoose.Types.ObjectId(decoded.userId as string),
          action: 'Other',
          details: `Work log submitted by ${worklog.employeeName} for ${worklog.totalHoursWorked} hours.`
        });
        
        // Let's recalculate project overall progress here based on tasks if needed, 
        // or just log the hours. (Omitted recalculation for brevity, as it's typically complex)
      }
    }

    return NextResponse.json({ success: true, worklog });
  } catch (error: any) {
    console.error("POST Submit WorkLog Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
