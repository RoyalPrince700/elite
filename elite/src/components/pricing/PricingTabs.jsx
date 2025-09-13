import { motion } from 'framer-motion';

const PricingTabs = ({ activeTab, setActiveTab, fadeIn }) => {
  return (
    <motion.div
      className="flex justify-center mb-12"
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
    >
      <div className="flex bg-gray-200 rounded-lg p-1">
        <button
          className={`px-6 py-2 rounded-md ${activeTab === 'subscription' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
          onClick={() => setActiveTab('subscription')}
        >
          Subscription Plans
        </button>
        <button
          className={`px-6 py-2 rounded-md ${activeTab === 'pay-per-image' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
          onClick={() => setActiveTab('pay-per-image')}
        >
          Pay Per Image
        </button>
      </div>
    </motion.div>
  );
};

export default PricingTabs;
