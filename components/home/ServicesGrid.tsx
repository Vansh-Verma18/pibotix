'use client';

import { motion } from 'framer-motion';
import { Cpu, Factory, Database, Bot, Zap, Network } from 'lucide-react';
import Link from 'next/link';

const SERVICES = [
  {
    title: 'Industrial Robotics',
    description: 'Custom robotic cells for assembly, welding, and material handling featuring ABB, FANUC, and KUKA.',
    icon: Bot,
    href: '/services/industrial-robotics'
  },
  {
    title: 'PLC & SCADA Systems',
    description: 'Robust control systems using Siemens and Allen Bradley with modern HMI/SCADA visualization.',
    icon: Database,
    href: '/services/plc-programming'
  },
  {
    title: 'Machine Vision AI',
    description: 'Deep learning-powered quality inspection, defect detection, and robotic guidance.',
    icon: Zap,
    href: '/services/machine-vision'
  },
  {
    title: 'Industrial IoT',
    description: 'Connecting factory floors to the cloud with MQTT, OPC-UA, and Edge Computing solutions.',
    icon: Network,
    href: '/services/industrial-iot'
  },
  {
    title: 'Production Automation',
    description: 'End-to-end assembly line design and production workflow optimization.',
    icon: Factory,
    href: '/services/production-automation'
  },
  {
    title: 'Predictive Maintenance',
    description: 'AI-driven sensor networks that predict machine failures before they cause downtime.',
    icon: Cpu,
    href: '/services/predictive-maintenance'
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-card relative z-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Core Capabilities</h2>
          <p className="text-gray-400 text-lg">
            Comprehensive automation solutions engineered to scale. From legacy system upgrades to cutting-edge AI deployments, we cover the full spectrum of industrial technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={service.href}
                  className="group block h-full p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                  <Icon className="w-12 h-12 text-primary mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    Learn More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
