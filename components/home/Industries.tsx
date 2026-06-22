'use client';

import { motion } from 'framer-motion';
import { Car, Package, Microchip, Pill, Beaker, Truck } from 'lucide-react';

const INDUSTRIES = [
  { name: 'Automotive', icon: Car },
  { name: 'Electronics', icon: Microchip },
  { name: 'Pharmaceuticals', icon: Pill },
  { name: 'Food & Beverage', icon: Beaker },
  { name: 'Logistics', icon: Truck },
  { name: 'Packaging', icon: Package },
];

export default function Industries() {
  return (
    <section className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Industries We Serve</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We deliver specialized automation solutions tailored to the unique regulatory, throughput, and quality demands of modern manufacturing sectors.
            </p>
            <a href="/industries" className="inline-flex items-center text-primary font-semibold hover:text-red-400 transition-colors">
              Explore Industry Solutions →
            </a>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6">
            {INDUSTRIES.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all"
                >
                  <Icon className="w-10 h-10 text-gray-400 mb-4" />
                  <h3 className="text-white font-medium">{industry.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
