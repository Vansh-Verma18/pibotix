"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import CustomImage from "@/components/ui/CustomImage";
import { servicesData } from "@/data/services";

export default function ServiceListDetailed() {
    return (
        <div className="w-full flex flex-col gap-20 md:gap-32">
            {servicesData.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                    <div
                        key={service.slug}
                        className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center`}
                    >
                        {/* Image Section */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 aspect-video lg:aspect-square md:aspect-video">
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                <div className="flex h-full items-center justify-center p-8">
                                    <CustomImage
                                        src={service.src}
                                        alt={service.title}
                                        title={service.title}
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                                {service.category}
                            </span>

                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                {service.title}
                            </h3>

                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
                                {service.shortDescription}
                            </p>

                            {/* Sub-services / Features List (extracted from data if available, or generic) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
                                {service.services.slice(0, 4).map((subApp, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-gray-300 font-medium text-sm md:text-base">{subApp.title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={`/services/${service.slug}`}
                                    className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-300"
                                >
                                    Learn More
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
