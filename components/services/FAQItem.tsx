"use client";

import { ChevronDown } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

export default function FAQItem({
    question,
    answer,
    isOpen,
    onClick,
}: FAQItemProps) {
    return (
        <div
            className={`mb-4 rounded-2xl transition-all duration-300 border ${isOpen
                    ? "bg-white/5 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-white/5 border-white/5 hover:border-primary/20"
                }`}
        >
            <button
                className="w-full py-5 px-6 md:px-8 flex items-center justify-between text-left focus:outline-none group"
                onClick={onClick}
            >
                <span
                    className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? "text-primary" : "text-white group-hover:text-primary/90"
                        }`}
                >
                    {question}
                </span>
                <div
                    className={`shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-primary text-white rotate-180" : "bg-white/10 text-white group-hover:bg-primary/20"
                        }`}
                >
                    <ChevronDown className="w-5 h-5" />
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 md:px-8 pb-6 text-gray-300 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
