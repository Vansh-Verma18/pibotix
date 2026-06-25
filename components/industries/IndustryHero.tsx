"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function IndustryHero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Background Video/Image Concept */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background z-10" />
        <Image
          src="/Service4.webp"
          alt="Industrial Automation Across Sectors"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          priority
        />
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-10" />
      </div>

      <div className="container relative z-20 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">Domain Expertise</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-600">Excellence</span> Across Industries
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto"
          >
            We don&apos;t just build machines; we solve industry-specific challenges. Discover how our specialized automation solutions drive productivity, quality, and scale in your sector.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <a href="#industries" className="flex items-center gap-3 text-white hover:text-primary transition-colors">
              <span className="text-sm font-semibold tracking-wider uppercase">Explore Industries</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                <ArrowDown className="w-4 h-4" />
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
