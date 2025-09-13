import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiClock, FiStar, FiAward, FiUsers, FiImage, FiZap } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BeforeAfterComparison from "./BeforeAfterComparison";

// Import before/after images for carousel
import aBefore from "../assets/n-before.jpg";
import aAfter from "../assets/n-after.jpg";
import bBefore from "../assets/b-before.jpg";
import bAfter from "../assets/b-after.jpg";
import cBefore from "../assets/i-before.jpg";
import cAfter from "../assets/i-after.jpg";
import dBefore from "../assets/d-before.jpg";
import dAfter from "../assets/d-after.jpg";
import eBefore from "../assets/e-before.webp";
import eAfter from "../assets/e-after.webp";
import fBefore from "../assets/f-before.jpg";
import fAfter from "../assets/f-after.jpg";
import gBefore from "../assets/g-before.webp";
import gAfter from "../assets/g-after.webp";
import hBefore from "../assets/h-before.jpg";
import hAfter from "../assets/h-after.jpg";
import iBefore from "../assets/i-before.jpg";
import iAfter from "../assets/i-after.jpg";
import jBefore from "../assets/j-before.jpg";
import jAfter from "../assets/j-after.jpg";
import kBefore from "../assets/k-before.jpg";
import kAfter from "../assets/k-after.jpg";
import lBefore from "../assets/l-before.jpg";
import lAfter from "../assets/l-after.jpg";

const servicesData = [
  {
    title: "Natural Retouching",
    description: "Subtle enhancements that maintain the authentic look of your photos while improving skin texture, color balance, and overall appeal.",
    icon: FiImage,
    beforeImage: aBefore,
    afterImage: aAfter,
    features: [
      "Skin smoothing and texture enhancement",
      "Color correction and white balance",
      "Background cleanup",
      "Natural shadow and lighting adjustments"
    ],
    popular: false
  },
  {
    title: "High-End Retouching",
    description: "Professional-grade retouching for fashion, beauty, and commercial photography with meticulous attention to detail.",
    icon: FiStar,
    beforeImage: bBefore,
    afterImage: bAfter,
    features: [
      "Advanced skin retouching",
      "Complex background removal",
      "Product enhancement",
      "Commercial-ready quality"
    ],
    popular: true
  },
  {
    title: "Magazine Style",
    description: "Editorial-style retouching for magazines, advertisements, and high-profile campaigns requiring flawless results.",
    icon: FiAward,
    beforeImage: cBefore,
    afterImage: cAfter,
    features: [
      "Editorial beauty standards",
      "Complex composite work",
      "Brand-specific requirements",
      "Print-ready optimization"
    ],
    popular: false
  }
];

// Carousel data for before/after slides
const carouselSlides = [
  {
    id: 1,
    beforeImage: aBefore,
    afterImage: aAfter,
    title: "Portrait Enhancement",
    description: "Professional portrait retouching with natural skin improvements",
    category: "Beauty & Fashion"
  },
  {
    id: 2,
    beforeImage: bBefore,
    afterImage: bAfter,
    title: "Commercial Photography",
    description: "High-end retouching for commercial and advertising work",
    category: "Commercial"
  },
  {
    id: 3,
    beforeImage: cBefore,
    afterImage: cAfter,
    title: "Editorial Style",
    description: "Magazine-quality retouching for editorial and fashion shoots",
    category: "Editorial"
  },
  {
    id: 4,
    beforeImage: dBefore,
    afterImage: dAfter,
    title: "Product Photography",
    description: "E-commerce product enhancement and background removal",
    category: "E-commerce"
  },
  {
    id: 5,
    beforeImage: eBefore,
    afterImage: eAfter,
    title: "Creative Retouching",
    description: "Advanced compositing and creative manipulations",
    category: "Creative"
  },
  {
    id: 6,
    beforeImage: fBefore,
    afterImage: fAfter,
    title: "Wedding Photography",
    description: "Elegant wedding portrait retouching and enhancement",
    category: "Wedding"
  }
];

const additionalServices = [
  {
    title: "24h Express Delivery",
    description: "Urgent projects completed within 24 hours",
    icon: FiClock
  },
  {
    title: "Unlimited Revisions",
    description: "Free revisions until you're completely satisfied",
    icon: FiUsers
  },
  {
    title: "Commercial Usage Rights",
    description: "All edited photos include full commercial usage rights",
    icon: FiZap
  }
];

// Carousel Component
const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Carousel */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-2xl bg-white"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative h-96 md:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Before/After Container */}
              <div className="grid grid-cols-2 h-full">
                {/* Before Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={carouselSlides[currentSlide].beforeImage}
                    alt="Before Retouching"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="inline-flex items-center gap-2 bg-red-500/90 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      Before
                    </div>
                  </div>
                </div>

                {/* After Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={carouselSlides[currentSlide].afterImage}
                    alt="After Retouching"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
                  <div className="absolute bottom-6 right-6 text-white text-right">
                    <div className="inline-flex items-center gap-2 bg-green-500/90 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      After
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-md px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4"
                  >
                    {carouselSlides[currentSlide].category}
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl font-bold mb-3"
                  >
                    {carouselSlides[currentSlide].title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/90"
                  >
                    {carouselSlides[currentSlide].description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-blue-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSlide + 1) / carouselSlides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export const Services = () => {
  const navigate = useNavigate();
  const [stackedServices, setStackedServices] = React.useState(additionalServices.map(s => ({ ...s, id: s.title })));
  const bringToTop = (clickedId, clickedIdx) => {
    setStackedServices(prev => {
      if (clickedIdx === 0) {
        return [...prev.slice(1), prev[0]];
      }
      const first = prev[0];
      const clickedItem = prev.find(item => item.id === clickedId);
      const rest = prev.filter((item, idx) => idx !== 0 && item.id !== clickedId);
      return [clickedItem, ...rest, first];
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full -translate-y-36 translate-x-36 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full translate-y-48 -translate-x-48 opacity-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Text Header */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <FiAward className="text-amber-500" />
              <span>Professional Photo Retouching Services</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              Transform Your Photos with <span className="text-blue-700">Expert Retouching</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              From natural enhancements to magazine-perfect results, our professional retouching services
              elevate your photography to new heights. Fast, affordable, and guaranteed satisfaction.
            </motion.p>
          </div>

          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ImageCarousel />
          </motion.div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Services</h2>
            <p className="text-blue-700 text-lg">
              Choose the perfect retouching style for your project. Each service is tailored to deliver
              exceptional results that exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {servicesData.map((service, index) => (
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
                    beforeImage={service.beforeImage}
                    afterImage={service.afterImage}
                    altText={service.title}
                  />
                </motion.div>

                {/* Service Card */}
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
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-200 relative group"
              >
                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated Background Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-20 h-20 bg-blue-100 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                ></motion.div>

                <motion.div
                  className="absolute bottom-4 left-4 w-16 h-16 bg-amber-100 rounded-full opacity-15"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                ></motion.div>

                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl bg-blue-100 border border-blue-300">
                      <motion.span
                        animate={{
                          backgroundPositionX: "100%",
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="bg-[linear-gradient(to_right,#3B82F6,#60A5FA,#93C5FD,#3B82F6)] [background-size:200%] text-transparent bg-clip-text font-medium"
                      >
                        Most Popular
                      </motion.span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6 relative z-10">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
                    whileHover={{
                      scale: 1.2,
                      rotate: 360,
                      backgroundColor: "#3B82F6"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <service.icon className="w-8 h-8 text-blue-700 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">{service.title}</h3>
                  <p className="text-blue-700">{service.description}</p>
                </div>

                <ul className="space-y-3 relative z-10">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + idx * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div
                        className="p-1 rounded-full mt-1 flex-shrink-0 bg-blue-100"
                        whileHover={{
                          scale: 1.3,
                          backgroundColor: "#3B82F6"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiCheck className="h-4 w-4 text-blue-700" />
                      </motion.div>
                      <span className="text-blue-800 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Stacked Cards */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100 rounded-full opacity-15 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20 relative z-10"
          >
            <h3 className="text-4xl font-bold text-blue-900 mb-4">Why Choose EliteRetoucher?</h3>
            <p className="text-blue-700 text-lg">
              Experience the difference with our premium retouching services that prioritize quality, speed, and customer satisfaction.
            </p>
          </motion.div>

          {/* Stacked Cards Container */}
          <div className="relative max-w-4xl mx-auto perspective-1000 min-h-screen" style={{ paddingBottom: `${stackedServices.length * 180 + 300}px` }}>
            {stackedServices.map((service, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={service.id}
                  layout
                  layoutId={`stack-${service.id}`}
                  onClick={() => bringToTop(service.id, index)}
                  className="absolute inset-x-0 cursor-pointer"
                  style={{
                    zIndex: stackedServices.length - index,
                    top: `${index * 120}px`, // Stack cards with 120px offset for better visibility
                  }}
                  initial={{
                    opacity: index === 0 ? 1 : index === 1 ? 0.7 : index === 2 ? 0.4 : 0,
                    y: index === 0 ? 0 : index === 1 ? 20 : index === 2 ? 40 : 100,
                    rotateX: index === 0 ? 0 : index === 1 ? 5 : index === 2 ? 10 : 15,
                    scale: index === 0 ? 1 : index === 1 ? 0.97 : index === 2 ? 0.94 : 0.95
                  }}
                  whileInView={{
                    opacity: index === 0 ? 1 : index === 1 ? 0.8 : index === 2 ? 0.6 : 0.3,
                    y: index === 0 ? 0 : index === 1 ? 10 : index === 2 ? 20 : 30,
                    rotateX: index === 0 ? 0 : index === 1 ? 3 : index === 2 ? 6 : 8,
                    scale: index === 0 ? 1 : index === 1 ? 0.98 : index === 2 ? 0.96 : 0.94,
                    transition: {
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut"
                    }
                  }}
                  viewport={{
                    once: false,
                    margin: index === 0 ? "0px 0px -150px 0px" : "-80px 0px -250px 0px",
                    amount: 0.4
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateX: -5,
                    z: 50,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div
                    className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-blue-100 overflow-hidden relative transform-gpu flex flex-col md:flex-row items-center gap-6 md:gap-8"
                      whileHover={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        borderColor: "#3B82F6"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-20 translate-x-20 opacity-60"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-50 to-transparent rounded-full translate-y-16 -translate-x-16 opacity-50"></div>

                      {/* Floating Elements */}
                      <motion.div
                        className="absolute top-4 right-4 w-16 h-16 bg-blue-200 rounded-full opacity-20"
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      ></motion.div>

                      <motion.div
                        className="absolute bottom-4 left-4 w-12 h-12 bg-amber-200 rounded-full opacity-15"
                        animate={{
                          y: [0, 10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>

                      {/* Text Content */}
                      <motion.div
                        className="flex-1 relative z-10 text-center md:text-left"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <motion.div
                          whileHover={{
                            rotate: [0, -10, 10, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.5 }}
                          className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 md:mb-6 shadow-xl"
                        >
                          <service.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </motion.div>

                        <motion.h4
                          className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 md:mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          {service.title}
                        </motion.h4>

                        <motion.p
                          className="text-blue-700 text-base md:text-lg leading-relaxed"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          {service.description}
                        </motion.p>
                      </motion.div>

                      {/* Icon Side */}
                      <motion.div
                        className="flex-shrink-0 relative z-10"
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: false }}
                        transition={{
                          duration: 0.8,
                          delay: 0.6,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotate: 10,
                          z: 20
                        }}
                      >
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                          <motion.div
                            animate={{
                              rotate: [0, 360]
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50 to-transparent opacity-50"
                          ></motion.div>
                          <service.icon className="w-16 h-16 md:w-20 md:h-20 text-blue-700 relative z-10" />
                        </div>
                      </motion.div>

                      {/* Card Number */}
                      <motion.div
                        className="absolute top-6 right-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                        whileHover={{ scale: 1.2 }}
                      >
                        {index + 1}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 text-blue-600 font-medium"
            >
              <span>Scroll to see more cards</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-100 rounded-full -translate-x-32 opacity-30"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-50 rounded-full translate-x-48 opacity-25"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Our Process</h2>
            <p className="text-blue-700 text-lg">
              Simple, transparent, and efficient. Here's how we transform your photos step by step.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Your Photos",
                description: "Send us your photos through our secure platform with our easy drag-and-drop interface. We support all major formats and file sizes.",
                icon: "📤",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02",
                title: "Expert Review & Planning",
                description: "Our professional retouchers analyze your images and create a customized plan for the perfect enhancement tailored to your needs.",
                icon: "🔍",
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "03",
                title: "Professional Retouching",
                description: "Using industry-leading software and techniques, our experts meticulously retouch each photo with attention to every detail.",
                icon: "✨",
                color: "from-amber-500 to-amber-600"
              },
              {
                step: "04",
                title: "Quality Check & Delivery",
                description: "Final quality assurance ensures perfection. Download your enhanced photos instantly or receive them via email within hours.",
                icon: "🎯",
                color: "from-green-500 to-green-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.25,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.03 }}
                className={`mb-12 bg-white rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-blue-100 overflow-hidden relative ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } md:flex items-center gap-8`}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${item.color} rounded-full -translate-y-24 translate-x-24 opacity-10`}></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-16 -translate-x-16 opacity-50"></div>

                {/* Content Side */}
                <motion.div
                  className="flex-1 relative z-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.25 + 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-xl text-3xl`}
                  >
                    {item.icon}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.25 + 0.4 }}
                    className="inline-flex items-center gap-3 mb-4"
                  >
                    <span className={`px-4 py-2 bg-gradient-to-r ${item.color} text-white rounded-full text-sm font-bold`}>
                      {item.step}
                    </span>
                    <div className="h-px bg-blue-200 flex-1 min-w-16"></div>
                  </motion.div>

                  <h3 className="text-3xl font-bold text-blue-900 mb-4">{item.title}</h3>
                  <p className="text-blue-700 text-lg leading-relaxed">{item.description}</p>
                </motion.div>

                {/* Visual Side */}
                <motion.div
                  className="flex-shrink-0 relative z-10"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.25 + 0.5 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className={`w-40 h-40 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white text-6xl`}>
                    {item.icon}
                  </div>
                </motion.div>

                {/* Connector Line for Desktop */}
                {index < 3 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.25 + 0.8 }}
                    className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-blue-300 to-transparent"
                  ></motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Photos?</h2>
            <p className="text-blue-200 text-lg mb-8">
              Join thousands of photographers who trust EliteRetoucher for their retouching needs.
              Get started today and see the difference professional retouching makes.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
            >
              Start Your Project Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
