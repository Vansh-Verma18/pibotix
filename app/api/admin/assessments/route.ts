import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Assessment } from '@/lib/models/Assessment';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const assessments = await Assessment.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ assessments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}
