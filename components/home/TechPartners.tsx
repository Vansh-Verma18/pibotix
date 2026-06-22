'use client';

import { motion } from 'framer-motion';

const PARTNERS = [
  { name: 'Siemens', category: 'PLC & SCADA' },
  { name: 'ABB', category: 'Robotics' },
  { name: 'FANUC', category: 'Robotics' },
  { name: 'KUKA', category: 'Robotics' },
  { name: 'Rockwell', category: 'Automation' },
  { name: 'Allen-Bradley', category: 'PLC' },
  { name: 'Mitsubishi', category: 'Automation' },
  { name: 'Beckhoff', category: 'Motion' },
];

export default function TechPartners() {
  return (
    <section className="py-16 bg-background border-t border-b border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold">
            Certified Technology Partners & Platforms
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative cursor-default"
            >
              <span className="text-xl md:text-2xl font-bold text-gray-700 hover:text-gray-400 transition-colors tracking-wide">
                {partner.name}
              </span>
              {/* Tooltip */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {partner.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
