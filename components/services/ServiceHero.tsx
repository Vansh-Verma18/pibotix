"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceHeroProps {
    title: string;
    description: string;
    heroColor?: string;
}

const ServiceHero = ({ title, description, heroColor = "from-secondary/20" }: ServiceHeroProps) => {
    return (
        <div className="w-full h-full max-md:px-2 mb-10">
            <div className={`w-full h-auto min-h-[70vh] md:h-[80vh] flex justify-center rounded-4xl overflow-hidden items-center flex-col relative bg-linear-to-b ${heroColor} to-transparent`}>
                <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                <div className="w-full md:w-5/6 py-12 h-full flex flex-col justify-center items-center relative z-10">
                    <h1
                        className="text-[40px] max-md:leading-[48px] md:text-6xl lg:text-8xl text-center font-bold capitalize"
                        dangerouslySetInnerHTML={{
                            __html: title.replace(
                                /((?:^|\s)\S+$)/,
                                ' <span class="text-primary">$1</span>'
                            ),
                        }}
                    ></h1>
                    <div className=" md:text-2xl mx-4 md:mx-14 mt-4 text-center font-normal text-gray-300">
                        {description}
                    </div>

                    <div className="w-full flex justify-center mt-10 px-5">
                        <Link
                            href="/contact"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary/90 rounded-xl text-white font-semibold text-lg transition-all duration-300"
                        >
                            Start Your Project
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceHero;
