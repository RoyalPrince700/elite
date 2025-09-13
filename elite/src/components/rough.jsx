import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import CheckIcon from "../assets/check.svg"; // Adjusted path for Vite compatibility

const pricingTiers = [
  {
    title: "Silver Plan",
    monthlyPrice: 97,
    buttonText: "Get Started",
    popular: false,
    inverse: false,
    imagesPerMonth: "20 images",
    bestFor: "Freelancers, new photographers",
    notes: "Entry-level option to try the service.",
    features: [
      "Basic color correction",
      "Exposure adjustments",
      "Background cleanup",
      "Skin smoothing",
      "5-day turnaround time",
    ],
    gradient: "from-gray-100 to-gray-50",
    border: "border-gray-200",
    buttonStyle: "bg-gray-700 hover:bg-gray-800 text-white",
  },
  {
    title: "Gold Plan",
    monthlyPrice: 197,
    buttonText: "Get Started",
    popular: true,
    inverse: true,
    imagesPerMonth: "60 images",
    bestFor: "Busy portrait & fashion photographers",
    notes: "Highlight as Best Value.",
    features: [
      "All Silver features",
      "Advanced retouching",
      "Detail enhancement",
      "Object removal",
      "2-day turnaround time",
      "Priority support",
    ],
    gradient: "from-amber-50 to-yellow-50",
    border: "border-amber-300",
    buttonStyle: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white",
  },
  {
    title: "Diamond Plan",
    monthlyPrice: 397,
    buttonText: "Get Started",
    popular: false,
    inverse: false,
    imagesPerMonth: "150 images",
    bestFor: "Brands, agencies, studios",
    notes: "High-volume plan, premium option.",
    features: [
      "All Gold features",
      "Premium retouching",
      "Complex edits",
      "Unlimited revisions",
      "Same-day turnaround",
      "Dedicated account manager",
      "Custom workflow integration",
    ],
    gradient: "from-blue-50 to-indigo-50",
    border: "border-blue-300",
    buttonStyle: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your retouching needs. All plans include premium quality edits and fast turnaround times.
          </p>
        </div>
        
        <div className="flex flex-col gap-8 items-center mt-10 lg:flex-row lg:items-stretch lg:justify-center">
          {pricingTiers.map(
            (
              { title, monthlyPrice, buttonText, popular, inverse, imagesPerMonth, bestFor, notes, features, gradient, border, buttonStyle },
              index
            ) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={twMerge(
                  "flex flex-col w-full max-w-md border-2 rounded-xl p-8 transition-all duration-300 shadow-lg",
                  `bg-gradient-to-b ${gradient}`,
                  border
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3
                    className={twMerge(
                      "text-2xl font-bold",
                      inverse ? "text-amber-700" : "text-gray-800"
                    )}
                  >
                    {title}
                  </h3>
                  {popular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex text-sm px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium shadow-md"
                    >
                      <motion.span
                        animate={{
                          backgroundPositionX: "100%",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                      >
                        Most Popular
                      </motion.span>
                    </motion.div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">${monthlyPrice}</span>
                    <span className="text-gray-600 font-medium">/month</span>
                  </div>
                  <p className="mt-2 text-gray-700 font-medium">{imagesPerMonth}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Best For</h4>
                  <p className="text-gray-800">{bestFor}</p>
                </div>

                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h4>
                  <p className="text-gray-800 italic">{notes}</p>
                </div>

                <button
                  className={twMerge(
                    "mt-auto py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md",
                    buttonStyle
                  )}
                >
                  {buttonText}
                </button>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">What's Included:</h4>
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <img
                            src={CheckIcon}
                            alt="Check Icon"
                            className="h-5 w-5 text-green-500"
                          />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          )}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Need a custom plan? Contact us for enterprise solutions</p>
          <button className="bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-sm">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;