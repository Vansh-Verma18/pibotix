"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, CheckCircle, BarChart, Settings, Zap } from "lucide-react";
import { IAssessment } from "@/lib/models/Assessment";

export default function AssessmentResults({ data }: { data: IAssessment }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      // Temporarily adjust styles for better PDF rendering
      element.classList.add("pdf-mode");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a0a", // match dark theme
      });
      
      element.classList.remove("pdf-mode");

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Automation_Report_${data.companyName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Failed to generate PDF report.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-2xl font-bold text-white">Your Assessment Results</h2>
        <button
          onClick={handleDownloadPdf}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Printable Area */}
      <div 
        ref={printRef} 
        className="bg-card border border-white/10 rounded-2xl p-8 shadow-2xl relative"
      >
        <div className="text-center mb-10 border-b border-white/10 pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-2xl mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Automation Readiness Report</h1>
          <p className="text-gray-400">Prepared for <strong className="text-white">{data.companyName}</strong></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#111] p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BarChart className="w-24 h-24 text-white" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Automation Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary">{data.automationScore}</span>
              <span className="text-xl text-gray-500">/ 100</span>
            </div>
            <div className="w-full bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${data.automationScore}%` }}></div>
            </div>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Settings className="w-24 h-24 text-white" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Digital Transformation</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-blue-500">{data.digitalTransformationScore}</span>
              <span className="text-xl text-gray-500">/ 100</span>
            </div>
            <div className="w-full bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${data.digitalTransformationScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Expected Outcomes
            </h3>
            <div className="space-y-4">
              <div className="bg-[#111] p-4 rounded-lg border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Estimated Cost Savings</p>
                <p className="text-2xl font-bold text-green-400">{data.estimatedCostSavings}</p>
              </div>
              <div className="bg-[#111] p-4 rounded-lg border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Expected ROI Timeframe</p>
                <p className="text-2xl font-bold text-white">{data.expectedROI}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Suggested Technologies</h3>
            <ul className="space-y-2">
              {data.suggestedTechnologies.map((tech, i) => (
                <li key={i} className="bg-primary/10 text-primary px-4 py-3 rounded-lg border border-primary/20 font-medium">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recommended Next Steps</h3>
          <div className="flex flex-wrap gap-3">
            {data.recommendedServices.map((service, i) => (
              <span key={i} className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
          Report generated by AutoForge Industrial Solutions. <br />
          Contact our team to discuss your tailored automation strategy.
        </div>
      </div>
    </div>
  );
}
