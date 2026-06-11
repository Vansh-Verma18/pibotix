import CustomImage from "@/components/ui/CustomImage";
import { categories } from "@/data/data";
import generatePageMetadata from "@/utils/generateMetadata";

export const metadata = generatePageMetadata("techstack");

export default function TechStack() {
  return (
    <main className="w-full md:container md:mx-auto  px-4 md:px-8 lg:px-10">
      <h2 className="text-4xl md:text-[56px] lg:text-[76px] leading-tight font-black text-center my-10 md:my-14 text-white">
        <span className="md:hidden">OUR</span> TECH <span className="text-primary">STACK</span> <span className="max-md:hidden">OVERVIEW</span>
      </h2>

      {categories.map((category: { title: string; tools: { name: string; description: string; icon: string; iconTitle?: string }[] }, idx: number) => (
        <div key={idx} className="mb-16">
          <h3 className="text-center text-gray-400 tracking-[0.6rem] text-xl font-medium mb-10 uppercase">
            {category.title}
          </h3>

          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center mx-auto gap-4 md:gap-6">
            {category.tools.map((tool: { name: string; description: string; icon: string; iconTitle?: string }, i: number) => (
              <div
                key={i}
                className="relative w-full md:w-[18rem] rounded-3xl p-4 md:p-6 flex flex-col justify-between transition-all duration-300 hover:scale-105 group bg-white/5 backdrop-blur-xl border border-primary/30 hover:border-primary shadow-lg hover:shadow-md"
              >
                <div className="relative z-10">
                  <div className="mb-3 p-2 md:p-3 rounded-2xl w-fit bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-primary/50 transition-colors duration-300">
                    <CustomImage
                      src={tool.icon}
                      alt={tool.name}
                      title={tool.iconTitle || `Vortexio Solutions - ${tool.name}`}
                      width={60}
                      height={60}
                      className="object-contain w-12 h-12 md:w-16 md:h-16"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-base md:text-lg text-white">
                      {tool.name}
                    </h4>
                    <p className="hidden md:block text-sm text-gray-300">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}