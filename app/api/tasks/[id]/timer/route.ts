import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";
import { TaskTimeLog } from "@/lib/models/TaskTimeLog";
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

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (decoded.role !== 'employee') {
      return NextResponse.json({ error: 'Only assigned employees can use timers.' }, { status: 403 });
    }

    const { action } = await req.json(); // 'start' or 'stop'

    const task = await Task.findById(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    // Verify employee is actually assigned to this task
    if (task.assignedEmployee.toString() !== (decoded.employeeId as string)) {
      return NextResponse.json({ error: 'You are not assigned to this task.' }, { status: 403 });
    }

    if (action === 'start') {
      // Check if there's already a running timer for this user
      const existingTimer = await TaskTimeLog.findOne({ 
        employeeId: new mongoose.Types.ObjectId(decoded.employeeId as string), 
        status: 'Running' 
      });

      if (existingTimer) {
        return NextResponse.json({ error: 'You already have a timer running on another task. Stop it first.' }, { status: 400 });
      }

      const newLog = await TaskTimeLog.create({
        taskId: task._id,
        employeeId: new mongoose.Types.ObjectId(decoded.employeeId as string),
        startTime: new Date(),
        status: 'Running'
      });

      await TaskActivity.create({
        taskId: task._id,
        actorId: new mongoose.Types.ObjectId(decoded.userId as string),
        action: 'Timer Started',
        details: `Employee started working on task.`
      });

      return NextResponse.json({ success: true, log: newLog });

    } else if (action === 'stop') {
      const runningTimer = await TaskTimeLog.findOne({
        taskId: task._id,
        employeeId: new mongoose.Types.ObjectId(decoded.employeeId as string),
        status: 'Running'
      });

      if (!runningTimer) {
        return NextResponse.json({ error: 'No running timer found for this task.' }, { status: 400 });
      }

      const endTime = new Date();
      const durationMs = endTime.getTime() - runningTimer.startTime.getTime();
      const durationSeconds = Math.floor(durationMs / 1000);
      const hoursWorked = durationSeconds / 3600;

      runningTimer.endTime = endTime;
      runningTimer.durationSeconds = durationSeconds;
      runningTimer.status = 'Stopped';
      await runningTimer.save();

      // Update Task Actual Hours
      task.actualHours = (task.actualHours || 0) + hoursWorked;
      await task.save();

      await TaskActivity.create({
        taskId: task._id,
        actorId: new mongoose.Types.ObjectId(decoded.userId as string),
        action: 'Timer Stopped',
        details: `Logged ${hoursWorked.toFixed(2)} hours.`
      });

      return NextResponse.json({ success: true, hoursLogged: hoursWorked });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error("Timer Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
