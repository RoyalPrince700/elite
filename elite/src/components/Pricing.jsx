import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CheckIcon from "../assets/check.svg";
import BeforeAfterComparison from "./BeforeAfterComparison";

// Import before/after images for pricing tiers
import aBefore from "../assets/p-before.jpg";
import aAfter from "../assets/p-after.jpg";
import bBefore from "../assets/k-before.jpg";
import bAfter from "../assets/k-after.jpg";
import cBefore from "../assets/b-before.jpg";
import cAfter from "../assets/b-after.jpg";

const pricingTiers = [
  {
    title: "Silver Plan",
    monthlyPrice: 97,
    monthlyPriceNGN: 90000,
    images: "30 images",
    imagesNGN: "30 images",
    audience: "Freelancers, new photographers",
    description: "Entry-level option to try the service.",
    popular: false,
    inverse: false,
    beforeImage: aBefore,
    afterImage: aAfter,
    features: (currency) => [
      "Up to 10 Natural, 8 High-End, 2 Magazine",
      `Save ${currency === 'USD' ? '$' : '₦'}${currency === 'USD' ? '73' : '60,000'} (~43% off)`,
      `Effective rate: ~${currency === 'USD' ? '$' : '₦'}${currency === 'USD' ? '4.85' : '3,000'}/image`,
      "Commercial usage rights",
      "Standard support"
    ],
    details: {
      retailValue: 170,
      retailValueNGN: 150000,
      savings: 73,
      savingsNGN: 60000,
      effectiveRate: 4.85,
      effectiveRateNGN: 3000
    }
  },
  {
    title: "Gold Plan",
    monthlyPrice: 197,
    monthlyPriceNGN: 120000,
    images: "60 images",
    imagesNGN: "60 images",
    audience: "Busy portrait & fashion photographers",
    description: "Highlight as Best Value.",
    popular: true,
    inverse: true,
    beforeImage: bBefore,
    afterImage: bAfter,
    features: (currency) => [
      "Up to 30 Natural, 25 High-End, 5 Magazine",
      `Save ${currency === 'USD' ? '$' : '₦'}${currency === 'USD' ? '303' : '130,000'} (~61% off)`,
      `Effective rate: ~${currency === 'USD' ? '$' : '₦'}${currency === 'USD' ? '3.28' : '2,000'}/image`,
      "Commercial usage rights",
      "Priority chat support",
      "Mix & match across styles"
    ],
    details: {
      retailValue: 500,
      retailValueNGN: 250000,
      savings: 303,
      savingsNGN: 130000,
      effectiveRate: 3.28,
      effectiveRateNGN: 2000
    }
  },
  {
    title: "Diamond Plan",
    monthlyPrice: 397,
    monthlyPriceNGN: 200000,
    images: "150 images",
    imagesNGN: "150 images",
    audience: "Brands, agencies, studios",
    description: "High-volume plan, premium option.",
    popular: false,
    inverse: false,
    beforeImage: cBefore,
    afterImage: cAfter,
    features: (currency) => [
      "Up to 75 Natural, 60 High-End, 15 Magazine",
      `Save ${currency === 'USD' ? '$' : '₦'}${currency === 'USD' ? '878' : '200,000'} (~69% off)`,
      `Effective rate: ~${currency === 'USD' ? '$' : '₦'}${currency === 'USD' ? '2.65' : '1,333.33'}/image`,
      "Commercial usage rights",
      "Priority delivery",
      "Dedicated account manager",
      "Mix & match across styles"
    ],
    details: {
      retailValue: 1275,
      retailValueNGN: 400000,
      savings: 878,
      savingsNGN: 200000,
      effectiveRate: 2.65,
      effectiveRateNGN: 1333.33
    }
  },
];

export const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'NGN'

  const handlePricingClick = () => {
    if (user) {
      // User is authenticated, go to pricing page
      navigate('/pricing');
    } else {
      // User is not authenticated, go to auth page
      navigate('/auth');
    }
  };

  return (
    <section className="py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-900">Subscription Plans</h2>
          <p className="text-blue-700 mt-5 text-lg">
            Our subscription plans aren't just for photographers — e-commerce brands, 
            modeling agencies, and creative studios use our service to handle all their 
            image needs every month.
          </p>
        </div>
        
        <div className="flex flex-col gap-8 items-center mt-16 lg:flex-row lg:items-stretch lg:justify-center">
          {pricingTiers.map(
            (
              { title, monthlyPrice, monthlyPriceNGN, images, imagesNGN, audience, description, buttonText, popular, inverse, features, details, beforeImage, afterImage },
              index
            ) => (
              <div key={index} className="space-y-6">
                {/* Before/After Comparison */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15 + 0.2,
                    ease: "easeOut"
                  }}
                  className="relative"
                >
                  <BeforeAfterComparison
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                    altText={title}
                  />
                </motion.div>

                {/* Pricing Card */}
                <motion.div
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className={twMerge(
                  "rounded-2xl p-8 w-full max-w-sm shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col relative",
                  inverse
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white border-2 border-blue-500"
                    : "bg-white text-blue-900 border border-blue-200"
                )}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={twMerge(
                      "text-2xl font-bold",
                      inverse ? "text-white" : "text-blue-800"
                    )}
                  >
                    {title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
                      className={twMerge(
                        "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 flex items-center gap-1",
                        inverse
                          ? "bg-white text-blue-700 border-white hover:bg-blue-50"
                          : currency === 'USD'
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                            : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                      )}
                    >
                      <span>{currency}</span>
                      <span className="text-xs">↔</span>
                      <span>{currency === 'USD' ? 'NGN' : 'USD'}</span>
                    </button>
                  </div>
                </div>
                
                <p className={twMerge(
                  "text-sm mb-2",
                  inverse ? "text-blue-200" : "text-blue-600"
                )}>
                  {audience}
                </p>
                
                <p className={twMerge(
                  "text-sm mb-6 italic",
                  inverse ? "text-blue-100" : "text-blue-700"
                )}>
                  {description}
                </p>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-bold tracking-tighter">
                    {currency === 'USD' ? '$' : '₦'}
                    {currency === 'USD' ? monthlyPrice : monthlyPriceNGN.toLocaleString()}
                  </span>
                  <span className={twMerge(
                    "tracking-tight font-medium",
                    inverse ? "text-blue-200" : "text-blue-600"
                  )}>
                    /month
                  </span>
                </div>
                
                <div className={twMerge(
                  "text-lg font-semibold mt-2 mb-6",
                  inverse ? "text-white" : "text-blue-800"
                )}>
                  {currency === 'USD' ? images : imagesNGN}
                </div>
                
                <div className={twMerge(
                  "text-sm p-3 rounded-lg mb-6",
                  inverse ? "bg-blue-500/20" : "bg-blue-50"
                )}>
                  <div className="flex justify-between">
                    <span>Retail value:</span>
                    <span className="font-semibold">
                      {currency === 'USD' ? '$' : '₦'}
                      {currency === 'USD' ? details.retailValue : details.retailValueNGN.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>You save:</span>
                    <span className="font-semibold">
                      {currency === 'USD' ? '$' : '₦'}
                      {currency === 'USD' ? details.savings : details.savingsNGN.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handlePricingClick}
                  className={twMerge(
                    "w-full mt-4 py-3 rounded-lg font-semibold transition-colors",
                    inverse
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {user ? 'Get Started' : 'Sign up now'}
                </button>
                
                <ul className="flex flex-col gap-4 mt-8">
                  {features(currency).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={twMerge(
                        "p-1 rounded-full mt-1 flex-shrink-0",
                        inverse ? "bg-blue-500" : "bg-blue-100"
                      )}>
                        <img
                          src={CheckIcon}
                          alt="Check Icon"
                          className="h-4 w-4"
                        />
                      </div>
                      <span className={twMerge(
                        "text-sm",
                        inverse ? "text-blue-100" : "text-blue-700"
                      )}>{feature}</span>
                    </li>
                  ))}
                </ul>
                </motion.div>
              </div>
            )
          )}
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-blue-900 text-center mb-6">Plan Details & Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
            <div className="bg-blue-50 p-5 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">For All Plans</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <img src={CheckIcon} alt="Check" className="h-3 w-3" />
                  </div>
                  <span>Mix & match: Use your images across Natural, High-End, and Magazine within the listed caps</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <img src={CheckIcon} alt="Check" className="h-3 w-3" />
                  </div>
                  <span>Rollover: Allow up to 20% of unused images to next month</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <img src={CheckIcon} alt="Check" className="h-3 w-3" />
                  </div>
                  <span>Commercial use: All plans include full commercial usage rights</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Premium Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <img src={CheckIcon} alt="Check" className="h-3 w-3" />
                  </div>
                  <span>Turnaround: Priority delivery for Diamond subscribers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <img src={CheckIcon} alt="Check" className="h-3 w-3" />
                  </div>
                  <span>Dedicated support: Gold/Diamond get priority chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                    <img src={CheckIcon} alt="Check" className="h-3 w-3" />
                  </div>
                  <span>Cancel anytime: No long-term contracts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;