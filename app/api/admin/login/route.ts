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

    const user = await AdminUser.findOne({ email });

    if (!user) {
      // For development: auto-create an admin if none exists and they use "admin@example.com"
      if (email === 'admin@example.com' && password === 'admin123') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await AdminUser.create({
          email,
          passwordHash: hashedPassword,
          name: 'Super Admin',
          role: 'admin'
        });
        
        await createSession({
          userId: newUser._id.toString(),
          role: newUser.role,
          name: newUser.name,
          email: newUser.email
        });
        
        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSession({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
