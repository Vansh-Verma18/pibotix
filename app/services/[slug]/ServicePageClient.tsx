"use client";

import { useState } from "react";
// Components
import FAQItem from "@/components/services/FAQItem";

interface ServicePageClientProps {
    faqs: Array<{
        question: string;
        answer: string;
    }>;
}

export default function ServicePageClient({ faqs }: ServicePageClientProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full">
            {faqs.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onClick={() => toggleFAQ(index)}
                />
            ))}
        </div>
    );
}
