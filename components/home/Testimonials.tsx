'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "PiBotix completely transformed our end-of-line packaging. The dual KUKA robots they installed increased our throughput by 60% and eliminated ergonomic injuries overnight.",
    author: "Rajesh Kumar",
    title: "Director of Operations",
    company: "Tier 1 Food & Beverage Manufacturer",
    rating: 5,
  },
  {
    quote: "Their expertise in Siemens TIA Portal is unmatched. The SCADA upgrade they performed gave us total visibility into our process, reducing downtime by 30%.",
    author: "Amit Sharma",
    title: "Plant Manager",
    company: "Global Automotive Supplier",
    rating: 5,
  },
  {
    quote: "We evaluated three integrators before choosing PiBotix. Their AI vision system caught defects our previous camera setup missed entirely. ROI in 8 months.",
    author: "Priya Patel",
    title: "VP of Quality",
    company: "Leading Electronics Manufacturer",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm font-semibold mb-4 uppercase tracking-wider"
          >
            Client Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-400 text-lg"
          >
            Hear from the engineering and operations leaders who have transformed their facilities with our systems.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative group hover:border-primary/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed flex-grow">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                {/* Avatar placeholder */}
                <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {t.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-gray-500 text-xs">{t.title}</div>
                  <div className="text-primary text-xs font-medium">{t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
