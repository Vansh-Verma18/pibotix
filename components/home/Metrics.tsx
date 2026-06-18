'use client';

import { motion } from 'framer-motion';

const METRICS = [
  { value: '45%', label: 'Average OEE Increase' },
  { value: '99.9%', label: 'Quality Acceptance Rate' },
  { value: '12mo', label: 'Average ROI Duration' },
  { value: '24/7', label: 'Continuous Operation' },
];

export default function Metrics() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono tracking-tighter">
                {metric.value}
              </div>
              <div className="text-blue-100 font-medium text-sm md:text-base uppercase tracking-wider">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
