'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-card border border-white/10 rounded-3xl p-8 md:p-16 max-w-5xl mx-auto backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-2/3">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold text-white mb-6"
              >
                Ready to Automate Your Future?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-400 text-lg leading-relaxed"
              >
                Schedule a technical consultation with our engineering team. We&apos;ll review your current processes and identify high-ROI automation opportunities — no commitment required.
              </motion.p>
            </div>
            <div className="md:w-1/3 flex flex-col gap-3 w-full">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 shadow-xl shadow-primary/20"
              >
                Get a Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/assessment"
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-base transition-all"
              >
                <ClipboardCheck className="w-5 h-5" /> Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
