import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Role } from '@/lib/models/Role';
import { AuditLog } from '@/lib/models/AuditLog';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Find the default "user" role
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) {
      return NextResponse.json({ error: 'System not properly initialized. Default role missing.' }, { status: 500 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: defaultRole._id,
      status: 'pending', // Hardcode pending status
    });

    // Create Audit Log
    await AuditLog.create({
      action: 'USER_REGISTERED',
      targetUser: newUser._id,
      details: { email: newUser.email, assignedRole: 'user' }
    });

    return NextResponse.json({ success: true, message: 'Registration successful. Account pending approval.' });
  } catch (error: any) {
    console.error('Register error:', error);
    const message = error?.message?.includes('ECONNREFUSED') || error?.message?.includes('querySrv')
      ? 'Cannot connect to database. Check your MongoDB connection string.'
      : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
