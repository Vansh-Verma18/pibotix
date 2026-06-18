'use client';

import { useState } from 'react';
import { submitLead } from '@/actions/lead';
import { Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      phone: formData.get('phone') as string,
      serviceOfInterest: formData.get('serviceOfInterest') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await submitLead(data);
      setStatus(response);
      if (response.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      setStatus({ success: false, message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-white/10 p-8 rounded-2xl">
      {status && (
        <div className={`p-4 rounded-lg text-sm font-medium ${status.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</label>
          <input required type="text" id="name" name="name" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Work Email *</label>
          <input required type="email" id="email" name="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="john@company.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-gray-300">Company Name *</label>
          <input required type="text" id="company" name="company" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Acme Mfg" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
          <input type="tel" id="phone" name="phone" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="serviceOfInterest" className="text-sm font-medium text-gray-300">Primary Area of Interest</label>
        <select id="serviceOfInterest" name="serviceOfInterest" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none">
          <option value="General Inquiry" className="bg-card">General Inquiry</option>
          <option value="Industrial Robotics" className="bg-card">Industrial Robotics</option>
          <option value="PLC Programming" className="bg-card">PLC & SCADA Development</option>
          <option value="Machine Vision" className="bg-card">Machine Vision AI</option>
          <option value="Production Automation" className="bg-card">Production Automation</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">Project Details *</label>
        <textarea required id="message" name="message" rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Please describe your current operational challenges or automation goals..."></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
        ) : (
          'Request Consultation'
        )}
      </button>
    </form>
  );
}
