import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ArrowIcon from "../assets/arrow-right.svg";
import { FiEye, FiArrowRight, FiZap } from "react-icons/fi";

// Import before/after images for portfolio showcase
import dBefore from "../assets/d-before.jpg";
import dAfter from "../assets/d-after.jpg";
import eBefore from "../assets/e-before.webp";
import eAfter from "../assets/e-after.webp";
import fBefore from "../assets/f-before.jpg";
import fAfter from "../assets/f-after.jpg";

const portfolioShowcase = [
  { before: dBefore, after: dAfter, title: "Product Photography", category: "E-commerce" },
  { before: eBefore, after: eAfter, title: "Creative Retouching", category: "Artistic" },
  { before: fBefore, after: fAfter, title: "Wedding Photography", category: "Events" }
];

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -10]);

  // Auto-rotate showcase images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowcase((prev) => (prev + 1) % portfolioShowcase.length);
      setIsRevealed(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePortfolioClick = () => {
    navigate('/portfolio');
  };

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 overflow-hidden relative"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full opacity-8 blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <FiZap className="text-amber-500" />
              <span>Transformation Showcase</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              See the <span className="text-blue-600">Magic</span> in Action
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              From ordinary photos to extraordinary results. Experience our professional retouching
              that brings your vision to life. Ready to transform your own images?
            </motion.p>
          </div>

          {/* Interactive Before/After Showcase */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl bg-white border-4 border-white"
              style={{ rotateX }}
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
                  <FiEye className="text-lg" />
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
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              onClick={handlePortfolioClick}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FiEye className="text-xl" />
              <span>View Full Portfolio</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FiArrowRight className="text-xl" />
              </motion.div>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-600 mt-4 text-sm"
            >
              Discover hundreds of stunning transformations →
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;