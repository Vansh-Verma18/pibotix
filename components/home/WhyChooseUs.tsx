"use client";
import { Code2, Zap, Users, Award } from 'lucide-react';

const WhyChooseUs = () => {
    return (
        <div
            id="whychooseus"
            className="w-full px-4 mt-14 md:mt-16 relative h-full pb-10"
        >
            <div className="w-full mb-8 flex flex-col justify-between">
                <h2 className="text-4xl md:text-6xl font-bold text-white font-sans mb-4">
                    Why <span className='text-primary'>Choose Vortexio</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl">
                    Transforming ideas into powerful digital solutions with cutting-edge technology
                </p>
            </div>

            <div className='hidden md:grid mt-10 w-full grid-cols-3 gap-6 lg:gap-10 auto-rows-[280px]'>
                <div className="relative bg-blue-200/20 rounded-2xl p-6 lg:p-8 overflow-hidden">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Expert Team</h3>
                    <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
                        Our skilled developers and designers bring years of experience in building high-quality websites, mobile apps, and blockchain solutions for businesses worldwide.
                    </p>
                </div>

                <div className="relative bg-blue-200/20 rounded-2xl p-6 lg:p-8 overflow-hidden">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Fast Delivery</h3>
                    <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
                        We follow agile methodologies to deliver your projects quickly without compromising quality, ensuring rapid deployment and continuous improvement.
                    </p>
                </div>

                <div className="relative bg-[#0B4A6F] rounded-2xl p-6 lg:p-8 overflow-hidden row-span-2">
                    <div className="h-full flex flex-col">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/30 flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Client-Focused Approach</h3>
                        <p className="text-sm lg:text-base text-white/90 leading-relaxed mb-4">
                            We understand that every business is unique. That&apos;s why we work closely with you to understand your vision and deliver custom solutions tailored to your specific needs.
                        </p>
                        <p className="text-sm lg:text-base text-white/90 leading-relaxed mb-4">
                            Our collaborative approach means you&apos;re involved at every stage of development. We provide regular updates, incorporate your feedback, and ensure the final product exceeds your expectations.
                        </p>
                        <p className="text-sm lg:text-base text-white/90 leading-relaxed">
                            Whether you&apos;re a startup or an enterprise, we adapt our process to fit your timeline, budget, and business goals.
                        </p>
                    </div>
                </div>

                <div className="relative bg-blue-200/20 rounded-2xl p-6 lg:p-8 overflow-hidden col-span-2">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                        <Code2 className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Proven Solutions</h3>
                    <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
                        We&apos;ve successfully delivered 100+ projects including responsive websites, cross-platform mobile apps, blockchain solutions, and enterprise systems. Our expertise spans React, Next.js, React Native, Flutter, Web3, and modern cloud technologies to build scalable solutions that drive business growth.
                    </p>
                </div>
            </div>

            <div className='md:hidden mt-10 w-full space-y-6'>
                <div className="relative bg-blue-200/20 rounded-2xl p-6 overflow-hidden">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Expert Team</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Our skilled developers and designers bring years of experience in building high-quality websites, mobile apps, and blockchain solutions for businesses worldwide.
                    </p>
                </div>

                {/* Card 2 - Fast Delivery */}
                <div className="relative bg-blue-200/20 rounded-2xl p-6 overflow-hidden">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        We follow agile methodologies to deliver your projects quickly without compromising quality, ensuring rapid deployment and continuous improvement.
                    </p>
                </div>

                {/* Card 3 - Proven Solutions */}
                <div className="relative bg-blue-200/20 rounded-2xl p-6 overflow-hidden">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
                        <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Proven Solutions</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        We&apos;ve successfully delivered 100+ projects including responsive websites, cross-platform mobile apps, blockchain solutions, and enterprise systems. Our expertise spans React, Next.js, React Native, Flutter, Web3, and modern cloud technologies to build scalable solutions that drive business growth.
                    </p>
                </div>

                <div className="relative bg-[#0B4A6F] rounded-2xl p-8 overflow-hidden">
                    <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center mb-4">
                        <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Client-Focused Approach</h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-4">
                        We understand that every business is unique. That&apos;s why we work closely with you to understand your vision and deliver custom solutions tailored to your specific needs.
                    </p>
                    <p className="text-sm text-white/90 leading-relaxed mb-4">
                        Our collaborative approach means you&apos;re involved at every stage of development. We provide regular updates, incorporate your feedback, and ensure the final product exceeds your expectations.
                    </p>
                    <p className="text-sm text-white/90 leading-relaxed">
                        Whether you&apos;re a startup or an enterprise, we adapt our process to fit your timeline, budget, and business goals.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default WhyChooseUs
