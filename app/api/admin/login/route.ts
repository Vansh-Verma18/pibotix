import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Role } from '@/lib/models/Role';
import { AuditLog } from '@/lib/models/AuditLog';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    let user = await User.findOne({ email }).populate('role');

    if (!user) {
      // Security feature: Avoid leaking whether user exists or not by returning generic error
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      return NextResponse.json({ error: 'Account is temporarily locked. Try again later.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      // Track failed attempts
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
        
        await AuditLog.create({
          action: 'ACCOUNT_LOCKED',
          targetUser: user._id,
          details: { reason: 'Too many failed login attempts' }
        });
      }
      await user.save();
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Check Approval Status
    if (user.status === 'pending') {
      return NextResponse.json({ error: 'Account is pending administrator approval.' }, { status: 403 });
    }
    if (user.status === 'rejected') {
      return NextResponse.json({ error: 'Account access has been rejected.' }, { status: 403 });
    }
    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Account is suspended.' }, { status: 403 });
    }

    await AuditLog.create({
      action: 'USER_LOGIN_SUCCESS',
      performedBy: user._id,
    });

    await createSession({
      userId: user._id.toString(),
      role: (user.role as any).name, // The populated role name ('superadmin', 'admin', 'user')
      name: user.name,
      email: user.email
    });

    return NextResponse.json({ success: true, role: (user.role as any).name });
  } catch (error: any) {
    console.error('Login error:', error);
    const message = error?.message?.includes('ECONNREFUSED') || error?.message?.includes('querySrv')
      ? 'Cannot connect to database. Check your MongoDB connection string.'
      : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
