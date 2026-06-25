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
    return payload; // { userId, role, email, employeeId }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const assignedEmployee = url.searchParams.get('assignedEmployee');
    const department = url.searchParams.get('department');
    const manufacturer = url.searchParams.get('manufacturer');
    
    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (assignedEmployee) query.assignedEmployee = assignedEmployee;
    if (department && department !== 'all') query.department = department;
    if (manufacturer && manufacturer !== 'all') query.manufacturer = manufacturer;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { assetId: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { qrCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Employees can only see their assigned assets unless specified otherwise.
    if (decoded.role === 'employee') {
      query.assignedEmployee = new mongoose.Types.ObjectId(decoded.employeeId as string);
    }

    const assets = await Asset.find(query)
      .populate('assignedEmployee', 'firstName lastName')
      .populate('assignedProject', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, assets });
  } catch (error) {
    console.error("GET Assets Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const decoded = await verifyAuth(req);
    if (!decoded || decoded.role === 'employee') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAsset = new Asset(body);
    await newAsset.save();

    await AssetActivity.create({
      assetId: newAsset._id,
      actorId: new mongoose.Types.ObjectId(decoded.userId as string),
      action: 'Purchased',
      details: 'Asset added to inventory',
      cost: body.purchaseCost
    });

    return NextResponse.json({ success: true, asset: newAsset }, { status: 201 });
  } catch (error: any) {
    console.error("POST Asset Error:", error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
