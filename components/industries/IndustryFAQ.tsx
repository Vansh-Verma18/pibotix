"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do you design automation systems from scratch or integrate existing equipment?",
    answer: "We do both. We can design and build custom turn-key automation cells from the ground up, or we can integrate new robotics, vision systems, and PLCs into your existing legacy production lines to modernize them and increase throughput."
  },
  {
    question: "How do you ensure compliance in highly regulated industries like Pharmaceuticals or Food & Beverage?",
    answer: "Our engineering team is deeply familiar with industry-specific standards. For pharma, we ensure strict adherence to FDA 21 CFR Part 11 and cGMP, including full validation documentation (IQ/OQ/PQ). For Food & Beverage, we utilize washdown-rated robotics and FDA-approved food-grade materials to eliminate contamination risks."
  },
  {
    question: "What is the typical ROI timeframe for a robotic integration project?",
    answer: "While it varies by industry and project scope, most of our clients see a full Return on Investment (ROI) within 12 to 24 months. This is driven by reduced labor costs, dramatic drops in defect rates, and significantly higher continuous throughput."
  },
  {
    question: "How do you handle rapid SKU changes in packaging and logistics?",
    answer: "We specialize in flexible automation. We design systems utilizing servo-driven mechanisms and recipe-based PLC programming, allowing your operators to switch between SKUs in minutes rather than hours, often with zero manual mechanical adjustments required."
  },
  {
    question: "Do you provide ongoing support and maintenance after installation?",
    answer: "Yes. We offer comprehensive Service Level Agreements (SLAs) that include 24/7 remote support, predictive maintenance monitoring using IoT sensors, and regular on-site preventative maintenance to ensure your automation runs at peak efficiency."
  }
];

export default function IndustryFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">
              Common questions about implementing our industrial automation solutions across various sectors.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-card border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    openIndex === index ? "border-primary bg-primary/10 text-primary" : "border-white/20 text-gray-400"
                  }`}>
                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
