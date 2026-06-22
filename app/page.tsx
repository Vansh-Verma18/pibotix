import Hero from '@/components/home/Hero';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyPiBotix from '@/components/home/WhyPiBotix';
import Industries from '@/components/home/Industries';
import FeaturedCaseStudies from '@/components/home/FeaturedCaseStudies';
import Timeline from '@/components/home/Timeline';
import Testimonials from '@/components/home/Testimonials';
import TechPartners from '@/components/home/TechPartners';
import FAQ from '@/components/home/FAQ';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <WhyPiBotix />
      <Industries />
      <FeaturedCaseStudies />
      <Timeline />
      <Testimonials />
      <TechPartners />
      <FAQ />
      <ContactCTA />
    </>
  );
}
