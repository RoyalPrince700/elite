import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiAward, FiClock, FiStar } from "react-icons/fi";
import BeforeAfterComparison from "./BeforeAfterComparison";

// Import images
import beforeImage from "../assets/before.jpg";
import afterImage from "../assets/after.jpg";

const Hero = () => {
  return (
    <section className="pt-20 pb-20 md:pb-32 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full -translate-y-36 translate-x-36 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full translate-y-48 -translate-x-48 opacity-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* ==================== DESKTOP VERSION (Hidden on mobile) ==================== */}
<div className="hidden lg:flex flex-col lg:flex-row items-center justify-center gap-12 px-8">
  {/* Text Content */}
  <div className="lg:w-1/2 text-center lg:text-left max-w-xl">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
    >
      <FiAward className="text-amber-500" />
      <span>Professional Retouching</span>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
    >
      Elevate Your Photos with <span className="text-blue-700">Expert Retouching</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-lg text-gray-600 mt-6"
    >
      Fast, high-quality retouching that enhances your images naturally.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
    >
      <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg">
        Get Started Now <FiArrowRight />
      </button>
      <button className="border border-blue-700 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
        View Portfolio <FiArrowRight />
      </button>
    </motion.div>
  </div>

  {/* Image Only (Floating cards removed) */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.5 }}
    className="lg:w-1/2 flex justify-center"
  >
    <BeforeAfterComparison
      beforeImage={beforeImage}
      afterImage={afterImage}
      altText="Professional photo retouching example"
    />
  </motion.div>
</div>

        {/* ==================== MOBILE VERSION (Shown only on mobile) ==================== */}
        <div className="lg:hidden flex flex-col items-center text-center gap-8">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <FiAward className="text-amber-500" />
            <span>Professional Grade Retouching</span>
          </motion.div> */}

          

          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-lg"
          >
            Professional retouching that enhances your images while keeping them natural. Fast, affordable, and high quality.
          </motion.p> */}

          

          {/* Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-md mt-6"
          >
            <BeforeAfterComparison
              beforeImage={beforeImage}
              afterImage={afterImage}
              altText="Professional photo retouching example"
            />
          </motion.div>

           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
          >
            Transform Your <span className="text-blue-700">Photos</span> With Expert Retouching
          </motion.h1>


            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg">
              Get Started Now <FiArrowRight />
            </button>
            <button className="border border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              View Portfolio <FiArrowRight />
            </button>
          </motion.div> 

          {/* Floating Cards (Stacked on mobile) */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 gap-4 w-full max-w-xs mt-4"
          >
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiStar className="text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">4.9/5 Rating</p>
                  <p className="text-sm text-gray-500">From 250+ clients</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiClock className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">24h Delivery</p>
                  <p className="text-sm text-gray-500">Express option available</p>
                </div>
              </div>
            </div>
          </motion.div> */}

          {/* Mobile Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 gap-3 max-w-xs mt-6 text-left self-start"
          >
            <div className="flex items-center gap-3">
              <FiCheck className="text-blue-700" />
              <span className="text-gray-700">24h Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <FiStar className="text-blue-700" />
              <span className="text-gray-700">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="text-blue-700" />
              <span className="text-gray-700">Unlimited Revisions</span>
            </div>
            <div className="flex items-center gap-3">
              <FiAward className="text-blue-700" />
              <span className="text-gray-700">Satisfaction Guaranteed</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;