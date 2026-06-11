"use client";

import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

const ALL_TESTIMONIALS = [
    {
        quote: "We've worked with big firms in Silicon Valley but Vortexio has been our brightest partner. Their technical depth is unmatched.",
        name: "Arjun Mehta",
        role: "Director of Operations",
        company: "Grappos",
        tagline: "Scaling Startup with Product-Market Fit",
        avatar: "https://i.pravatar.cc/150?u=arjun"
    },
    {
        quote: "Working with Vortexio has been one of the best experiences I have ever had. They truly understand modern digital needs.",
        name: "Priya Sharma",
        role: "CIO",
        company: "National Trench Safety",
        tagline: "Mid-Market Company with ~$100MM in Annual Revenue",
        avatar: "https://i.pravatar.cc/150?u=priya"
    },
    {
        quote: "They have top-notch processes and great communication, bridging the gap between business and tech needs perfectly.",
        name: "Rohan Gupta",
        role: "Founder",
        company: "Secur.Space",
        tagline: "Startup (Acquired)",
        avatar: "https://i.pravatar.cc/150?u=rohan"
    },
    {
        quote: "The team at Vortexio delivered our platform well ahead of schedule without compromising any quality. Highly impressed!",
        name: "Ananya Iyer",
        role: "Product Lead",
        company: "SwiftPay",
        tagline: "Fintech Leader in SE Asia",
        avatar: "https://i.pravatar.cc/150?u=ananya"
    },
    {
        quote: "Their focus on ROI and performance is what sets them apart. They are not just developers, but business partners.",
        name: "Vikram Malhotra",
        role: "Tech Advisor",
        company: "CloudScale",
        tagline: "Enterprise Infrastructure Specialist",
        avatar: "https://i.pravatar.cc/150?u=vikram"
    }
];

const testimonials = [...ALL_TESTIMONIALS, ...ALL_TESTIMONIALS, ...ALL_TESTIMONIALS];

const Testimonials = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [centeredIndex, setCenteredIndex] = useState(1);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const container = scrollRef.current;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const centerPoint = scrollLeft + containerWidth / 2;

        const cardElements = container.children;
        let closestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < cardElements.length; i++) {
            const card = cardElements[i] as HTMLElement;
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(centerPoint - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }

        setCenteredIndex(closestIndex);

        const itemWidth = (cardElements[0] as HTMLElement).offsetWidth + 32; // card + gap
        const totalItems = ALL_TESTIMONIALS.length;

        if (scrollLeft <= 50) {
            container.scrollLeft = itemWidth * totalItems;
        } else if (scrollLeft + containerWidth >= container.scrollWidth - 50) {
            container.scrollLeft = itemWidth * totalItems;
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            const cardElements = container.children;
            if (cardElements.length > 0) {
                const itemWidth = (cardElements[0] as HTMLElement).offsetWidth + 32;
                container.scrollLeft = itemWidth * ALL_TESTIMONIALS.length;
            }

            container.addEventListener('scroll', handleScroll);
            requestAnimationFrame(() => handleScroll());
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth / (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 1);
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="testimonials" className="w-full px-4 mt-14 md:mt-12 relative h-full pb-14 md:pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <h2 className="text-4xl md:text-7xl font-bold text-white font-sans">
                    Client <span className='text-primary'>Experiences</span>.
                </h2>

                <div className="flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white cursor-pointer z-10"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white cursor-pointer z-10"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8  overflow-x-auto no-scrollbar snap-x snap-mandatory sm:pt-10 md:pt-16 pb-20 px-0 "
            >
                {testimonials.map((testimonial, index) => {
                    const isCentered = centeredIndex === index;

                    return (
                        <div
                            key={index}
                            className={`min-w-[90vw] md:min-w-[45vw] lg:min-w-[calc(33.333%-22px)] snap-center transition-all duration-500 ease-out flex items-center justify-center ${isCentered ? 'scale-100 lg:scale-110 z-10' : 'scale-100 z-0'}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % ALL_TESTIMONIALS.length) * 0.1 }}
                                className={`w-full bg-[#2B2342] rounded-[40px] p-10 flex flex-col h-full border transition-all duration-300 ${isCentered ? 'border-primary/40 shadow-2xl shadow-primary/5' : 'border-white/5'}`}
                            >
                                <div className="mb-8">
                                    <Quote className={`w-12 h-12 rotate-180 transition-colors duration-300 ${isCentered ? 'text-primary' : 'text-primary/60'}`} />
                                </div>

                                <blockquote className="text-xl md:text-2xl font-medium text-white mb-10 leading-relaxed grow">
                                    "{testimonial.quote}"
                                </blockquote>

                                <div className="pt-8 border-t border-white/10 flex flex-col gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-white font-bold text-lg leading-tight">{testimonial.name}</h3>
                                            <p className="text-white/60 text-sm">{testimonial.role}, {testimonial.company}</p>
                                        </div>
                                    </div>

                                    <p className="text-white/50 text-sm italic">
                                        {testimonial.tagline}
                                    </p>

                                    <button className={`self-start px-6 py-2 rounded-xl text-white font-semibold text-sm transition-all ${isCentered ? 'bg-primary' : 'bg-primary/80 hover:bg-primary'}`}>
                                        Read More
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
