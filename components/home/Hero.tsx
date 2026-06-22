'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, Shield, Clock, Award, Zap } from 'lucide-react';

const PARTNER_LOGOS = [
  'Siemens', 'ABB', 'FANUC', 'KUKA', 'Rockwell', 'Mitsubishi'
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with abstract grid and gradients */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">Trusted by 50+ Manufacturing Facilities Worldwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.05]"
          >
            We Build the Robots <br className="hidden md:block" />
            That Build <span className="text-gradient">Your Products</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            End-to-end industrial robotics, PLC programming, and AI vision systems — 
            engineered for factories that can&apos;t afford downtime. From concept to commissioning, we deliver.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/assessment"
              className="w-full sm:w-auto h-14 inline-flex items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/25 gap-2"
            >
              Get Free Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto h-14 inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 gap-2"
            >
              <Play className="w-4 h-4" /> Watch How We Work
            </Link>
          </motion.div>

          {/* Quick Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mb-16"
          >
            {[
              { icon: Zap, value: '150+', label: 'Robots Deployed' },
              { icon: Award, value: '45%', label: 'Avg OEE Increase' },
              { icon: Shield, value: '99.9%', label: 'Quality Rate' },
              { icon: Clock, value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="w-5 h-5 text-primary/60 mb-1" />
                <span className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter">{stat.value}</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Technology Partners Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="border-t border-white/5 pt-8"
          >
            <p className="text-xs text-gray-600 uppercase tracking-widest font-medium mb-6">Certified Technology Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {PARTNER_LOGOS.map((name) => (
                <div
                  key={name}
                  className="text-gray-600 hover:text-gray-400 transition-colors font-bold text-lg tracking-wider"
                >
                  {name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
