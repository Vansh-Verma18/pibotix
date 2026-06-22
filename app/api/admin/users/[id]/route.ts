import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Role } from '@/lib/models/Role';
import { AuditLog } from '@/lib/models/AuditLog';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const { status, role } = await request.json();

    await connectToDatabase();
    
    const userToUpdate = await User.findById(id).populate('role');
    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only superadmin can change roles
    if (role && role !== (userToUpdate.role as any).name) {
      if (session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Only Super Admin can change roles' }, { status: 403 });
      }
      
      const newRole = await Role.findOne({ name: role });
      if (!newRole) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      
      userToUpdate.role = newRole._id;
      
      await AuditLog.create({
        action: 'USER_ROLE_CHANGED',
        performedBy: session.userId as any,
        targetUser: userToUpdate._id,
        details: { oldRole: (userToUpdate.role as any).name, newRole: role }
      });
    }

    // Admin and superadmin can change status
    if (status && status !== userToUpdate.status) {
      const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      
      userToUpdate.status = status;
      
      await AuditLog.create({
        action: `USER_STATUS_CHANGED`,
        performedBy: session.userId as any,
        targetUser: userToUpdate._id,
        details: { newStatus: status }
      });
    }

    await userToUpdate.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
