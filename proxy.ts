import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_fallback_key_for_development_only'
);

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !path.startsWith('/admin/register') && !path.startsWith('/api/admin/login') && !path.startsWith('/api/admin/register')) {
    const token = request.cookies.get('admin_session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const role = payload.role as string;

      // Define routes restricted to superadmin and admin
      const restrictedAdminRoutes = [
        '/admin/users',
        '/admin/settings',
        '/admin/team',
        '/admin/blog',
        '/admin/case-studies',
        '/admin/testimonials',
        '/admin/assessments',
        '/admin/consultations',
        '/admin/contacts',
        '/admin/leads',
        '/admin/services'
      ];

      // If a standard user, employee, or manager tries to access a restricted admin route, redirect them
      if (['user', 'employee', 'manager'].includes(role)) {
        const isRestricted = restrictedAdminRoutes.some(r => path.startsWith(r));
        if (isRestricted) {
          // You can create specific dashboards for managers/employees later.
          // For now, redirect to /admin (which can conditionally render content based on role)
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
