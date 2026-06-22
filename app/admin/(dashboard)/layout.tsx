"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Database, Settings, 
  MessageSquare, CalendarCheck, Briefcase, 
  Star, PenTool, LogOut, Globe, UserCheck, ClipboardCheck
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Analytics Dashboard', exact: true },
  { href: '/admin/assessments', icon: ClipboardCheck, label: 'Assessments', exact: false },
  { href: '/admin/leads', icon: Users, label: 'Lead Management', exact: false },
  { href: '/admin/contacts', icon: MessageSquare, label: 'Contact Requests', exact: false },
  { href: '/admin/consultations', icon: CalendarCheck, label: 'Consultations', exact: false },
  { href: '/admin/case-studies', icon: Briefcase, label: 'Case Studies', exact: false },
  { href: '/admin/services', icon: Database, label: 'Services', exact: false },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonials', exact: false },
  { href: '/admin/team', icon: UserCheck, label: 'Team Management', exact: false },
  { href: '/admin/blog', icon: PenTool, label: 'Blog Management', exact: false },
  { href: '/admin/settings', icon: Settings, label: 'Settings', exact: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (item: typeof MENU_ITEMS[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-[#0d0d0d] p-6 flex flex-col shrink-0 md:h-screen md:sticky top-0 overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 md:mb-10">
          <img src="/logo.png" alt="PiBotix Logo" className="h-8 w-auto object-contain" />
          <div>
            <span className="font-bold text-base tracking-tight text-white">Pibotix CMS</span>
            <p className="text-xs text-gray-500 -mt-0.5">Admin Panel</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-3 px-1">Navigation</p>

        <nav className="space-y-0.5 flex-1">
          {MENU_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  active 
                    ? 'bg-primary/15 text-primary font-semibold border border-primary/20 shadow-sm shadow-primary/10' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : 'text-gray-500'}`} />
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-white/10 space-y-0.5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors text-sm border border-transparent">
            <Globe className="w-4 h-4 text-gray-500" /> Live Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left text-sm border border-transparent"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
