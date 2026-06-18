import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Consultation } from '@/lib/models/Consultation';

export async function GET() {
  try {
    await connectToDatabase();
    const consultations = await Consultation.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ consultations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
