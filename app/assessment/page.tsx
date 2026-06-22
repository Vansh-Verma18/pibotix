"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AssessmentResults from "@/components/assessment/AssessmentResults";
import { IAssessment } from "@/lib/models/Assessment";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "select";
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
};

type QuestionStep = {
  id: string;
  title: string;
  fields: Field[];
};

const QUESTIONS: QuestionStep[] = [
  {
    id: "contact",
    title: "Basic Information",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Work Email", type: "email", required: true },
      { name: "companyName", label: "Company Name", type: "text", required: true },
    ],
  },
  {
    id: "company",
    title: "Company Details",
    fields: [
      { 
        name: "companySize", 
        label: "Company Size", 
        type: "select", 
        options: ["1-50", "50-100", "100-500", "500+"],
        required: true 
      },
      { 
        name: "productionCapacity", 
        label: "Production Capacity / Volume", 
        type: "select", 
        options: ["Low Mix, High Volume", "High Mix, Low Volume", "Custom/One-offs", "Continuous Process"],
        required: true 
      },
    ],
  },
  {
    id: "operations",
    title: "Operations & Processes",
    fields: [
      { 
        name: "currentProcesses", 
        label: "Primary Production Process", 
        type: "select", 
        options: ["Assembly", "Machining", "Packaging", "Material Handling", "Other"],
        required: true 
      },
      { 
        name: "manualWorkPercentage", 
        label: "Estimated Percentage of Manual Work (%)", 
        type: "number", 
        min: 0,
        max: 100,
        required: true 
      },
    ],
  },
  {
    id: "tech",
    title: "Technology & Investment",
    fields: [
      { 
        name: "existingSoftware", 
        label: "Existing Software Systems", 
        type: "select", 
        options: ["None", "Basic Spreadsheets", "Standalone ERP/MRP", "Fully Integrated ERP & MES"],
        required: true 
      },
      { 
        name: "automationBudget", 
        label: "Expected Automation Budget", 
        type: "select", 
        options: ["< $50k", "$50k - $100k", "$100k - $500k", "$500k+"],
        required: true 
      },
    ],
  }
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "", email: "", companyName: "", companySize: "1-50", employeeCount: "1-50", // default map for employeeCount
    productionCapacity: "Low Mix, High Volume", currentProcesses: "Assembly", 
    manualWorkPercentage: 50, existingSoftware: "Basic Spreadsheets", automationBudget: "$50k - $100k"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<IAssessment | null>(null);

  const handleNext = () => {
    // Sync employee count with company size for simplicity
    if (currentStep === 1) {
      setFormData(prev => ({...prev, employeeCount: prev.companySize}));
    }
    if (currentStep < QUESTIONS.length - 1) setCurrentStep(prev => prev + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== QUESTIONS.length - 1) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.assessment);
      } else {
        alert("Failed to submit assessment.");
      }
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-6">
        <AssessmentResults data={results} />
      </div>
    );
  }

  const stepData = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-12 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Automation Readiness <span className="text-primary">Assessment</span></h1>
          <p className="text-xl text-gray-400">Discover your potential for digital transformation and cost savings.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium text-gray-400">
            <span>Step {currentStep + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-primary h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Container */}
        <motion.div 
          className="bg-card/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">
              {currentStep + 1}
            </span>
            {stepData.title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {stepData.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label} {field.required && <span className="text-primary">*</span>}
                </label>
                
                {field.type === "select" ? (
                  <select
                    required={field.required}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    {field.options?.map(opt => (
                      <option key={opt} value={opt} className="bg-[#111]">{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4 pt-4 mt-8 border-t border-white/10">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : currentStep === QUESTIONS.length - 1 ? (
                  <>Generate Report <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <>Next Step <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
