import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServiceSlugs } from "@/data/services";
import { Metadata } from "next";


import ServiceHero from "@/components/services/ServiceHero";
import ServiceWhatWeDo from "@/components/services/ServiceWhatWeDo";
import ServiceCard from "@/components/services/ServiceCard";
import ProcessSteps from "@/components/services/ProcessSteps";
import CTASection from "@/components/services/CTASection";
import ServiceWhyChooseUs from "@/components/services/ServiceWhyChooseUs";
import DeliveryProcess from "@/components/services/DeliveryProcess";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllServiceSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
        return {
            title: "Service Not Found",
        };
    }

    return {
        title: `${service.title} | Kolynex Services`,
        alternates: {
            canonical: `/services/${slug}`,
        },
        description: service.shortDescription,
    };
}

interface ServiceItem {
    category: string;
    title: string;
    description?: string;
    shortDescription?: string;
    src: string;
    color: string;
    isFeatured?: boolean;
    slug?: string;
}

export default async function ServicePage({ params }: PageProps) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="w-full md:container md:mx-auto pb-10">
            <ServiceHero
                title={service.heroTitle}
                description={service.heroDescription}
                heroColor={service.heroColor}
            />

            <div className="mt-12 md:mt-16">
                <ServiceWhyChooseUs />
            </div>

            <section id="details" className="w-full px-4 mt-20 md:mt-24">
                <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Comprehensive{" "}
                        <span className="bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            Capabilities
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                        Explore our full range of{" "}
                        <span className="text-white font-medium">
                            {service.category.toLowerCase()}
                        </span>{" "}
                        services tailored for enterprise scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {service.services.map((subService: ServiceItem, index: number) => (
                        <ServiceCard key={index} service={subService} />
                    ))}
                </div>
            </section>

            <div className="mt-24 md:mt-32">
                <ServiceWhatWeDo
                    category={service.category}
                    services={service.services}
                />
            </div>

            {/* 5. Our Workflow (Standard Methodology) */}
            <div className="mt-12">
                <DeliveryProcess />
            </div>

            <ProcessSteps steps={service.processSteps} />

            {/* 7. Social Proof */}
            <div className="py-2">
                <Testimonials />
            </div>

            <CTASection
                title={service.ctaTitle}
                description={service.ctaDescription}
                buttonText={service.ctaButtonText}
            />
            <ContactSection />
        </div>
    );
}
