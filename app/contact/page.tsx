import ContactForm from '@/components/contact/ContactForm';
import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: 'Contact Engineering | AutoForge',
  description: 'Reach out to our engineering team to discuss your industrial automation, robotics, or PLC programming needs.',
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Engineering</h1>
          <p className="text-xl text-gray-400">
            Whether you need a complete facility retrofit or a specific robotic workcell, our automation experts are ready to architect your solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card border border-white/10 rounded-2xl p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Headquarters</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  100 Automation Parkway<br />
                  Detroit, MI 48201<br />
                  United States
                </p>
              </div>
            </div>

            <div className="bg-card border border-white/10 rounded-2xl p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Email Us</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Sales: sales@autoforge.com<br />
                  Support: support@autoforge.com
                </p>
              </div>
            </div>

            <div className="bg-card border border-white/10 rounded-2xl p-8 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Call Us</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  +1 (800) 555-0199<br />
                  Mon-Fri, 8am-6pm EST
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
