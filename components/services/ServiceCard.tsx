import CustomImage from "../ui/CustomImage";


interface ServiceCardProps {
    service: {
        category: string;
        title: string;
        src: string;
        description?: string;
        shortDescription?: string;
        color: string;
        isFeatured?: boolean;
        slug?: string;
    };
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const description = service.description || service.shortDescription;

    return (
        <div className="relative bg-linear-to-br from-white/5 to-white/0 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative h-64 overflow-hidden bg-[#0e1b21]">
                <CustomImage
                    src={service.src}
                    alt={service.title}
                    title={service.title}
                    priority={false}
                    preload={false}
                    loading="lazy"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 p-4"
                />

                <div className="absolute top-4 left-4">
                    <span
                        className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
                        style={{
                            backgroundColor: `${service.color}20`,
                            color: service.color,
                        }}
                    >
                        {service.category}
                    </span>
                </div>

            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                    {description}
                </p>
            </div>
        </div >
    );
}
