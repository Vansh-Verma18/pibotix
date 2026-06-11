"use client";

const stats = [
    { value: "100+", label: "Projects Delivered" },
    { value: "50+", label: "Happy Clients" },
    { value: "98%", label: "Retention Rate" },
    { value: "24/7", label: "Support & Maintenance" },
];

export default function ServiceStats() {
    return (
        <div className="w-full py-12 border-y border-white/5 bg-white/2 backdrop-blur-sm -mt-10 mb-20 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-7xl mx-auto px-4">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center justify-center text-center">
                        <span className="text-3xl md:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                            {stat.value}
                        </span>
                        <span className="text-sm md:text-base text-gray-400 font-medium tracking-wide uppercase">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
