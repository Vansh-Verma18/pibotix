"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "What is your primary goal for automation?",
    options: ["Increase Throughput", "Improve Quality/Reduce Defects", "Solve Labor Shortages", "Enhance Safety"]
  },
  {
    id: 2,
    question: "How standardized are your current manual processes?",
    options: ["Highly Standardized", "Somewhat Standardized", "Highly Variable", "Not Documented"]
  },
  {
    id: 3,
    question: "Do you currently have basic data collection (SCADA/MES) in place?",
    options: ["Yes, fully integrated", "Partial/Legacy Systems", "No, mostly manual tracking", "Not Sure"]
  },
  {
    id: 4,
    question: "What is your expected ROI timeframe?",
    options: ["Under 12 months", "1-2 Years", "2-3 Years", "Long-term Strategic"]
  }
];

export default function ReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: option }));
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      setTimeout(() => setIsComplete(true), 400);
    }
  };

  return (
    <section className="py-24 bg-card border-t border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Automation Readiness Assessment</h2>
            <p className="text-gray-400 text-lg">
              Not sure where to start? Answer 4 quick questions to see if your facility is ready for advanced automation integration.
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                      Question {currentStep + 1} of {questions.length}
                    </span>
                    <div className="flex gap-1">
                      {questions.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentStep ? 'w-6 bg-primary' : 'w-2 bg-white/20'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                    {questions[currentStep].question}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {questions[currentStep].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(option)}
                        className={`p-6 text-left rounded-2xl border transition-all duration-200 group ${
                          answers[currentStep] === option 
                          ? "bg-primary/20 border-primary text-white" 
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium">{option}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            answers[currentStep] === option ? "border-primary bg-primary" : "border-white/20 group-hover:border-white/50"
                          }`}>
                            {answers[currentStep] === option && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Assessment Complete!</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    Based on your responses, your facility shows strong potential for automation integration, particularly in standardizing variable processes and achieving your ROI targets.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => {
                        setCurrentStep(0);
                        setAnswers({});
                        setIsComplete(false);
                      }}
                      className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-colors"
                    >
                      Retake Assessment
                    </button>
                    <Link 
                      href="/contact"
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Schedule Free Consultation <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
