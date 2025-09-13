import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PricingFAQ = ({ fadeIn, faqData, expandedFAQ, toggleFAQ }) => {
  return (
    <motion.section
      className="mb-20"
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-black mb-4">Frequently Asked Questions</h2>
        <p className="text-black max-w-2xl mx-auto">
          Got questions about our pricing? Find answers to the most common questions below.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-50 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-black pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0">
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: expandedFAQ === faq.id ? 'auto' : 0,
                opacity: expandedFAQ === faq.id ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4">
                <p className="text-black leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default PricingFAQ;
