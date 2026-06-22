import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Service } from '@/lib/models/Service';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const data = {
      ...body,
      benefits: typeof body.benefits === 'string'
        ? body.benefits.split(',').map((s: string) => s.trim()).filter(Boolean)
        : body.benefits || [],
      features: typeof body.features === 'string'
        ? body.features.split(',').map((s: string) => s.trim()).filter(Boolean)
        : body.features || [],
      technologiesUsed: typeof body.technologiesUsed === 'string'
        ? body.technologiesUsed.split(',').map((s: string) => s.trim()).filter(Boolean)
        : body.technologiesUsed || [],
      industriesServed: typeof body.industriesServed === 'string'
        ? body.industriesServed.split(',').map((s: string) => s.trim()).filter(Boolean)
        : body.industriesServed || [],
    };
    const service = await Service.create(data);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
