import Link from 'next/link';

export const metadata = {
  title: 'About Us | Pibotix',
  description: 'Learn about our engineering team, our history, and our mission to transform global manufacturing through intelligent automation.',
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Pioneering the Future of Manufacturing</h1>
          <p className="text-xl text-gray-400">
            Pibotix was founded by veteran engineers frustrated by the inefficiencies of legacy manufacturing. Today, we are a leading systems integrator delivering world-class robotics and AI solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20">
          <div className="bg-card border border-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To empower industrial enterprises with intelligent, robust, and scalable automation technologies that eliminate waste, enhance safety, and exponentially increase throughput.
            </p>
          </div>
          <div className="bg-card border border-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              We envision a world where human capital is liberated from dangerous, repetitive tasks, allowing teams to focus on innovation while autonomous systems handle the heavy lifting.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/contact"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-white transition-all hover:bg-primary/90 hover:scale-105"
          >
            Join Us on Our Mission
          </Link>
        </div>

      </div>
    </div>
  );
}
