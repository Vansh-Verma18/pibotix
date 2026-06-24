import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { LeaveRequest } from '@/lib/models/LeaveRequest';
import { jwtVerify } from 'jose';
import mongoose from 'mongoose';

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

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await verifyAuth(req);
    
    // Only Admin or Manager can reject
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { requestId } = await req.json();

    const leaveRequest = await LeaveRequest.findById(requestId);
    if (!leaveRequest) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    if (leaveRequest.status !== 'Pending') {
      return NextResponse.json({ error: `Cannot reject request that is already ${leaveRequest.status}` }, { status: 400 });
    }

    leaveRequest.status = 'Rejected';
    leaveRequest.approvedBy = new mongoose.Types.ObjectId(user.userId as string);
    leaveRequest.approvedDate = new Date();
    await leaveRequest.save();

    return NextResponse.json({ success: true, message: 'Leave rejected successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error rejecting leave:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
