import Hero from '@/components/home/Hero';
import ServicesGrid from '@/components/home/ServicesGrid';
import Industries from '@/components/home/Industries';
import Metrics from '@/components/home/Metrics';
import Timeline from '@/components/home/Timeline';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Metrics />
      <Industries />
      <Timeline />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </>
  );
}
