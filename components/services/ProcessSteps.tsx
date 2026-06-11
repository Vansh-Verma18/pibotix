"use client";

interface ProcessStep {
    title: string;
    description: string;
}

interface ProcessStepsProps {
    steps: ProcessStep[];
    title?: string;
    subtitle?: string;
}

export default function ProcessSteps({
    steps,
    title = "Our Development Process",
    subtitle = "A streamlined workflow designed to deliver efficiency and excellence from concept to launch.",
}: ProcessStepsProps) {
    return (
        <section className="w-full py-20 md:py-32 relative bg-background overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-24 text-center">
                    <h2 className="text-4xl md:text-7xl font-bold mb-6">
                        {title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="text-primary">{title.split(" ").slice(-1)}</span>
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg md:text-2xl font-light leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="relative max-w-7xl mx-auto mt-32">
                    <div className="absolute left-[35px] md:left-1/2 top-0 bottom-0 w-[2px] bg-linear-to-b from-primary via-primary/40 to-transparent md:-translate-x-1/2 opacity-100 z-0">
                        <div className="absolute inset-0 bg-primary/20 blur-sm" />
                    </div>

                    <div className="space-y-32 md:space-y-48">
                        {steps.map((step, index) => {
                            const isRightSide = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`relative flex flex-col md:flex-row items-center ${isRightSide ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    <div className="absolute left-0 md:left-1/2 w-[70px] h-[70px] md:w-[90px] md:h-[90px] bg-[#0F1221] border-[3px] border-primary rounded-full flex items-center justify-center translate-x-0 md:-translate-x-1/2 z-10 shadow-[0_0_40px_rgba(0,229,255,0.25)]">
                                        <span className="text-2xl md:text-4xl font-black text-primary">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <div
                                        className={`w-full md:w-1/2 flex ${isRightSide ? "justify-start" : "justify-end"
                                            }`}
                                    >
                                        <div
                                            className={`w-full max-w-xl pl-[100px] md:pl-0 ${isRightSide
                                                ? "md:pl-28 lg:pl-40 text-left"
                                                : "md:pr-28 lg:pr-40 text-left md:text-right"
                                                }`}
                                        >
                                            <h3 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-white leading-tight hover:text-primary transition-colors duration-300">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-lg md:text-2xl lg:text-3xl font-light">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Spacer for the other side to maintain flex balance */}
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
