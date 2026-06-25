import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { WorkLog } from "@/lib/models/WorkLog";
import { jwtVerify } from 'jose';

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const worklog = await WorkLog.findById(id)
      .populate('projectId', 'name')
      .populate('taskId', 'name taskId')
      .populate('employeeId', 'firstName lastName department');

    if (!worklog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Ensure employee can only view their own
    if (decoded.role === 'employee' && worklog.employeeId._id.toString() !== decoded.employeeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, worklog });
  } catch (error) {
    console.error("GET WorkLog Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const worklog = await WorkLog.findById(id);

    if (!worklog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Only allow editing if Draft or Request Changes
    if (worklog.status !== 'Draft' && worklog.status !== 'Request Changes') {
      return NextResponse.json({ error: 'Cannot edit a submitted or approved log' }, { status: 400 });
    }

    if (decoded.role === 'employee' && worklog.employeeId.toString() !== decoded.employeeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent overriding status via simple PUT
    delete body.status;

    Object.assign(worklog, body);
    await worklog.save();

    return NextResponse.json({ success: true, worklog });
  } catch (error: any) {
    console.error("PUT WorkLog Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const worklog = await WorkLog.findById(id);
    if (!worklog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (worklog.status !== 'Draft') {
      return NextResponse.json({ error: 'Only Draft logs can be deleted' }, { status: 400 });
    }

    if (decoded.role === 'employee' && worklog.employeeId.toString() !== decoded.employeeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await worklog.deleteOne();

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error("DELETE WorkLog Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
