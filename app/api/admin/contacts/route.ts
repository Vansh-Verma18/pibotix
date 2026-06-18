import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ContactRequest } from '@/lib/models/ContactRequest';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const contacts = await ContactRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

