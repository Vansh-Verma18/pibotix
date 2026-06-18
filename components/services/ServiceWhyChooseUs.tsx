"use client";

import { CheckCircle2, Zap, Shield, Rocket } from "lucide-react";

const features = [
    {
        icon: Rocket,
        title: "Accelerated Growth",
        description:
            "Strategies designed to fast-track your market presence and revenue generation.",
    },
    {
        icon: Shield,
        title: "Enterprise Grade Security",
        description:
            "Rigorous security protocols ensuring your data and applications are always protected.",
    },
    {
        icon: Zap,
        title: "High Performance",
        description:
            "Optimized for speed and efficiency to deliver the best possible user experience.",
    },
    {
        icon: CheckCircle2,
        title: "Guaranteed Quality",
        description:
            " rigorous testing and QA processes to ensure bug-free and reliable deliverables.",
    },
];

export default function ServiceWhyChooseUs() {
    return (
        <section className="w-full px-4 mt-14 md:mt-20 relative h-full mb-20">
            <div className="w-full bg-[#3D2B56] rounded-[40px] px-4 py-8 md:p-16">
                <div className="w-full mb-12 flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Why Partner With <span className="text-primary">Vortexio?</span>
                    </h2>
                    <p className="text-gray-300 max-w-2xl text-lg">
                        We don&apos;t just build software; we build engineered solutions that drive
                        business success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-[#0B1221] border border-white/5 p-8 rounded-3xl min-h-[320px] flex flex-col justify-start"
                        >
                            <div className="relative z-10 w-full h-full flex flex-col">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 text-base leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
