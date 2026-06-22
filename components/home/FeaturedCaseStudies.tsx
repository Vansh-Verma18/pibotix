'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, Timer, ShieldCheck } from 'lucide-react';

const FEATURED = [
  {
    title: 'Robotic Welding Cell for Automotive Chassis',
    industry: 'Automotive Manufacturing',
    slug: 'robotic-welding-automotive-chassis',
    result: '+60% Throughput',
    resultDetail: 'Dual KUKA robotic welding system eliminated manual welding bottleneck',
    metrics: [
      { label: 'Throughput', value: '+60%', icon: TrendingUp },
      { label: 'Cycle Time', value: '-40%', icon: Timer },
    ],
    gradient: 'from-neutral-800/50 to-primary/20',
  },
  {
    title: 'AI Vision Inspection for Electronics',
    industry: 'Electronics Manufacturing',
    slug: 'ai-vision-inspection-electronics',
    result: '99.7% Defect Detection',
    resultDetail: 'Deep learning vision system detecting micro-defects invisible to human inspectors',
    metrics: [
      { label: 'Detection', value: '99.7%', icon: ShieldCheck },
      { label: 'Downtime', value: '-30%', icon: Timer },
    ],
    gradient: 'from-red-600/20 to-orange-600/20',
  },
  {
    title: 'Autonomous Warehouse Robotics',
    industry: 'Logistics & Distribution',
    slug: 'autonomous-warehouse-robotics',
    result: '3x Faster Fulfillment',
    resultDetail: 'AMR fleet with AI routing cut order fulfillment time by 3x',
    metrics: [
      { label: 'Speed', value: '3x', icon: TrendingUp },
      { label: 'Accuracy', value: '99.9%', icon: ShieldCheck },
    ],
    gradient: 'from-neutral-800/40 to-neutral-700/20',
  },
];

export default function FeaturedCaseStudies() {
  return (
    <section className="py-24 bg-card relative border-t border-white/5 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-sm font-semibold mb-4 uppercase tracking-wider"
            >
              Proven Results
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white"
            >
              Real Results from Real Factories
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-red-400 transition-colors whitespace-nowrap"
            >
              View All Case Studies <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED.map((cs, index) => (
            <motion.div
              key={cs.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group block h-full bg-background border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all"
              >
                {/* Gradient Header */}
                <div className={`h-40 bg-gradient-to-br ${cs.gradient} relative flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{cs.result}</div>
                    <div className="text-sm text-white/60 font-medium">{cs.industry}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {cs.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {cs.resultDetail}
                  </p>

                  {/* Metric Pills */}
                  <div className="flex gap-3 mb-6">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
                        <m.icon className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-xs text-gray-500 uppercase">{m.label}</div>
                          <div className="text-sm font-bold text-white">{m.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-3 gap-2 transition-all">
                    Read Case Study <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
