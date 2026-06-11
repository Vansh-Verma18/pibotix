import dynamic from "next/dynamic";
import generatePageMetadata from "@/utils/generateMetadata";

const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"));
const WhatWeDo = dynamic(() => import("@/components/home/WhatWeDo"));
const Services = dynamic(() => import("@/components/home/Services"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const ContactSection = dynamic(() => import("@/components/home/ContactSection"));

export const metadata = generatePageMetadata("home");

export default function Home() {
  return (
    <main className="w-full md:container md:mx-auto pb-10">
      <HeroSection />
      <WhyChooseUs />
      <WhatWeDo />
      <Services />
      <Testimonials />
      <ContactSection />
    </main>
  );
}
