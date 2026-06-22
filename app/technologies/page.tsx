import { Code2, Cpu, Database, Network } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Technology Stack | Pibotix',
  description: 'Explore the industry-leading hardware and software platforms we use to build enterprise automation systems.',
};

const TECH_CATEGORIES = [
  {
    category: 'Industrial Robotics',
    icon: Cpu,
    platforms: [
      { name: 'FANUC', desc: 'Industry standard for high-payload and high-speed robotic applications.' },
      { name: 'ABB', desc: 'Advanced motion control and collaborative robotic (Cobot) solutions.' },
      { name: 'KUKA', desc: 'Precision kinematics and heavy-duty 6-axis robotic cells.' },
      { name: 'Universal Robots', desc: 'Flexible, safe collaborative robots for dynamic environments.' }
    ]
  },
  {
    category: 'PLC & Control Systems',
    icon: Database,
    platforms: [
      { name: 'Siemens TIA Portal', desc: 'Comprehensive engineering framework for S7 controllers.' },
      { name: 'Allen-Bradley / Rockwell', desc: 'Studio 5000 environment for ControlLogix and CompactLogix.' },
      { name: 'Beckhoff', desc: 'PC-based control systems using TwinCAT for high-performance automation.' },
      { name: 'Omron', desc: 'EtherCAT-based machine control and drive technology.' }
    ]
  },
  {
    category: 'Machine Vision & AI',
    icon: Code2,
    platforms: [
      { name: 'Cognex', desc: 'Industry-leading 2D and 3D vision systems for inspection and guidance.' },
      { name: 'Keyence', desc: 'High-speed code reading, measurement, and defect detection.' },
      { name: 'TensorFlow / PyTorch', desc: 'Custom deep learning models for complex anomaly detection.' },
      { name: 'OpenCV', desc: 'Open-source computer vision library for custom algorithmic development.' }
    ]
  },
  {
    category: 'Industrial IoT & SCADA',
    icon: Network,
    platforms: [
      { name: 'Inductive Automation (Ignition)', desc: 'Web-based industrial platform for SCADA, IIoT, and MES.' },
      { name: 'MQTT / OPC-UA', desc: 'Standardized protocols for secure machine-to-machine communication.' },
      { name: 'AWS IoT / Azure IoT', desc: 'Cloud platforms for predictive maintenance and fleet fleet management.' },
      { name: 'Wonderware (AVEVA)', desc: 'Enterprise HMI and supervisory control.' }
    ]
  }
];

export default function TechnologiesPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Technology Stack</h1>
          <p className="text-xl text-gray-400">
            We are platform-agnostic integrators. We select the best hardware and software for your specific application to ensure maximum performance and longevity.
          </p>
        </div>

        <div className="space-y-16 max-w-5xl mx-auto">
          {TECH_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.category} className="bg-card border border-white/10 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.platforms.map((platform) => (
                    <div key={platform.name} className="flex gap-4 group">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                        <p className="text-gray-400 leading-relaxed">{platform.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
          >
            Discuss Your Tech Requirements
          </Link>
        </div>

      </div>
    </div>
  );
}
