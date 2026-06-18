import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
    title: string;
    description: string;
    buttonText: string;
}

export default function CTASection({
    buttonText,
}: CTASectionProps) {
    return (
        <section className="w-full md:py-16 py-12 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="relative rounded-[40px] overflow-hidden bg-linear-to-br from-secondary via-[#0a9396] to-secondary border border-white/10 p-8 md:p-16 text-center shadow-2xl">
                    {/* Background decorative elements - Improved for more vibrancy */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 text-white leading-tight tracking-tight">
                            Ready to Transform Your <br />
                            <span className="text-white drop-shadow-md">Digital Presence?</span>
                        </h2>
                        <p className="text-white/90 text-lg md:text-2xl mb-10 leading-relaxed max-w-2xl font-medium">
                            Let&apos;s collaborate to build something extraordinary. Whether you need a new website or a complex web application, we are here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-secondary hover:bg-gray-50 font-black rounded-2xl transition-all duration-300 text-lg md:text-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-2 active:scale-95"
                            >
                                {buttonText}
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
