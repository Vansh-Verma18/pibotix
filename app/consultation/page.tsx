"use client";

import { useState } from "react";
import { Loader2, Calendar, Upload, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultationBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      let documentUrl = "";

      // Handle file upload if present
      if (file) {
        const fileData = new FormData();
        fileData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          documentUrl = uploadData.url;
        }
      }

      // Submit booking
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        company: formData.get("company"),
        phone: formData.get("phone"),
        service: formData.get("service"),
        industry: formData.get("industry"),
        budget: formData.get("budget"),
        preferredDate: formData.get("preferredDate"),
        timeSlot: formData.get("timeSlot"),
        topic: formData.get("topic"),
        message: formData.get("message"),
        documentUrl,
      };

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-12 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-white/10 rounded-3xl p-10 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Request Submitted</h2>
          <p className="text-gray-400 mb-8">
            Your consultation request has been received. Our team will review your project details and send a confirmation email shortly.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book a <span className="text-primary">Consultation</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Schedule a meeting with our automation experts to discuss your facility's specific challenges and transformation goals.
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Contact Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">1. Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input required name="name" type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label>
                  <input required name="email" type="email" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                  <input required name="company" type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input name="phone" type="tel" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>

            {/* Section 2: Project Details */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">2. Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Required Service *</label>
                  <select required name="service" defaultValue="" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                    <option value="" disabled>Select a Service</option>
                    <option value="Industrial Robotics" className="bg-[#111]">Industrial Robotics</option>
                    <option value="PLC & Controls" className="bg-[#111]">PLC & Controls</option>
                    <option value="Machine Vision" className="bg-[#111]">Machine Vision AI</option>
                    <option value="Facility Retrofit" className="bg-[#111]">Facility Retrofit</option>
                    <option value="General Consulting" className="bg-[#111]">General Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Industry *</label>
                  <select required name="industry" defaultValue="" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                    <option value="" disabled>Select your Industry</option>
                    <option value="Automotive" className="bg-[#111]">Automotive</option>
                    <option value="Aerospace" className="bg-[#111]">Aerospace</option>
                    <option value="Electronics" className="bg-[#111]">Electronics</option>
                    <option value="Food & Beverage" className="bg-[#111]">Food & Beverage</option>
                    <option value="Logistics" className="bg-[#111]">Logistics</option>
                    <option value="Other" className="bg-[#111]">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range *</label>
                  <select required name="budget" defaultValue="" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                    <option value="" disabled>Select Budget</option>
                    <option value="< $50k" className="bg-[#111]">&lt; $50k</option>
                    <option value="$50k - $250k" className="bg-[#111]">$50k - $250k</option>
                    <option value="$250k - $1M" className="bg-[#111]">$250k - $1M</option>
                    <option value="$1M+" className="bg-[#111]">$1M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Short Topic / Title *</label>
                  <input required name="topic" type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Assembly Line Automation" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Description *</label>
                <textarea required name="message" rows={4} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Please describe your challenges and what you want to achieve..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Requirement Documents (Optional)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="file-upload" 
                  />
                  <label htmlFor="file-upload" className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-xl px-4 py-8 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer">
                    <Upload className="w-5 h-5" />
                    {file ? file.name : "Click to attach PDF, DOC, or image files"}
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Scheduling */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">3. Preferred Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Preferred Date *</label>
                  <input required name="preferredDate" type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Time Slot *</label>
                  <select required name="timeSlot" defaultValue="" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                    <option value="" disabled>Select a slot</option>
                    <option value="09:00 AM - 10:00 AM" className="bg-[#111]">09:00 AM - 10:00 AM (EST)</option>
                    <option value="11:00 AM - 12:00 PM" className="bg-[#111]">11:00 AM - 12:00 PM (EST)</option>
                    <option value="01:00 PM - 02:00 PM" className="bg-[#111]">01:00 PM - 02:00 PM (EST)</option>
                    <option value="03:00 PM - 04:00 PM" className="bg-[#111]">03:00 PM - 04:00 PM (EST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Request...</>
                ) : (
                  "Book Consultation"
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
