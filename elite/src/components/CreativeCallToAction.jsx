import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiZap,
  FiClock,
  FiStar,
  FiArrowRight,
  FiPlay,
  FiPause
} from "react-icons/fi";

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span className="font-bold text-blue-600">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Floating particle component
const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 bg-blue-200 rounded-full"
    animate={{
      y: [0, -100, 0],
      x: [0, Math.random() * 100 - 50, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

export const CreativeCallToAction = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStat, setCurrentStat] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Auto-rotate stats
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const stats = [
    {
      icon: FiUsers,
      title: "Happy Clients",
      value: 12500,
      suffix: "+",
      color: "bg-blue-500"
    },
    {
      icon: FiAward,
      title: "Projects Completed",
      value: 50000,
      suffix: "+",
      color: "bg-purple-500"
    },
    {
      icon: FiTrendingUp,
      title: "Success Rate",
      value: 99,
      suffix: ".9%",
      color: "bg-green-500"
    },
    {
      icon: FiClock,
      title: "Avg. Turnaround",
      value: 24,
      suffix: "hrs",
      color: "bg-orange-500"
    }
  ];

  const handleGetStarted = () => {
    navigate('/pricing');
  };

  const handleViewWork = () => {
    navigate('/portfolio');
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gray-50"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
        </div>

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-yellow-400/30"
            >
              <FiTarget className="text-yellow-600" />
              <span>Limited Time Offer</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Ready to <span className="text-blue-600">Transform</span> Your Photos?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              Join thousands of satisfied clients who trust us with their visual storytelling.
              Get started today and see the difference professional retouching can make.
            </motion.p>
          </motion.div>

          {/* Interactive Stats Showcase */}
          <motion.div
            style={{ y: translateY, scale }}
            className="relative mb-16"
          >
            <div className="bg-white backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatePresence mode="wait">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={`${stat.title}-${currentStat}`}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{
                          opacity: index === currentStat ? 1 : 0.3,
                          y: index === currentStat ? 0 : 20,
                          scale: index === currentStat ? 1 : 0.9
                        }}
                        transition={{ duration: 0.5 }}
                        className={`text-center cursor-pointer transition-all duration-300 ${
                          index === currentStat ? 'transform scale-105' : ''
                        }`}
                        onClick={() => setCurrentStat(index)}
                      >
                        <motion.div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.color} mb-4 mx-auto`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="text-white text-2xl" />
                        </motion.div>

                        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                          <AnimatedCounter
                            target={stat.value}
                            suffix={stat.suffix}
                          />
                        </div>

                        <div className="text-gray-600 font-medium">
                          {stat.title}
                        </div>

                        {index === currentStat && (
                          <motion.div
                            className="w-full h-1 bg-blue-400 rounded-full mt-2"
                            layoutId="activeStat"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Play/Pause Control */}
              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                  {isPlaying ? 'Pause Stats' : 'Play Stats'}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Urgency Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-red-500/30"
            >
              <FiClock className="text-red-400" />
              <span>⏰ Limited Time: 50% Off First Order</span>
            </motion.div>

            <div className="flex justify-center gap-4 mb-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
                >
                  <FiStar className="text-yellow-400 text-xl" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <motion.button
                onClick={handleGetStarted}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiZap className="text-xl" />
                <span>Start Your Transformation</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FiArrowRight className="text-xl" />
                </motion.div>
              </motion.button>

              <motion.button
                onClick={handleViewWork}
                className="group bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center gap-3 mx-auto backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgb(229, 231, 235)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTarget className="text-xl" />
                <span>View Our Work</span>
                <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-600 text-sm"
            >
              ✨ No commitment • Cancel anytime • Professional results guaranteed
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CreativeCallToAction;
