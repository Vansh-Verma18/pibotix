'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    title: 'Discovery & Audit',
    desc: 'We analyze your current operations, identify bottlenecks, and define clear automation goals and ROI targets.'
  },
  {
    num: '02',
    title: 'System Design',
    desc: 'Our engineers draft 3D simulations, electrical schematics, and software architectures tailored to your facility.'
  },
  {
    num: '03',
    title: 'Build & Integration',
    desc: 'Hardware assembly and software programming commence in our lab, followed by rigorous Factory Acceptance Testing (FAT).'
  },
  {
    num: '04',
    title: 'Deployment & Support',
    desc: 'On-site installation, Site Acceptance Testing (SAT), operator training, and 24/7 predictive maintenance support.'
  }
];

export default function Timeline() {
  return (
    <section className="py-24 bg-card relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Automation Process</h2>
          <p className="text-gray-400 text-lg">
            A proven, risk-mitigated approach to deploying complex automation systems with zero unexpected downtime.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pt-8 md:pt-0"
              >
                {/* Node */}
                <div className="hidden md:flex absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-card bg-primary z-10" />
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full relative overflow-hidden group hover:border-primary/50 transition-colors md:mt-20">
                  <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-4 group-hover:text-primary/10 transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 relative z-10">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
