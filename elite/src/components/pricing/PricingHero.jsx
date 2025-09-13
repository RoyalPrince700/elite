import { motion } from 'framer-motion';
import { Star, Zap, Crown } from 'lucide-react';

// Import before/after images
import aBefore from '../../assets/h-before.jpg';
import aAfter from '../../assets/h-after.jpg';

const PricingHero = ({ fadeIn }) => {
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
        <div className="text-center max-w-4xl mx-auto mb-16">
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
          >
            Professional Photo
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-600">
              {" "}Retouching
            </span>
            <br />Pricing Plans
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your retouching needs. From freelancers to agencies,
            our flexible pricing delivers premium quality edits with fast turnaround times.
          </motion.p>

          {/* Plan Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Star className="w-4 h-4" />
              Premium Quality
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              Fast Turnaround
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Crown className="w-4 h-4" />
              Expert Artists
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">5000+</div>
              <div className="text-sm text-gray-500">Photos Retouched</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-1">98%</div>
              <div className="text-sm text-gray-500">Client Satisfaction</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
              <div className="text-sm text-gray-500">Customer Support</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">5+</div>
              <div className="text-sm text-gray-500">Years Experience</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Visual Portfolio Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative max-w-lg mx-auto"
        >
          {/* Main Featured Image */}
          <motion.div
            className="relative mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white border-4 border-white">
              <div className="grid grid-cols-2 gap-0 items-stretch">
                <div className="relative">
                  <img
                    src={aBefore}
                    alt="Before Retouching"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="inline-flex items-center gap-2 bg-red-500/90 px-3 py-2 rounded-full text-sm font-semibold">
                      Before
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={aAfter}
                    alt="After Retouching"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
                  <div className="absolute bottom-4 right-4 text-white text-right">
                    <div className="inline-flex items-center gap-2 bg-green-500/90 px-3 py-2 rounded-full text-sm font-semibold">
                      After
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Badge */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                  See the Transformation
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingHero;
