import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BeforeAfterComparison from '../components/BeforeAfterComparison';
import { ArrowRight, Star, Zap, Crown, Camera, Eye } from 'lucide-react';

// Import before/after images
import aBefore from '../assets/k-before.jpg';
import aAfter from '../assets/k-after.jpg';
import bBefore from '../assets/b-before.jpg';
import bAfter from '../assets/b-after.jpg';
import cBefore from '../assets/c-before.jpg';
import cAfter from '../assets/c-after.jpg';
import dBefore from '../assets/d-before.jpg';
import dAfter from '../assets/d-after.jpg';
import eBefore from '../assets/e-before.webp';
import eAfter from '../assets/e-after.webp';
import wBefore from '../assets/w-before.jpg';
import wAfter from '../assets/w-after.jpg';
import gBefore from '../assets/g-before.webp';
import gAfter from '../assets/g-after.webp';
import hBefore from '../assets/h-before.jpg';
import hAfter from '../assets/h-after.jpg';
import iBefore from '../assets/i-before.jpg';
import iAfter from '../assets/i-after.jpg';
import jBefore from '../assets/j-before.jpg';
import jAfter from '../assets/j-after.jpg';
import kBefore from '../assets/a-before.jpg';
import kAfter from '../assets/a-after.jpg';
import lBefore from '../assets/l-before.jpg';
import lAfter from '../assets/l-after.jpg';
import mBefore from '../assets/m-before.jpg';
import mAfter from '../assets/m-after.jpg';
import rBefore from '../assets/r-before.jpg';
import rAfter from '../assets/r-after.jpg';
import tBefore from '../assets/t-before.jpg';
import tAfter from '../assets/t-after.jpg';

// Portfolio showcase data for carousel
const portfolioShowcase = [
  { before: dBefore, after: dAfter, title: "Product Photography", category: "E-commerce" },
  { before: eBefore, after: eAfter, title: "Creative Retouching", category: "Artistic" },
  { before: wBefore, after: wAfter, title: "Wedding Photography", category: "Events" }
];

const Portfolio = () => {
  const navigate = useNavigate();
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Auto-rotate showcase images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowcase((prev) => (prev + 1) % portfolioShowcase.length);
      setIsRevealed(false);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Portfolio data with before/after images
  const portfolioItems = [
    {
      id: 1,
      beforeImage: aBefore,
      afterImage: aAfter,
      title: "Portrait Retouching",
      category: "Beauty & Fashion",
      description: "Professional portrait with advanced skin retouching and color correction."
    },
    {
      id: 2,
      beforeImage: bBefore,
      afterImage: bAfter,
      title: "Fashion Photography",
      category: "Editorial",
      description: "Magazine-quality retouching for fashion editorial shoot."
    },
    {
      id: 3,
      beforeImage: cBefore,
      afterImage: cAfter,
      title: "Commercial Portrait",
      category: "Corporate",
      description: "Business portrait with professional lighting and skin enhancement."
    },
    {
      id: 4,
      beforeImage: dBefore,
      afterImage: dAfter,
      title: "Headshot Enhancement",
      category: "Professional",
      description: "LinkedIn profile photo with background cleanup and color grading."
    },
    {
      id: 5,
      beforeImage: tBefore,
      afterImage: tAfter,
      title: "Creative Retouching",
      category: "E-commerce",
      description: "Product image with background removal and shadow enhancement."
    },
    {
      id: 6,
      beforeImage: wBefore,
      afterImage: wAfter,
      title: "Wedding Photography",
      category: "Event",
      description: "Bridal portrait with delicate skin retouching and color correction."
    },
    {
      id: 7,
      beforeImage: gBefore,
      afterImage: gAfter,
      title: "Model Portfolio",
      category: "Fashion",
      description: "High-fashion model image with advanced retouching techniques."
    },
    {
      id: 8,
      beforeImage: hBefore,
      afterImage: hAfter,
      title: "Pro Retouching",
      category: "Personal",
      description: "Group family photo with natural skin enhancement and color balancing."
    },
    {
      id: 9,
      beforeImage: iBefore,
      afterImage: iAfter,
      title: "Face Retouching",
      category: "Beauty",
      description: "Professional face retouching with skin smoothing and feature enhancement."
    },
    {
      id: 10,
      beforeImage: jBefore,
      afterImage: jAfter,
      title: "Creative Portrait",
      category: "Artistic",
      description: "Artistic portrait with dramatic lighting and selective color adjustments."
    },
    {
      id: 11,
      beforeImage: mBefore,
      afterImage: mAfter,
      title: "Male Retouching",
      category: "Portrait",
      description: "Professional male portrait with advanced skin retouching and facial enhancement."
    },
    {
      id: 12,
      beforeImage: rBefore,
      afterImage: rAfter,
      title: "Hair Retouching",
      category: "Beauty",
      description: "Professional hair retouching with strand-by-strand detail enhancement and color correction."
    }
  ];

  const handleCTAClick = () => {
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen pt-4 bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section - Image Slideshow */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto max-w-6xl">
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
              Professional Retouching Portfolio
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
                  Witness the magic
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, color: "#6B7280" }}
                  animate={{ opacity: 1, color: "#3B82F6" }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="font-semibold"
                >
                  {" "}precision, artistry, and excellence.
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
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-500">Projects</div>
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
                        src={portfolioShowcase[currentShowcase].before}
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
                        src={portfolioShowcase[currentShowcase].after}
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
                        {portfolioShowcase[currentShowcase].category}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute top-6 right-6 text-right">
                      <h3 className="text-white text-2xl font-bold drop-shadow-lg">
                        {portfolioShowcase[currentShowcase].title}
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
              {portfolioShowcase.map((_, index) => (
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
                onClick={() => document.getElementById('portfolio-gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="text-sm font-medium">See More Work</span>
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
      </section>

      {/* Portfolio Gallery */}
      <section id="portfolio-gallery" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                {...fadeIn}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Before/After Comparison */}
                <div className="p-6">
                  <BeforeAfterComparison
                    beforeImage={item.beforeImage}
                    afterImage={item.afterImage}
                    altText={item.title}
                  />
                </div>

                {/* Project Details */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {item.description}
                  </p>

                  {/* CTA Button */}
                  <motion.button
                    onClick={handleCTAClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    Get This Quality
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section 1 */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            {...fadeIn}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Photos?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of photographers, agencies, and brands who trust EliteRetoucher
              with their most important images.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleCTAClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Pricing Plans
              </motion.button>
              <motion.button
                onClick={handleCTAClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            {...fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional retouching that exceeds expectations, delivered with precision and care.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              {...fadeIn}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Silver Plan</h3>
              <p className="text-gray-600 mb-4">
                Perfect for freelancers and small studios. 20 images/month with professional retouching.
              </p>
              <button
                onClick={handleCTAClick}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Learn More →
              </button>
            </motion.div>

            <motion.div
              {...fadeIn}
              className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg border-2 border-amber-200"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gold Plan</h3>
              <p className="text-gray-600 mb-4">
                Most popular choice for busy photographers. 60 images/month with priority service.
              </p>
              <button
                onClick={handleCTAClick}
                className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
              >
                Learn More →
              </button>
            </motion.div>

            <motion.div
              {...fadeIn}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diamond Plan</h3>
              <p className="text-gray-600 mb-4">
                For agencies and high-volume clients. 150 images/month with dedicated support.
              </p>
              <button
                onClick={handleCTAClick}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Learn More →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            {...fadeIn}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Photography Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Ready to see your photos reach their full potential? Choose the plan that fits your needs
              and start creating stunning images that captivate your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleCTAClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Plans
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </motion.button>
              <motion.button
                onClick={handleCTAClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Try Pay Per Image
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
