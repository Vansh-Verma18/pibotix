import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TeamMember } from '@/lib/models/TeamMember';

export async function GET() {
  try {
    await dbConnect();
    const team = await TeamMember.find().sort({ createdAt: -1 });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    const member = await TeamMember.create(data);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
