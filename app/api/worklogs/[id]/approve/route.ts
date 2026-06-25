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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded || decoded.role === 'employee') {
      return NextResponse.json({ error: 'Forbidden. Managers only.' }, { status: 403 });
    }

    const body = await req.json();
    const { status, managerNotes } = body;

    if (!['Approved', 'Reviewed', 'Request Changes'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const worklog = await WorkLog.findById(id);
    if (!worklog) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    worklog.status = status;
    if (managerNotes) worklog.managerNotes = managerNotes;
    
    await worklog.save();

    return NextResponse.json({ success: true, worklog });
  } catch (error: any) {
    console.error("POST Approve WorkLog Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
