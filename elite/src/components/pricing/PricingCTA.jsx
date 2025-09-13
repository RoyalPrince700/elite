import { motion } from 'framer-motion';

const PricingCTA = ({ fadeIn }) => {
  return (
    <motion.section
      className="bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl p-10 text-center text-white mb-16"
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
    >
      <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Images?</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Join thousands of photographers and brands who trust EliteRetoucher with their images.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="btn-secondary">
          Start with a Subscription
        </button>
        <button className="btn-dark">
          Try Single Image Editing
        </button>
      </div>
    </motion.section>
  );
};

export default PricingCTA;
