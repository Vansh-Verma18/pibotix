import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Cpu, Settings, Target, ArrowRight } from "lucide-react";
import { caseStudiesData } from "@/data/caseStudiesData";

export async function generateStaticParams() {
  return caseStudiesData.map((cs) => ({
    slug: cs.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const caseStudy = caseStudiesData.find((cs) => cs.slug === params.slug);
  if (!caseStudy) return { title: "Case Study Not Found" };
  
  return {
    title: `${caseStudy.title} | Pibotix Case Studies`,
    description: caseStudy.problemStatement,
  };
}

export default function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const caseStudy = caseStudiesData.find((cs) => cs.slug === params.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/case-studies" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
        </div>

        {/* Header Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-full text-sm font-bold tracking-wider uppercase">
                {caseStudy.category}
              </span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full text-sm font-bold tracking-wider uppercase">
                {caseStudy.clientIndustry}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {caseStudy.title}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              {caseStudy.problemStatement}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-card border border-white/10 px-6 py-4 rounded-2xl flex-1 min-w-[200px]">
                <span className="block text-gray-500 text-sm uppercase tracking-wider mb-2">Cost Reduction</span>
                <span className="text-3xl font-bold text-green-400">{caseStudy.costReduction}</span>
              </div>
              <div className="bg-card border border-white/10 px-6 py-4 rounded-2xl flex-1 min-w-[200px]">
                <span className="block text-gray-500 text-sm uppercase tracking-wider mb-2">Productivity</span>
                <span className="text-3xl font-bold text-red-400">+{caseStudy.productivityIncrease}</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/10">
            <Image 
              src={caseStudy.image} 
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" /> The Challenge
              </h2>
              <div className="bg-card border border-white/10 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-4">Existing Process</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {caseStudy.existingProcess}
                </p>
                <h3 className="text-xl font-bold text-white mb-4">Key Pain Points</h3>
                <ul className="space-y-4">
                  {caseStudy.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" /> Proposed Solution
              </h2>
              <div className="bg-card border border-white/10 p-8 rounded-3xl">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {caseStudy.proposedSolution}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Cpu className="w-8 h-8 text-primary" /> Visual Process Flow
              </h2>
              <div className="space-y-6">
                {caseStudy.processFlow.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-lg">
                        {idx + 1}
                      </div>
                      {idx !== caseStudy.processFlow.length - 1 && (
                        <div className="w-0.5 h-full bg-white/10 my-2" />
                      )}
                    </div>
                    <div className="bg-card border border-white/10 p-6 rounded-2xl flex-grow pb-8">
                      <h4 className="text-xl font-bold text-white mb-2">{step.step}</h4>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (Sidebar metrics) */}
          <div className="lg:col-span-1 space-y-8">
            
            <div className="bg-card border border-white/10 p-8 rounded-3xl sticky top-32">
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Project Overview</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <span className="block text-gray-500 text-sm uppercase tracking-wider mb-2">Implementation Time</span>
                  <span className="text-white font-semibold text-lg">{caseStudy.implementationTimeline}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm uppercase tracking-wider mb-2">Technologies Used</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {caseStudy.technologiesUsed.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 p-6 rounded-2xl mb-8">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> ROI Calculation
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {caseStudy.roiCalculation}
                </p>
              </div>

              <h4 className="text-xl font-bold text-white mb-6">Impact Metrics</h4>
              
              <div className="space-y-6">
                {caseStudy.beforeMetrics.map((before, idx) => {
                  const after = caseStudy.afterMetrics[idx];
                  return (
                    <div key={idx} className="relative">
                      <span className="block text-gray-400 text-sm mb-2">{before.label}</span>
                      <div className="flex items-center justify-between bg-background border border-white/5 rounded-xl p-3">
                        <div className="text-gray-500 font-medium line-through">{before.value}</div>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <div className="text-white font-bold">{after.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-br from-card to-background border border-white/10 rounded-3xl p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
           <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Facing Similar Challenges?</h2>
             <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
               Let our engineering team analyze your specific use case. We can provide a feasibility study and an accurate ROI projection.
             </p>
             <Link 
               href="/contact"
               className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
             >
               Discuss Your Project <ArrowRight className="w-5 h-5" />
             </Link>
           </div>
        </div>

      </div>
    </main>
  );
}
