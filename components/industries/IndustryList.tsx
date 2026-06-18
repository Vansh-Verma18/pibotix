"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { industriesData } from "@/data/industriesData";
import { TrendingUp, ChevronRight, Activity, Cpu } from "lucide-react";
import Link from "next/link";

export default function IndustryList() {
  const [activeId, setActiveId] = useState(industriesData[0].id);

  const activeIndustry = industriesData.find((i) => i.id === activeId) || industriesData[0];
  const ActiveIcon = activeIndustry.icon;

  return (
    <section id="industries" className="py-24 bg-background/50 relative border-t border-white/5">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="sticky top-32">
              <h2 className="text-3xl font-bold text-white mb-8">Select Industry</h2>
              <div className="flex flex-col gap-2">
                {industriesData.map((industry) => {
                  const Icon = industry.icon;
                  const isActive = industry.id === activeId;
                  return (
                    <button
                      key={industry.id}
                      onClick={() => setActiveId(industry.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                        isActive 
                        ? "bg-primary/20 border-primary/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      } border`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-white/10"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-lg">{industry.name}</span>
                      {isActive && (
                        <motion.div layoutId="activeIndicator" className="ml-auto">
                          <ChevronRight className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-white/10 rounded-3xl p-8 lg:p-12"
              >
                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ActiveIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">{activeIndustry.name}</h3>
                    <p className="text-primary font-medium flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" /> Expected Improvement: {activeIndustry.estimatedImprovement}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-10">
                  {activeIndustry.overview}
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* Problems */}
                  <div className="bg-background/50 rounded-2xl p-6 border border-red-500/10">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-400" /> Industry Challenges
                    </h4>
                    <ul className="space-y-3">
                      {activeIndustry.commonProblems.map((prob, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-background/50 rounded-2xl p-6 border border-green-500/10">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-green-400" /> Automation Opportunities
                    </h4>
                    <ul className="space-y-3">
                      {activeIndustry.automationOpportunities.map((opp, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Solutions & Tech */}
                <div className="mb-10">
                  <h4 className="text-xl font-bold text-white mb-6">Recommended Solutions</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {activeIndustry.recommendedSolutions.map((sol, i) => (
                      <div key={i} className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                        <span className="text-gray-200 font-medium">{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Case Study Snippet */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ActiveIcon className="w-32 h-32" />
                  </div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Featured Case Study</h4>
                  <h5 className="text-2xl font-bold text-white mb-4">{activeIndustry.caseStudy.title}</h5>
                  <p className="text-gray-400 mb-6 relative z-10">{activeIndustry.caseStudy.description}</p>
                  <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg font-semibold">
                    <TrendingUp className="w-4 h-4" /> {activeIndustry.caseStudy.metric}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                  <span className="text-sm font-semibold text-gray-500 mr-2">Core Tech:</span>
                  {activeIndustry.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <p className="text-gray-400 text-sm">Ready to transform your {activeIndustry.name.toLowerCase()} operations?</p>
                  <Link 
                    href="/contact"
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    Consult an Expert <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
