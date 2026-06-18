'use client';

import { motion } from 'framer-motion';

const FAQS = [
  {
    q: 'How long does a typical automation project take?',
    a: 'Timelines vary based on complexity, but a standard robotic workcell typically takes 12-16 weeks from discovery to final SAT (Site Acceptance Testing).'
  },
  {
    q: 'Do you provide post-installation support?',
    a: 'Yes. We offer 24/7 technical support, predictive maintenance contracts, and on-site operator training to ensure long-term success.'
  },
  {
    q: 'Can you integrate with our existing legacy PLCs?',
    a: 'Absolutely. We specialize in retrofitting and integrating modern SCADA/IoT platforms with legacy Siemens, Allen-Bradley, and Mitsubishi controllers.'
  },
  {
    q: 'What is the average ROI for your robotic cells?',
    a: 'Most of our clients achieve full ROI within 12 to 18 months, driven by increased throughput, eliminated scrap, and reduced labor costs.'
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-card border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">
            Common technical and operational questions from our enterprise clients.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h4 className="text-lg font-bold text-white mb-3">{faq.q}</h4>
              <p className="text-gray-400 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
