import generatePageMetadata from "@/utils/generateMetadata";
import ContactSection from "@/components/home/ContactSection";
import { Rocket, Target, Shield, Users, Star, Globe, ShieldCheck, Zap } from "lucide-react";

export const metadata = generatePageMetadata("our-story");

export default function OurStoryPage() {
    return (
        <main className="w-full md:container md:mx-auto pb-10">
            <div className="w-full h-full max-md:px-2">
                <div
                    className="w-full h-auto md:h-[80vh] flex justify-center rounded-4xl overflow-hidden items-center flex-col relative"
                    style={{
                        backgroundImage: "url('/herosection/hero-bg.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                    <div className="w-full md:w-5/6 py-12 md:-mt-24 h-full flex flex-col justify-center items-center relative z-10">
                        <h1 className="text-[40px] max-md:leading-[48px] md:text-6xl lg:text-8xl text-center font-bold">
                            Pioneering Digital <span className="text-secondary">Excellence</span>
                        </h1>
                        <div className="md:text-2xl mx-4 md:mx-14 mt-4 text-center font-normal">
                            Vortexio Solutions was born out of a simple yet powerful idea: that every founder, regardless of their technical background, deserves a world-class technology partner.
                        </div>
                    </div>
                </div>

                <div className="w-full py-6 md:py-8 border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-4">
                        <p className="text-center text-sm md:text-base text-gray-400 mb-6 md:mb-8">
                            Empowering founders with <span className="text-primary font-semibold">engineered solutions</span> and calm, confident software launches.
                        </p>

                        <div className="hidden md:flex items-center justify-center gap-6">
                            <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
                                <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                    <Globe className="w-7 h-7 text-primary" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">Global Reach</p>
                                    <p className="text-xs text-gray-400">20+ Countries Served</p>
                                </div>
                            </div>

                            <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
                                <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                    <ShieldCheck className="w-7 h-7 text-secondary" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">Technical Trust</p>
                                    <p className="text-xs text-gray-400">99% Client Retention</p>
                                </div>
                            </div>

                            <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
                                <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                    <Zap className="w-7 h-7 text-primary" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">High Velocity</p>
                                    <p className="text-xs text-gray-400">2x Faster Deployment</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:hidden flex items-center justify-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                    <ShieldCheck className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                            </div>

                            <div className="border-l h-12 border-white/20"></div>

                            <div className="flex flex-col items-start gap-1">
                                <p className="text-sm font-bold text-white">Agency Milestones</p>
                                <p className="text-xs text-gray-400 whitespace-nowrap">Global Impact & Trust</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 pt-10 max-md:px-2">

                {/* The Vision Section */}
                <section className="py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            More Than Just <br />
                            <span className="text-secondary">Code.</span>
                        </h2>
                        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                            <p>
                                At Vortexio, we don't just write code; we build engineered solutions that drive real business success. Our journey started in a small studio with a big mission: to bridge the gap between complex technology and intuitive user experiences.
                            </p>
                            <p>
                                Today, we are a global team of designers, engineers, and product strategists dedicated to delivering high-performance digital products for founders and enterprises alike.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-video bg-linear-to-br from-primary/20 to-secondary/10 rounded-[40px] border border-white/5 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/herosection/hero-bg.png')] bg-cover opacity-20" />
                        <Rocket className="w-32 h-32 text-primary" />
                    </div>
                </section>

                {/* Values Grid */}
                <section className="py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-6xl font-bold text-white mb-4">Our Core Values</h2>
                        <p className="text-gray-400 text-xl">The principles that guide every line of code we write.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                            <Target className="w-12 h-12 text-primary mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Precision First</h3>
                            <p className="text-gray-400 leading-relaxed">We believe in getting it right the first time. Our engineered approach ensures stability and performance at any scale.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                            <Users className="w-12 h-12 text-secondary mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Human Focused</h3>
                            <p className="text-gray-400 leading-relaxed">Technology is only as powerful as the problems it solves for people. We design with the end-user in mind, always.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                            <Shield className="w-12 h-12 text-primary mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Radical Trust</h3>
                            <p className="text-gray-400 leading-relaxed">We act as your technical co-founders. Transparency, integrity, and calm communication are at the heart of our partnerships.</p>
                        </div>
                    </div>
                </section>

                {/* Milestone Section */}
                <section className="py-24 text-center bg-linear-to-b from-primary/5 to-transparent rounded-[60px] border border-white/5 px-4">
                    <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-8">200+ Products Launched.</h2>
                    <p className="text-xl md:text-3xl text-gray-400 font-light max-w-4xl mx-auto mb-12">
                        From seed-stage startups to enterprise digital transformations, we've delivered calm, confident launches that stand the test of time.
                    </p>
                    <div className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl">
                        Join Our Journey
                    </div>
                </section>
            </div>

            <div className="mt-32">
                <ContactSection />
            </div>
        </main>
    );
}
