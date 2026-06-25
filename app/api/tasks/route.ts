import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Task } from "@/lib/models/Task";
import { TaskActivity } from "@/lib/models/TaskActivity";
import { Employee } from "@/lib/models/Employee";
import { TaskZodSchema } from "@/types/task";
import { jwtVerify } from 'jose';
import mongoose from "mongoose";
import { z } from "zod";

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
    
    // Auth Check
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Fetch Tasks
    // If Employee, only return tasks assigned to them
    // If Admin/HR/ProjectManager, return all or filter by project
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    
    let query: any = {};
    if (projectId) query.projectId = projectId;
    
    if (decoded.role === 'employee') {
      query.assignedEmployee = new mongoose.Types.ObjectId(decoded.employeeId as string);
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'name clientId')
      .populate('assignedEmployee', 'firstName lastName department')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (decoded.role === 'employee') {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validationResult = TaskZodSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    const validatedData = validationResult.data;

    const newTask = new Task({
      ...validatedData,
      assignedBy: new mongoose.Types.ObjectId(decoded.userId as string),
      status: 'Backlog',
      completionPercentage: 0
    });

    await newTask.save();

    await TaskActivity.create({
      taskId: newTask._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Created',
      details: `Task created and assigned.`
    });

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    console.error("POST Tasks Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
