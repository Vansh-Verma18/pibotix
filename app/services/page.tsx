import Link from 'next/link';
import { Bot, Database, Zap, Network, Factory, Cpu, Wrench, BarChart } from 'lucide-react';

const ALL_SERVICES = [
  {
    title: 'Industrial Robotics',
    slug: 'industrial-robotics',
    description: 'Custom robotic cells for assembly, welding, and material handling featuring ABB, FANUC, and KUKA.',
    icon: Bot,
  },
  {
    title: 'PLC & SCADA Systems',
    slug: 'plc-programming',
    description: 'Robust control systems using Siemens and Allen Bradley with modern HMI/SCADA visualization.',
    icon: Database,
  },
  {
    title: 'Machine Vision AI',
    slug: 'machine-vision',
    description: 'Deep learning-powered quality inspection, defect detection, and robotic guidance.',
    icon: Zap,
  },
  {
    title: 'Industrial IoT',
    slug: 'industrial-iot',
    description: 'Connecting factory floors to the cloud with MQTT, OPC-UA, and Edge Computing solutions.',
    icon: Network,
  },
  {
    title: 'Production Automation',
    slug: 'production-automation',
    description: 'End-to-end assembly line design and production workflow optimization.',
    icon: Factory,
  },
  {
    title: 'Predictive Maintenance',
    slug: 'predictive-maintenance',
    description: 'AI-driven sensor networks that predict machine failures before they cause downtime.',
    icon: Cpu,
  },
  {
    title: 'Custom Machinery',
    slug: 'custom-machinery',
    description: 'Bespoke automated machines designed from scratch for unique manufacturing processes.',
    icon: Wrench,
  },
  {
    title: 'Digital Transformation',
    slug: 'digital-transformation',
    description: 'Complete strategic overhaul of paper-based processes into fully digitized, trackable workflows.',
    icon: BarChart,
  }
];

export const metadata = {
  title: 'Automation Services | Pibotix',
  description: 'Explore our comprehensive range of industrial automation services including robotics, PLC programming, and AI vision systems.',
};

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-gray-400">
            We provide end-to-end industrial automation solutions designed to optimize throughput, ensure pristine quality, and maximize operational ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group p-8 rounded-2xl bg-card border border-white/10 hover:bg-white/5 hover:border-primary/50 transition-all block relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                <Icon className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-primary font-semibold">
                  View Service Details <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
