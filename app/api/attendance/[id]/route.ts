import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Attendance } from '@/lib/models/Attendance';
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const user = await verifyAuth(req);

    if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    
    // Auto-recalculate if updating times manually
    if (body.checkInTime && body.checkOutTime) {
      const start = new Date(body.checkInTime);
      const end = new Date(body.checkOutTime);
      const durationHours = Number(((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2));
      
      body.workingHours = durationHours;
      if (durationHours >= 9) {
        body.status = 'Present';
        body.overtimeHours = Number((durationHours - 9).toFixed(2));
      } else if (durationHours >= 4) {
        body.status = 'Half Day';
        body.overtimeHours = 0;
      } else {
        body.status = 'Absent';
        body.overtimeHours = 0;
      }
    }

    const updated = await Attendance.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, attendance: updated }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const user = await verifyAuth(req);

    if (!user || user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized. Only Super Admin can delete.' }, { status: 403 });
    }

    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
