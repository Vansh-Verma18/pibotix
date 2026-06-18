"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Database, Settings, 
  MessageSquare, CalendarCheck, FileText, 
  Briefcase, Star, PenTool, LogOut
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Analytics Dashboard' },
  { href: '/admin/leads', icon: Users, label: 'Lead Management' },
  { href: '/admin/contacts', icon: MessageSquare, label: 'Contact Requests' },
  { href: '/admin/consultations', icon: CalendarCheck, label: 'Consultations' },
  { href: '/admin/case-studies', icon: Briefcase, label: 'Case Studies' },
  { href: '/admin/services', icon: Database, label: 'Services' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { href: '/admin/team', icon: Users, label: 'Team Management' },
  { href: '/admin/blog', icon: PenTool, label: 'Blog Management' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-card p-6 flex flex-col shrink-0 md:h-screen md:sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 mb-8 md:mb-12">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold font-mono">A</span>
          </div>
          <span className="font-bold text-xl tracking-tight">AutoForge CMS</span>
        </div>

        <nav className="space-y-1 flex-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/20 text-primary font-semibold border border-primary/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Live Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
