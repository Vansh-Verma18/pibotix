"use client";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FloatingLines = dynamic(() => import("../ui/FloatingLinesBackground"), {
  ssr: false,
});

const HeroSection = () => {
  return (
    <div className="w-full h-full max-md:px-2">
      <div className="w-full h-auto md:h-[80vh] flex justify-center rounded-4xl overflow-hidden items-center flex-col relative bg-background/50">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[6, 4, 8]}
          animationSpeed={0.5}
          parallaxStrength={0.1}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent pointer-events-none z-1" />
        <div className="w-full md:w-5/6 py-12 md:-mt-24 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-[40px] max-md:leading-[48px] md:text-6xl lg:text-8xl text-center font-bold">
            Speed, Security, Scale That&apos;s{" "}
            <span className="text-primary">Vortexio</span>
          </h1>
          <p className=" md:text-2xl mx-4 md:mx-14 mt-4 text-center font-normal">
            Vortexio Solutions is a product-driven technology studio delivering
            secure, scalable, and{" "}
            <span className="font-bold">high-performance</span> digital
            solutions. From enterprise{" "}
            <span className="font-bold">web platforms</span> to custom mobile
            apps and <span className="font-bold">blockchain systems</span>.
          </p>

          <div className="w-full md:hidden mt-8 px-5">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-secondary hover:bg-primary/90 rounded-xl text-white font-semibold transition-all duration-300"
            >
              Find the Right Solution
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full py-6 md:py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm md:text-base text-gray-400 mb-6 md:mb-8">
            Trusted by hundreds of nontechnical founders to deliver{" "}
            <span className="text-primary font-semibold">
              calm, confident software launches.
            </span>
          </p>

          <div className="hidden md:flex items-center justify-center gap-6">
            <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
              <div className="w-14 h-14 flex items-center justify-center bg-white rounded-full p-2">
                <img
                  src="/icons/google.svg"
                  alt="Google"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-white">
                  Google Reviews
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
              <div className="w-14 h-14 flex items-center justify-center bg-green-600 rounded-full">
                <Star className="w-8 h-8 fill-white text-white" />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-white">Trustpilot</p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer">
              <div className="w-14 h-14 flex items-center justify-center bg-red-600 rounded-full">
                <Star className="w-8 h-8 fill-white text-white" />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-white">
                  Clutch Reviews
                </p>
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-full p-2">
                <Star className="w-7 h-7 fill-white text-white" />
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full p-2">
                <img
                  src="/icons/google.svg"
                  alt="Google"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full p-2">
                <Star className="w-7 h-7 fill-gray-700 text-gray-700" />
              </div>
            </div>

            <div className="border-l h-12 border-white/20"></div>

            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-xs font-semibold text-white whitespace-nowrap">
                200+ five-star reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
