'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-card border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="text-white font-bold text-xl leading-none font-mono">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Pibotix</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transforming manufacturing with intelligent robotics, automation, and industrial IoT solutions. Partner with us for next-generation operational efficiency.
            </p>
            <div className="flex items-center gap-4">
              {/* Social Icons (Placeholders) */}
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">
                in
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">
                X
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 font-mono">Core Services</h4>
            <ul className="space-y-3">
              <li><Link href="/services/industrial-robotics" className="text-gray-400 hover:text-primary transition-colors text-sm">Industrial Robotics</Link></li>
              <li><Link href="/services/plc-programming" className="text-gray-400 hover:text-primary transition-colors text-sm">PLC Programming</Link></li>
              <li><Link href="/services/machine-vision" className="text-gray-400 hover:text-primary transition-colors text-sm">Machine Vision</Link></li>
              <li><Link href="/services/scada-development" className="text-gray-400 hover:text-primary transition-colors text-sm">SCADA Systems</Link></li>
              <li><Link href="/services/predictive-maintenance" className="text-gray-400 hover:text-primary transition-colors text-sm">Predictive Maintenance</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6 font-mono">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/case-studies" className="text-gray-400 hover:text-primary transition-colors text-sm">Case Studies</Link></li>
              <li><Link href="/technologies" className="text-gray-400 hover:text-primary transition-colors text-sm">Technologies</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 font-mono">Contact</h4>
            <address className="not-italic text-sm text-gray-400 space-y-4">
              <p>
                <strong className="text-white block mb-1">Headquarters</strong>
                100 Automation Parkway<br />
                Detroit, MI 48201
              </p>
              <p>
                <strong className="text-white block mb-1">Contact</strong>
                hello@pibotix.com<br />
                +1 (800) 555-0199
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Pibotix Industrial Solutions. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
