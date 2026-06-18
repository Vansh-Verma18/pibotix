"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, X, ArrowUpRight, Clock, Building, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projectsData, ProjectCategory, Project } from "@/data/projectsData";

const categories: ("All" | ProjectCategory)[] = ["All", "Completed", "Ongoing", "Prototype", "Research"];

export default function ProjectsPortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold tracking-wider uppercase">Innovation Portfolio</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          Featured Projects
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto"
        >
          From cutting-edge prototypes to globally deployed enterprise solutions, explore our track record of industrial transformation.
        </motion.p>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                  ? "bg-primary text-white" 
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search technologies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="container mx-auto px-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No projects match your current filters.
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid relative group bg-card border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="relative h-64 w-full">
                    <Image 
                      src={project.images[0]} 
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                        {project.category}
                      </span>
                    </div>

                    <button 
                      onClick={() => setQuickViewProject(project)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                      title="Quick View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <span className="text-primary text-sm font-semibold mb-2 block">{project.industry}</span>
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{project.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <Link 
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-white font-semibold hover:text-primary transition-colors text-sm"
                    >
                      View Project <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-card border border-white/10 rounded-3xl z-50 overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <div className="relative w-full h-48 md:h-auto md:w-1/2">
                <Image 
                  src={quickViewProject.images[0]} 
                  alt={quickViewProject.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[80vh]">
                <button 
                  onClick={() => setQuickViewProject(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 p-2 rounded-full backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block">
                  {quickViewProject.category}
                </span>
                
                <h3 className="text-2xl font-bold text-white mb-4">{quickViewProject.title}</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building className="w-4 h-4 text-primary" /> {quickViewProject.industry}
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-4 h-4 text-primary" /> {quickViewProject.duration}
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Zap className="w-4 h-4 text-primary" /> {quickViewProject.roi}
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed mb-6">
                  {quickViewProject.overview}
                </p>

                <div className="mb-8">
                  <span className="block text-white font-semibold mb-3">Core Technologies</span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProject.techStack.map((tech, i) => (
                      <span key={i} className="text-xs text-gray-300 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link 
                    href={`/projects/${quickViewProject.slug}`}
                    className="flex-1 bg-primary text-white text-center py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Read Full Case Study
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
