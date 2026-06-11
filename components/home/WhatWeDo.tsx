"use client";

import { useState } from 'react';
import { Smartphone, Code, Palette, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatWeDo = () => {

    const [openIndex, setOpenIndex] = useState(-1);

    const services = [
        {
            icon: Smartphone,
            title: "Mobile app development.",
            description: "We deliver iOS and Android apps that feel native, fast, and frictionless. By building in React Native, we create mobile software that earns a permanent spot on your users' home screens."
        },
        {
            icon: Code,
            title: "Custom software development.",
            description: "From enterprise systems to SaaS platforms, we build scalable custom software solutions tailored to your unique business requirements and workflows."
        },
        {
            icon: Palette,
            title: "UX/UI design.",
            description: "We create intuitive, beautiful interfaces that users love. Our design process focuses on user research, prototyping, and testing to deliver exceptional experiences."
        },
        {
            icon: Globe,
            title: "Web app development.",
            description: "We build modern, responsive web applications using cutting-edge technologies like React and Next.js that deliver exceptional performance and user experience."
        }
    ];

    return (
        <div
            id="whatwedo"
            className="w-full px-4 mt-14 md:mt-20 relative h-full"
        >
            <div className="w-full bg-[#3D2B56] rounded-[40px] px-4 py-8 md:p-16 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">

                <div className="flex-1 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-bold text-white font-sans">
                        What <span className='text-primary'>we do.</span>
                    </h2>

                    <div className="space-y-6 text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl">
                        <p>
                            It starts with an <span className="font-bold text-white">understanding of what&apos;s at stake.</span> Whether you&apos;re rebuilding legacy code or starting from zero, we bring your vision to life with a clear roadmap and transparent protocol.
                        </p>

                        <p>
                            We assign a dedicated team to <span className="font-bold text-primary">build, launch, and evolve your app or web-app.</span> No freelancers, no fire drills—just a product team aligned like cofounders.
                        </p>


                    </div>
                </div>

                <div className="flex-1 w-full lg:max-w-xl bg-[#0F111A] rounded-[32px] p-6 md:p-10">
                    <div className="space-y-4">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            const isOpen = openIndex === index;

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
                                                <Icon className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white/70'}`} />
                                            </div>
                                            <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-white'}`}>
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
                                                    <p className="text-base md:text-lg text-white/70 leading-relaxed">
                                                        {service.description}
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

export default WhatWeDo;
