"use client";

import { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceWhatWeDoProps {
    category: string;
    services: Array<{
        title: string;
        description?: string;
        shortDescription?: string;
    }>;
}

const ServiceWhatWeDo = ({ category, services }: ServiceWhatWeDoProps) => {
    const [openIndex, setOpenIndex] = useState(-1);

    return (
        <div className="w-full px-4 mt-14 md:mt-20 relative h-full">
            <div className="w-full bg-[#1A1F35] rounded-[40px] px-4 py-8 md:p-16 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center border border-white/5">

                <div className="flex-1 space-y-8">
                    <h2 className="text-3xl md:text-6xl font-bold text-white font-sans leading-tight">
                        What we do in <br className="md:hidden" /> <span className='text-primary whitespace-nowrap'>{category}</span>.
                    </h2>

                    <div className="space-y-6 text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
                        <p>
                            It starts with an <span className="font-bold text-white">understanding of what's at stake.</span> Whether you're rebuilding legacy code or starting from zero, we bring your vision to life with a clear roadmap.
                        </p>

                        <p>
                            We assign a dedicated team to <span className="font-bold text-primary">build, launch, and evolve your solution.</span> No freelancers, no fire drills—just a product team aligned like cofounders.
                        </p>
                    </div>
                </div>

                {/* Right Side - Accordion */}
                <div className="flex-1 w-full lg:max-w-xl bg-[#0F111A] rounded-[32px] p-6 md:p-10 border border-white/5">
                    <div className="space-y-4">
                        {services.map((service, index) => {
                            const isOpen = openIndex === index;
                            const description = service.description || service.shortDescription || "Comprehensive digital solution tailored to your business needs.";

                            return (
                                <div
                                    key={index}
                                    className="border-b border-white/10 last:border-b-0 pb-4 last:pb-0"
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        className="w-full flex items-center justify-between text-left group py-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-primary/20' : 'bg-white/5'}`}>
                                                <CheckCircle2 className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white/70'}`} />
                                            </div>
                                            <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white'}`}>
                                                {service.title}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <ChevronDown className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white/50'}`} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            >
                                                <div className="pt-2 pb-6 pl-16">
                                                    <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                                                        {description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceWhatWeDo;
