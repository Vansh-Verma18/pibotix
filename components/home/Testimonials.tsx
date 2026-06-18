'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: "AutoForge completely transformed our end-of-line packaging. The dual KUKA robots they installed increased our throughput by 60% and eliminated ergonomic injuries overnight.",
    author: "Director of Operations",
    company: "Tier 1 Food & Beverage Manufacturer"
  },
  {
    quote: "Their expertise in Siemens TIA Portal is unmatched. The SCADA upgrade they performed gave us total visibility into our process, reducing downtime by 30%.",
    author: "Plant Manager",
    company: "Global Automotive Supplier"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Client Success</h2>
          <p className="text-gray-400 text-lg">
            Hear from the engineering and operations leaders who have transformed their facilities with our systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-white/10 rounded-3xl p-10 flex flex-col justify-between relative group hover:border-primary/50 transition-colors"
            >
              <div className="text-6xl text-primary/20 absolute top-6 right-8 font-serif">"</div>
              <p className="text-xl text-gray-300 italic mb-8 relative z-10 leading-relaxed">
                "{t.quote}"
              </p>
              <div>
                <div className="font-bold text-white">{t.author}</div>
                <div className="text-primary text-sm font-medium">{t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
