"use client";

export default function DeliveryProcess() {
    const steps = [
        {
            number: "01",
            title: "Discovery & Strategy",
            description:
                "We dive deep into your business goals, user needs, and market landscape to build a concrete roadmap.",
        },
        {
            number: "02",
            title: "Design & Decoration",
            description:
                "Crafting intuitive, high-fidelity designs that align with your brand identity and user expectations.",
        },
        {
            number: "03",
            title: "Agile Development",
            description:
                "Iterative coding sprints with regular feedback loops, ensuring transparency and rapid progress.",
        },
        {
            number: "04",
            title: "Quality Assurance",
            description:
                "Rigorous testing across devices and scenarios to guarantee a bug-free, secure, and performant product.",
        },
        {
            number: "05",
            title: "Launch & Scale",
            description:
                "Seamless deployment and ongoing support to help your product grow and evolve with the market.",
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-[#0A0F1C]">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-20 text-center">
                    <span className="text-primary font-extrabold tracking-[0.2em] uppercase mb-4 block text-sm md:text-base">
                        Our Workflow
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        High-Impact <span className="text-primary">Delivery</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        A structured process designed to minimize risk and maximize ROI.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.33%-1.67rem)] relative"
                        >
                            <div className="h-full relative bg-white/4 border border-white/10 rounded-[40px] p-10 md:p-12 flex flex-col items-center text-center">
                                <div className="relative z-10 w-full">
                                    <span className="inline-block text-6xl md:text-8xl font-black text-white/10 mb-8">
                                        {step.number}
                                    </span>

                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
