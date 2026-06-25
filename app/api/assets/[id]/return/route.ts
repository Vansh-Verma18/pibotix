import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Asset } from "@/lib/models/Asset";
import { AssetActivity } from "@/lib/models/AssetActivity";
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
    if (!decoded || decoded.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { condition, notes } = body;

    const asset = await Asset.findById(id);
    if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (asset.status !== 'Assigned') {
      return NextResponse.json({ error: `Asset is ${asset.status}, not assigned` }, { status: 400 });
    }

    const previousEmployee = asset.assignedEmployee;
    const previousProject = asset.assignedProject;

    asset.assignedEmployee = undefined;
    asset.assignedProject = undefined;
    if (condition) asset.condition = condition;
    
    // Auto status update based on condition
    if (condition === 'Poor' || condition === 'Critical') {
        asset.status = 'Damaged';
    } else {
        asset.status = 'Available';
    }

    await asset.save();

    await AssetActivity.create({
      assetId: asset._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      targetEmployeeId: previousEmployee,
      targetProjectId: previousProject,
      action: 'Returned',
      details: notes || `Asset returned in ${condition || asset.condition} condition`
    });

    return NextResponse.json({ success: true, asset });
  } catch (error: any) {
    console.error("POST Return Asset Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
