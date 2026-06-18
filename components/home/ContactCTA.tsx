'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-card border border-white/10 rounded-3xl p-8 md:p-16 max-w-5xl mx-auto backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-2/3">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Automate Your Future?</h2>
            <p className="text-gray-400 text-lg mb-0 leading-relaxed">
              Schedule a technical consultation with our engineering team. We'll review your current processes and identify high-ROI automation opportunities.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-end w-full">
            <Link
              href="/contact"
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-5 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-primary/20"
            >
              Contact Engineering <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
