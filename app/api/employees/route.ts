import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Employee } from '@/lib/models/Employee';
import { EmployeeZodSchema } from '@/types/employee';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_fallback_key_for_development_only'
);

async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload; // contains { id, role, email }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // 1. Authenticate & Authorize
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';

    // 2. Build Query
    let query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department && department !== 'all') query.department = department;
    if (status && status !== 'all') query.status = status;

    // Role-based restrictions (Manager only sees their team, Employee only sees themselves)
    if (user.role === 'employee') {
      // Assuming user.id maps to Employee.userId or similar logic. For now, block list endpoint for employees
      return NextResponse.json({ error: 'Employees cannot view the full directory.' }, { status: 403 });
    }
    // Managers logic can be added here if there's a manager link in DB.

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, employees }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // 1. Authenticate & Authorize
    const user = await verifyAuth(req);
    if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized to create employees' }, { status: 403 });
    }

    // 2. Validate Body
    const body = await req.json();
    const validationResult = EmployeeZodSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: (validationResult.error as any).errors 
      }, { status: 400 });
    }

    // 3. Create
    const newEmployee = await Employee.create({
      ...validationResult.data,
      createdBy: user.userId
    });

    return NextResponse.json({ success: true, employee: newEmployee }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating employee:', error);
    // Handle mongoose unique errors
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Email or Employee ID already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
