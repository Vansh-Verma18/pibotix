import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Consultation } from '@/lib/models/Consultation';
import { sendBookingConfirmation } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const consultation = await Consultation.create({
      ...body,
      status: 'pending', // all new bookings start as pending
    });

    // Send email confirmation asynchronously (don't await so we don't block response)
    sendBookingConfirmation(
      consultation.email, 
      consultation.name, 
      consultation.preferredDate, 
      consultation.timeSlot
    ).catch(console.error);

    return NextResponse.json({ success: true, consultation }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating consultation:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create consultation' }, { status: 500 });
  }
}

export async function GET() {
  // Not strictly needed for public, but returning a 405 if someone hits it
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
