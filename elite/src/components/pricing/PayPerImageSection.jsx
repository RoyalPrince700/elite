import { motion } from 'framer-motion';
import { CurrencyToggle } from './BillingToggle';

const PayPerImageSection = ({
  fadeIn,
  staggerChildren,
  payPerImageServices,
  payPerImageCurrency,
  setPayPerImageCurrency,
  formatPrice,
  getPayPerImagePrice,
  handlePayPerImageGetStarted
}) => {
  return (
    <motion.section
      className="mb-20"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <motion.div
        className="text-center mb-12"
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold text-black mb-4">Pay-Per-Image Services</h2>
        <p className="text-black max-w-2xl mx-auto">
          Need just a few images retouched? Our pay-per-image options give you flexibility without commitment.
        </p>

        <div className="mt-6 flex justify-center">
          <CurrencyToggle
            currency={payPerImageCurrency}
            setCurrency={setPayPerImageCurrency}
            type="pay-per-image"
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerChildren}
      >
        {payPerImageServices.map((category, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            className="bg-white rounded-xl shadow-lg p-6 border border-blue-200"
          >
            <h3 className="text-xl font-bold text-black mb-6 pb-3 border-b border-blue-200">{category.category}</h3>
            <div className="space-y-6">
              {category.services.map((service, i) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={i}>
                    <div className="flex items-start mb-2">
                      <ServiceIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <span className="text-lg font-bold text-primary-600">
                            {typeof service.price === 'number'
                              ? `${formatPrice(getPayPerImagePrice(service), false)}/image`
                              : service.price}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{service.desc}</p>
                        {typeof service.price === 'number' && (
                          <button
                            onClick={() => handlePayPerImageGetStarted(service)}
                            className="mt-3 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Get Started
                          </button>
                        )}
                      </div>
                    </div>
                    {i < category.services.length - 1 && <hr className="my-4" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PayPerImageSection;
