import { Metadata } from "next";
import IndustryHero from "@/components/industries/IndustryHero";
import IndustryList from "@/components/industries/IndustryList";
import IndustryMatrix from "@/components/industries/IndustryMatrix";
import ReadinessAssessment from "@/components/industries/ReadinessAssessment";
import IndustryFAQ from "@/components/industries/IndustryFAQ";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries We Serve | Enterprise Industrial Automation",
  description: "Explore our specialized industrial automation solutions for Automotive, Electronics, Pharmaceuticals, Food & Beverage, Warehousing, and more.",
};

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <IndustryHero />
      <IndustryList />
      <IndustryMatrix />
      <ReadinessAssessment />
      <IndustryFAQ />
      
      {/* Custom Consultation CTA */}
      <section className="py-24 bg-gradient-to-b from-background to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/light-full-vortexio.svg')] bg-center opacity-5 z-0" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-primary/20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Automate Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-600">Industry Operations?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Our engineers are ready to discuss your specific challenges and architect a custom automation solution that drives measurable ROI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/contact"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Schedule Consultation <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/case-studies"
                className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl text-lg flex items-center justify-center transition-all"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
