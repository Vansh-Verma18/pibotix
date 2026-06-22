import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/AdminUser';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await AdminUser.create({
      name,
      email,
      passwordHash,
      role: role || 'editor',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Register error:', error);
    const message = error?.message?.includes('ECONNREFUSED') || error?.message?.includes('querySrv')
      ? 'Cannot connect to database. Check your MongoDB connection string.'
      : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
