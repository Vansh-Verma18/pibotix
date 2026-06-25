import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Payroll } from "@/lib/models/Payroll";
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
    // Only finance/admin can process payrolls
    if (!decoded || decoded.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { paymentMethod, transactionId } = body;

    const payroll = await Payroll.findById(id);
    if (!payroll) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (payroll.paymentStatus !== 'Pending' && payroll.paymentStatus !== 'Processing') {
      return NextResponse.json({ error: 'Payroll has already been paid or failed' }, { status: 400 });
    }

    payroll.paymentStatus = 'Paid';
    payroll.paymentMethod = paymentMethod || 'Bank Transfer';
    payroll.transactionId = transactionId || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    payroll.processedBy = new mongoose.Types.ObjectId(decoded.userId as string);
    payroll.processedAt = new Date();

    await payroll.save();

    return NextResponse.json({ success: true, payroll });
  } catch (error: any) {
    console.error("POST Process Payroll Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
