"use client";


import Link from "next/link";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { servicesData } from "@/data/services";
import ServiceCard from "../services/ServiceCard";

export default function Services() {
  const screenWidth = useScreenWidth();
  const isMobile = screenWidth < 768;

  const displayedServices = isMobile
    ? servicesData.filter(service => service.isFeatured)
    : servicesData;

  return (
    <div
      id="services"
      className="w-full px-4 mt-14 md:mt-32 relative h-full pb-20"
    >
      <div className="w-full mb-8 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-4xl md:text-6xl font-bold text-white font-sans mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl">
            Transforming ideas into powerful digital solutions with cutting-edge technology
          </p>
        </div>

      </div>

      <div className="w-full bg-transparent lg:py-10 rounded-4xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {displayedServices.map((service, index) => (
            <Link key={index} href={`/services/${service.slug}`} className="block h-full group">
              <div className="h-full">
                <ServiceCard service={service} />
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden mt-8 flex justify-center">
        </div>
      </div>
    </div>
  );
}