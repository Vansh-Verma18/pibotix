import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Consultation } from '@/lib/models/Consultation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const updated = await Consultation.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, consultation: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json({ error: 'Failed to update consultation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Consultation.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    return NextResponse.json({ error: 'Failed to delete consultation' }, { status: 500 });
  }
}
