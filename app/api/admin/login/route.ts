import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/AdminUser';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    let user = await AdminUser.findOne({ email });

    if (!user) {
      // Auto-create first admin for initial setup
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await AdminUser.create({
        email,
        passwordHash: hashedPassword,
        name: email.split('@')[0],
        role: 'admin'
      });
    } else {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    }

    await createSession({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Login error:', error);
    const message = error?.message?.includes('ECONNREFUSED') || error?.message?.includes('querySrv')
      ? 'Cannot connect to database. Check your MongoDB connection string.'
      : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
