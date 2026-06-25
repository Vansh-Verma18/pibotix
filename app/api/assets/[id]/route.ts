import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Asset } from "@/lib/models/Asset";
import { AssetActivity } from "@/lib/models/AssetActivity";
import mongoose from "mongoose";
import { MaintenanceRecord } from "@/lib/models/MaintenanceRecord";
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

    const asset = await Asset.findById(id)
      .populate('assignedEmployee', 'firstName lastName email department')
      .populate('assignedProject', 'name clientId');

    if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Employees can only view their own
    if (decoded.role === 'employee' && asset.assignedEmployee?._id.toString() !== decoded.employeeId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const activities = await AssetActivity.find({ assetId: id })
      .populate('actorId', 'name')
      .populate('targetEmployeeId', 'firstName lastName')
      .populate('targetProjectId', 'name')
      .sort({ createdAt: -1 });

    const maintenance = await MaintenanceRecord.find({ assetId: id }).sort({ serviceDate: -1 });

    return NextResponse.json({ success: true, asset, activities, maintenance });
  } catch (error) {
    console.error("GET Asset Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded || decoded.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const asset = await Asset.findById(id);

    if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Status logic is handled via specific assignment/return routes, so don't allow blanket override here usually, but we allow it for edits
    Object.assign(asset, body);
    await asset.save();

    return NextResponse.json({ success: true, asset });
  } catch (error: any) {
    console.error("PUT Asset Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const decoded = await verifyAuth(req);
    if (!decoded || decoded.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const asset = await Asset.findById(id);
    if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Soft delete/retire instead of hard delete
    asset.status = 'Retired';
    await asset.save();
    
    await AssetActivity.create({
      assetId: asset._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Retired',
      details: 'Asset retired via DELETE route'
    });

    return NextResponse.json({ success: true, message: 'Retired successfully' });
  } catch (error) {
    console.error("DELETE Asset Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
