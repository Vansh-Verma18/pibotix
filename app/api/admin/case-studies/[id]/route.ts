import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CaseStudy } from '@/lib/models/CaseStudy';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(caseStudy);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const caseStudy = await CaseStudy.findByIdAndUpdate(id, data, { new: true });
    if (!caseStudy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(caseStudy);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await CaseStudy.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
