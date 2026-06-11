"use client";

// Simple ticker or grid for tech stack
// In a real app we might grab icons from a library or asset folder
import { Code2, Database, Globe, Smartphone, Cloud, Cpu } from "lucide-react";

const technologies = [
    { name: "Node.js", icon: Code2 },
    { name: "React", icon: Globe },
    { name: "Next.js", icon: Globe },
    { name: "React Native", icon: Smartphone },
    { name: "AWS", icon: Cloud },
    { name: "Python", icon: Code2 },
    { name: "Blockchain", icon: Database },
    { name: "AI/ML", icon: Cpu }
];

export default function ServiceTechStack() {
    return (
        <section className="py-20 border-t border-white/5">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Powered by Modern Technology</h2>
                <p className="text-gray-400">We use the latest tools and frameworks to build future-proof solutions.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4">
                {technologies.map((tech, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-3 px-8 py-6 bg-white/5 border border-white/10 rounded-2xl min-w-[140px] hover:bg-white/10 transition-colors duration-300"
                    >
                        <tech.icon className="w-8 h-8 text-gray-300" />
                        <span className="text-gray-200 font-semibold">{tech.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
