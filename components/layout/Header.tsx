'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const SERVICES = [
  { name: 'Industrial Robotics', href: '/services/industrial-robotics' },
  { name: 'PLC Programming', href: '/services/plc-programming' },
  { name: 'Machine Vision Systems', href: '/services/machine-vision' },
  { name: 'Predictive Maintenance', href: '/services/predictive-maintenance' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="PiBotix Logo" className="h-16 w-auto object-contain" style={{mixBlendMode:'screen'}} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About Us
          </Link>
          
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {servicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-64 bg-card border border-white/10 rounded-lg shadow-xl overflow-hidden py-2"
                >
                  <Link href="/services" className="block px-4 py-2 text-sm font-bold text-white bg-white/5 mb-2 hover:bg-white/10">
                    View All Services
                  </Link>
                  {SERVICES.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/industries" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Industries
          </Link>
          <Link href="/case-studies" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Case Studies
          </Link>
          <Link href="/technologies" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Technologies
          </Link>
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-transparent px-6 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Login
          </Link>
          <Link
            href="/contact"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Get a Quote
          </Link>
          
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link href="/about" className="text-lg font-medium text-gray-300">About Us</Link>
              <Link href="/services" className="text-lg font-medium text-gray-300">Services</Link>
              <Link href="/industries" className="text-lg font-medium text-gray-300">Industries</Link>
              <Link href="/case-studies" className="text-lg font-medium text-gray-300">Case Studies</Link>
              <Link href="/technologies" className="text-lg font-medium text-gray-300">Technologies</Link>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/admin/login"
                  className="inline-flex h-12 w-full items-center justify-center rounded-md border border-white/20 bg-transparent px-6 text-base font-medium text-white"
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-white"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
