import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Crown, Eye } from 'lucide-react';

// Import before/after images for carousel
import aBefore from '../../assets/h-before.jpg';
import aAfter from '../../assets/h-after.jpg';
import bBefore from '../../assets/b-before.jpg';
import bAfter from '../../assets/b-after.jpg';
import cBefore from '../../assets/c-before.jpg';
import cAfter from '../../assets/c-after.jpg';

// Pricing showcase data for carousel
const pricingShowcase = [
  { before: aBefore, after: aAfter, title: "Portrait Retouching", category: "Beauty & Fashion" },
  { before: bBefore, after: bAfter, title: "Fashion Photography", category: "Editorial" },
  { before: cBefore, after: cAfter, title: "Commercial Portrait", category: "Corporate" }
];

const PricingHero = ({ fadeIn }) => {
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Auto-rotate showcase images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowcase((prev) => (prev + 1) % pricingShowcase.length);
      setIsRevealed(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="mb-16 bg-gradient-to-br from-blue-50 via-white to-amber-50 relative overflow-hidden"
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={fadeIn.transition}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full -translate-y-36 translate-x-36 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full translate-y-48 -translate-x-48 opacity-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Creative Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-white rounded-full"
            />
            Professional Pricing Plans
          </motion.div>

          {/* Creative Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="font-semibold text-gray-800"
              >
                Choose your perfect plan
              </motion.span>

              <motion.span
                initial={{ opacity: 0, color: "#6B7280" }}
                animate={{ opacity: 1, color: "#3B82F6" }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="font-semibold"
              >
                {" "}and transform your photography.
              </motion.span>
            </motion.p>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex justify-center gap-8 mt-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-blue-600">5000+</div>
                <div className="text-sm text-gray-500">Photos Retouched</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring" }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-500">Satisfaction</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: "spring" }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-amber-600">24h</div>
                <div className="text-sm text-gray-500">Delivery</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Interactive Before/After Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div
            className="relative overflow-hidden rounded-3xl shadow-2xl bg-white border-4 border-white"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-96 md:h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentShowcase}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {/* Before Image */}
                  <div className="absolute inset-0">
                    <img
                      src={pricingShowcase[currentShowcase].before}
                      alt="Before Retouching"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="inline-flex items-center gap-2 bg-red-500/90 px-4 py-2 rounded-full text-sm font-semibold">
                        Before
                      </div>
                    </div>
                  </div>

                  {/* After Image with Reveal Effect */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: isRevealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    onAnimationComplete={() => setIsRevealed(true)}
                  >
                    <img
                      src={pricingShowcase[currentShowcase].after}
                      alt="After Retouching"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
                    <div className="absolute bottom-6 right-6 text-white text-right">
                      <div className="inline-flex items-center gap-2 bg-green-500/90 px-4 py-2 rounded-full text-sm font-semibold">
                        After
                      </div>
                    </div>
                  </motion.div>

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                      {pricingShowcase[currentShowcase].category}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute top-6 right-6 text-right">
                    <h3 className="text-white text-2xl font-bold drop-shadow-lg">
                      {pricingShowcase[currentShowcase].title}
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Reveal Control */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <motion.button
                onClick={() => setIsRevealed(!isRevealed)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="text-lg" />
                {isRevealed ? "Hide Transformation" : "Reveal Transformation"}
              </motion.button>
            </div>
          </motion.div>

          {/* Showcase Indicators */}
          <div className="flex justify-center gap-3 mt-6">
            {pricingShowcase.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentShowcase(index);
                  setIsRevealed(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentShowcase
                    ? "bg-blue-600 scale-125 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm font-medium">View Pricing Plans</span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingHero;
