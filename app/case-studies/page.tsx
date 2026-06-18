"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowUpRight, ChevronRight, Calculator } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { caseStudiesData } from "@/data/caseStudiesData";

const categories = ["All", ...Array.from(new Set(caseStudiesData.map(cs => cs.category)))];
const industries = ["All", ...Array.from(new Set(caseStudiesData.map(cs => cs.clientIndustry)))];

export default function CaseStudiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const filteredData = useMemo(() => {
    return caseStudiesData.filter((cs) => {
      const matchesSearch = cs.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            cs.technologiesUsed.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || cs.category === selectedCategory;
      const matchesIndustry = selectedIndustry === "All" || cs.clientIndustry === selectedIndustry;
      return matchesSearch && matchesCategory && matchesIndustry;
    });
  }, [searchQuery, selectedCategory, selectedIndustry]);

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">Proven Success</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Enterprise Case Studies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            Explore how we've engineered transformative automation solutions for industry leaders, delivering measurable ROI and unprecedented throughput.
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="container mx-auto px-6 mb-16">
        <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between z-20 relative">
          
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by keyword or technology..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-gray-400 hidden sm:block" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full sm:w-auto bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>
          
        </div>
      </section>

      {/* Results Grid */}
      <section className="container mx-auto px-6 mb-24">
        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-400 font-medium">Showing {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredData.map((cs) => (
              <motion.div
                key={cs.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-card border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors flex flex-col h-full"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
                  <Image 
                    src={cs.image} 
                    alt={cs.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                      {cs.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow relative z-20 -mt-10">
                  <div className="mb-4">
                    <span className="text-gray-400 text-sm font-semibold">{cs.clientIndustry}</span>
                    <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {cs.title}
                    </h3>
                  </div>

                  <p className="text-gray-400 line-clamp-3 mb-6 flex-grow">
                    {cs.problemStatement}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                      <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">ROI</span>
                      <span className="text-green-400 font-bold">{cs.costReduction.split(" ")[0]}</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                      <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Productivity</span>
                      <span className="text-blue-400 font-bold">+{cs.productivityIncrease}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/case-studies/${cs.slug}`}
                    className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary text-white font-semibold transition-all"
                  >
                    Read Full Case Study
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredData.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              No case studies found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </div>
      </section>

      {/* ROI Calculator Teaser */}
      <section className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
            <Calculator className="w-64 h-64" />
          </div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Calculate Your Automation ROI</h2>
            <p className="text-gray-400 text-lg mb-8">
              Wondering how quickly an automation solution pays for itself in your specific facility? Use our interactive ROI calculator to estimate savings on labor, scrap, and throughput.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Get Custom ROI Estimate <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
