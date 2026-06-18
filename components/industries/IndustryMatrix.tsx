"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { industriesData } from "@/data/industriesData";

const technologies = [
  "Industrial Robotics",
  "Machine Vision & AI",
  "SCADA & MES",
  "Automated Guided Vehicles (AGV/AMR)",
  "PLC Programming",
  "Predictive Maintenance",
  "Digital Twins"
];

// Mapping matrix
const matrixData: Record<string, boolean[]> = {
  "automotive": [true, true, true, true, true, true, true],
  "electronics": [true, true, true, false, true, true, true],
  "pharmaceutical": [true, true, true, true, true, false, true],
  "food-beverage": [true, true, true, true, true, false, false],
  "warehousing": [false, true, true, true, true, true, true],
  "packaging": [true, true, true, false, true, true, false],
  "textile": [false, true, true, true, true, true, false],
  "heavy-engineering": [true, false, true, true, true, true, true],
  "chemical": [false, false, true, false, true, true, true],
  "renewable": [true, true, true, true, true, true, true],
};

export default function IndustryMatrix() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Automation Technology Matrix</h2>
          <p className="text-gray-400 text-lg">
            A high-level view of how our core capabilities map across different industrial sectors. We tailor our technology stack to meet the specific demands of your industry.
          </p>
        </div>

        <div className="overflow-x-auto pb-8 custom-scrollbar">
          <div className="min-w-[1000px] border border-white/10 rounded-2xl overflow-hidden bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-white font-bold w-1/4">Industry</th>
                  {technologies.map((tech, i) => (
                    <th key={i} className="p-4 text-sm font-semibold text-gray-300 text-center w-[10%] align-bottom">
                      <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap translate-x-4 translate-y-2">
                        {tech}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {industriesData.map((industry, index) => (
                  <motion.tr 
                    key={industry.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6 flex items-center gap-3">
                      <industry.icon className="w-5 h-5 text-primary" />
                      <span className="text-white font-medium">{industry.name}</span>
                    </td>
                    {matrixData[industry.id]?.map((hasTech, i) => (
                      <td key={i} className="p-4 text-center border-l border-white/5">
                        {hasTech ? (
                          <div className="inline-flex w-8 h-8 rounded-full bg-green-500/10 items-center justify-center">
                            <Check className="w-4 h-4 text-green-400" />
                          </div>
                        ) : (
                          <div className="inline-flex w-8 h-8 rounded-full items-center justify-center opacity-30">
                            <Minus className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
