"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function VisionSection() {
    return (
        <section className="py-24 relative">
            <div className="w-full max-w-5xl mx-auto text-center px-4">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
                    "We don't just write code. We engineer <span className="text-primary">digital ecosystems</span> that empower businesses to lead their industries."
                </h2>
                <div className="h-1 w-24 bg-primary mx-auto mb-8 rounded-full" />
                <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
                    At Vortexio, we believe technology should be an enabler, not a bottleneck. Our mission is to bridge the gap between complex innovation and seamless user experiences, providing you with the tools to scale without limits.
                </p>

                <Link href="/about" className="inline-flex items-center gap-2 text-white font-semibold hover:text-primary transition-colors duration-300 border-b border-transparent hover:border-primary pb-1">
                    Read more about our vision <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
