'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Layers, Wrench, HeadphonesIcon, TrendingUp } from 'lucide-react';

const DIFFERENTIATORS = [
  {
    icon: Layers,
    title: 'End-to-End Delivery',
    desc: 'From initial audit and 3D simulation to installation and operator training — we own every phase of your automation project.',
  },
  {
    icon: Wrench,
    title: 'OEM Agnostic',
    desc: 'ABB, FANUC, KUKA, Siemens, Rockwell, Mitsubishi — we integrate the best hardware for your specific application, not ours.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Predictive Support',
    desc: 'Our AI-powered monitoring detects anomalies and predicts failures before they cause downtime. Support engineers on call around the clock.',
  },
  {
    icon: TrendingUp,
    title: 'Proven ROI',
    desc: '12-month average payback period. Every project includes a detailed ROI analysis and post-deployment performance tracking.',
  },
];

export default function WhyPiBotix() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Text Content */}
          <div className="lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold mb-6 uppercase tracking-wider">
                Why PiBotix
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Why Leading Manufacturers Choose <span className="text-gradient">PiBotix</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                We&apos;re not just system integrators — we&apos;re your long-term automation partner. Our engineering team brings decades of combined factory-floor experience to every project.
              </p>
              
              {/* Quick proof points */}
              <div className="space-y-3">
                {[
                  '150+ robotic systems deployed globally',
                  'Average 45% OEE improvement for clients',
                  'Zero unplanned downtime during installations',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-gray-300 text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Differentiator Cards */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card border border-white/10 rounded-2xl p-7 hover:border-primary/30 hover:bg-white/[0.02] transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
