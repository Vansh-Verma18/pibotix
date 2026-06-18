import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import ContactCTA from '@/components/home/ContactCTA';

// Mock data to simulate MongoDB fetch for demonstration purposes
const SERVICE_DATA: Record<string, any> = {
  'industrial-robotics': {
    title: 'Industrial Robotics Integration',
    overview: 'Transform your manufacturing floor with custom robotic cells designed for high-speed assembly, precision welding, and heavy-payload material handling. We integrate leading robotics platforms (ABB, FANUC, KUKA) with custom end-of-arm tooling and advanced safety systems.',
    problems: [
      'High labor costs in repetitive tasks',
      'Inconsistent product quality and high defect rates',
      'Ergonomic hazards and workplace injuries',
      'Inability to scale production during peak demand'
    ],
    features: [
      '6-Axis and SCARA Robot Integration',
      'Collaborative Robot (Cobot) Deployments',
      'Custom End-of-Arm Tooling (EOAT) Design',
      'Integrated Vision Guidance (2D/3D)'
    ],
    benefits: [
      'Increase production throughput by up to 60%',
      'Achieve sub-millimeter repeatable precision',
      'Reallocate human capital to high-value tasks',
      'Operate 24/7 with minimal downtime'
    ],
    technologies: ['ABB RobotStudio', 'FANUC ROBOGUIDE', 'KUKA.Sim', 'Siemens TIA Portal', 'Cognex Vision'],
    industries: ['Automotive', 'Electronics', 'Packaging', 'Metal Fabrication'],
    workflow: [
      { step: 1, title: 'Process Assessment', desc: 'Analyzing cycle times and payload requirements.' },
      { step: 2, title: 'Simulation & Design', desc: '3D modeling of the robotic cell to ensure reach and cycle time.' },
      { step: 3, title: 'Build & Programming', desc: 'Offline programming and physical cell assembly.' },
      { step: 4, title: 'Commissioning', desc: 'On-site installation and operator safety training.' }
    ]
  },
  'plc-programming': {
    title: 'PLC & SCADA Development',
    overview: 'Robust, fault-tolerant control architectures for complex manufacturing processes. Our engineers specialize in advanced PLC programming and intuitive SCADA HMI development, ensuring you have total visibility and absolute control over your facility.',
    problems: [
      'Obsolete legacy control systems causing downtime',
      'Lack of centralized visibility into plant operations',
      'Spaghetti code making troubleshooting impossible',
      'Poor data logging for compliance and quality tracking'
    ],
    features: [
      'IEC 61131-3 Standard Programming',
      'High-Performance HMI Design',
      'Historical Data Logging and Trending',
      'Legacy Migration and Upgrades'
    ],
    benefits: [
      'Drastically reduce mean time to repair (MTTR)',
      'Empower operators with clear, actionable data',
      'Ensure strict compliance with automated reporting',
      'Future-proof your control architecture'
    ],
    technologies: ['Siemens S7/TIA Portal', 'Rockwell Studio 5000', 'Ignition SCADA', 'Wonderware', 'Beckhoff'],
    industries: ['Food & Beverage', 'Pharmaceuticals', 'Water/Wastewater', 'Oil & Gas'],
    workflow: [
      { step: 1, title: 'Functional Specification', desc: 'Defining I/O lists and control narratives.' },
      { step: 2, title: 'Software Architecture', desc: 'Developing modular, reusable code blocks.' },
      { step: 3, title: 'HMI/SCADA Design', desc: 'Creating situational awareness graphics.' },
      { step: 4, title: 'FAT & SAT', desc: 'Rigorous testing before and after deployment.' }
    ]
  }
};

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch from MongoDB here:
  // const service = await Service.findOne({ slug: params.slug });
  const service = SERVICE_DATA[params.slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="pt-32 pb-0 bg-background min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <Link href="/services" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Services
        </Link>
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {service.title}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            {service.overview}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Business Problems */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 font-mono border-b border-white/10 pb-4">Business Challenges Solved</h3>
              <ul className="space-y-4">
                {service.problems.map((prob: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <div className="min-w-6 mt-1"><CheckCircle2 className="w-6 h-6 text-primary" /></div>
                    <span className="leading-relaxed">{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-white/10 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-6">Key Features</h4>
                <ul className="space-y-3 text-gray-400">
                  {service.features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-white/10 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-6">Bottom-Line Benefits</h4>
                <ul className="space-y-3 text-gray-400">
                  {service.benefits.map((ben: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {ben}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Workflow */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 font-mono border-b border-white/10 pb-4">Deployment Workflow</h3>
              <div className="space-y-6">
                {service.workflow.map((wf: any) => (
                  <div key={wf.step} className="flex gap-6 bg-white/5 p-6 rounded-xl border border-white/5">
                    <div className="text-3xl font-bold text-primary/40 font-mono">0{wf.step}</div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{wf.title}</h4>
                      <p className="text-gray-400">{wf.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 sticky top-28">
              <h3 className="text-xl font-bold text-white mb-6">Technology Stack</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {service.technologies.map((tech: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-primary/20 text-primary text-sm rounded-md font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold text-white mb-6">Industries</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {service.industries.map((ind: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 text-gray-300 border border-white/10 text-sm rounded-md">
                    {ind}
                  </span>
                ))}
              </div>

              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl font-bold transition-all"
              >
                Discuss This Solution <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Global Contact CTA */}
      <ContactCTA />
    </div>
  );
}
