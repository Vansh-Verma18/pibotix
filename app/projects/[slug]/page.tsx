import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Building, Zap, Layers, Download, CheckCircle, Construction, Calendar, ArrowRight } from "lucide-react";
import { projectsData } from "@/data/projectsData";

export async function generateStaticParams() {
  return projectsData.map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) return { title: "Project Not Found" };
  
  return {
    title: `${project.title} | Pibotix Projects`,
    description: project.overview,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = projectsData
    .filter(p => p.id !== project.id && (p.industry === project.industry || p.category === project.category))
    .slice(0, 3);

  return (
    <main className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-full text-sm font-bold tracking-wider uppercase">
              {project.category}
            </span>
            <span className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full text-sm font-bold tracking-wider uppercase flex items-center gap-2">
              <Building className="w-4 h-4" /> {project.industry}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
            {project.title}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
            {project.overview}
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <Layers className="w-6 h-6 text-primary mb-3" />
            <span className="block text-gray-500 text-sm uppercase tracking-wider mb-1">Client Size</span>
            <span className="text-white font-semibold">{project.clientSize}</span>
          </div>
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <Clock className="w-6 h-6 text-primary mb-3" />
            <span className="block text-gray-500 text-sm uppercase tracking-wider mb-1">Duration</span>
            <span className="text-white font-semibold">{project.duration}</span>
          </div>
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            {project.category === "Completed" ? <CheckCircle className="w-6 h-6 text-primary mb-3" /> : <Construction className="w-6 h-6 text-primary mb-3" />}
            <span className="block text-gray-500 text-sm uppercase tracking-wider mb-1">Status</span>
            <span className="text-white font-semibold">{project.status}</span>
          </div>
          <div className="bg-card border border-white/10 p-6 rounded-2xl">
            <Zap className="w-6 h-6 text-primary mb-3" />
            <span className="block text-gray-500 text-sm uppercase tracking-wider mb-1">ROI / Impact</span>
            <span className="text-white font-semibold">{project.roi}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden border border-white/10">
                <Image 
                  src={project.images[0]} 
                  alt={project.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {project.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative h-48 rounded-2xl overflow-hidden border border-white/10">
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Timeline */}
            <section className="bg-card border border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" /> Project Timeline
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {project.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-background group-[.is-active]:bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-6 rounded-2xl group-[.is-active]:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-lg">{event.title}</span>
                        <span className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">{event.date}</span>
                      </div>
                      <p className="text-gray-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            <div className="bg-card border border-white/10 p-8 rounded-3xl sticky top-32">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Technology Stack</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Download the technical specifications and detailed case study PDF for this project.
                </p>
                <a 
                  href={project.documentationUrl}
                  onClick={(e) => e.preventDefault()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold transition-all group"
                >
                  <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Technical Brief (PDF)
                </a>
              </div>
            </div>

          </div>

        </div>
        
        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="border-t border-white/10 pt-16 mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Related Projects</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((rp) => (
                <Link key={rp.id} href={`/projects/${rp.slug}`} className="group block bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="relative h-48 w-full">
                    <Image src={rp.images[0]} alt={rp.title} fill sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="text-primary text-xs font-semibold uppercase tracking-wider mb-2 block">{rp.category}</span>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-4 font-semibold group-hover:text-white transition-colors">
                      View Project <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
