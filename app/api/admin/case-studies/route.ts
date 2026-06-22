import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { CaseStudy } from '@/lib/models/CaseStudy';

export async function GET() {
  try {
    await dbConnect();
    const caseStudies = await CaseStudy.find().sort({ createdAt: -1 });
    return NextResponse.json(caseStudies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    // Ensure results is stored as an array
    const data = {
      ...body,
      results: typeof body.results === 'string'
        ? body.results.split(',').map((s: string) => s.trim()).filter(Boolean)
        : body.results || [],
      technologiesUsed: typeof body.technologiesUsed === 'string'
        ? body.technologiesUsed.split(',').map((s: string) => s.trim()).filter(Boolean)
        : body.technologiesUsed || [],
    };
    const caseStudy = await CaseStudy.create(data);
    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create case study' }, { status: 500 });
  }
}
