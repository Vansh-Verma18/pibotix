export const metadata = {
  title: 'Careers | AutoForge',
  description: 'Join our team of elite automation engineers and software developers to build the factory of the future.',
};

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Build the Future With Us</h1>
        <p className="text-xl text-gray-400 mb-16">
          We are constantly looking for talented robotics engineers, PLC programmers, and AI specialists who want to solve the world's most complex manufacturing problems.
        </p>

        <div className="bg-card border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">No open positions currently</h3>
          <p className="text-gray-400 mb-6">
            We are not actively hiring at this exact moment, but we always review resumes from exceptional talent. Send your CV to careers@autoforge.com.
          </p>
        </div>
      </div>
    </div>
  );
}
