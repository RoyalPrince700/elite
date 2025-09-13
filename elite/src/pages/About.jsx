import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Award, Users, Clock, Target, Heart, Zap, Camera, CheckCircle, ArrowRight } from 'lucide-react';
import BeforeAfterComparison from '../components/BeforeAfterComparison';

// Import before/after images
import aBefore from '../assets/i-before.jpg';
import aAfter from '../assets/i-after.jpg';
import bBefore from '../assets/j-before.jpg';
import bAfter from '../assets/j-after.jpg';
import cBefore from '../assets/k-before.jpg';
import cAfter from '../assets/k-after.jpg';
import ceoImage from '../assets/eliteceo.jpg';
import peterImage from '../assets/peter.jpg';
import akejuImage from '../assets/akeju.jpg';

const About = () => {
  const navigate = useNavigate();

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

  const stats = [
    { number: "5000+", label: "Photos Retouched", icon: Camera },
    { number: "98%", label: "Client Satisfaction", icon: Star },
    { number: "24/7", label: "Customer Support", icon: Clock },
    { number: "5+", label: "Years Experience", icon: Award }
  ];

  const values = [
    {
      icon: Target,
      title: "Precision & Quality",
      description: "Every pixel matters. We combine technical expertise with artistic vision to deliver flawless results."
    },
    {
      icon: Heart,
      title: "Client-Centric Approach",
      description: "Your vision drives our work. We collaborate closely to bring your creative goals to life."
    },
    {
      icon: Zap,
      title: "Speed & Efficiency",
      description: "Fast turnaround without compromising quality. Your timeline is our priority."
    },
    {
      icon: Users,
      title: "Trusted Partnership",
      description: "Building long-term relationships through reliability, transparency, and exceptional service."
    }
  ];

  const teamMembers = [
    {
      name: "Ajide Samuel",
      role: "CEO of Elite Retoucher",
      experience: "Beauty Photographer",
      specialization: "FWG Photography",
      image: ceoImage
    },
    {
      name: "Peter Abikoye",
      role: "Specialist at Natural Retouching",
      experience: "Commercial Retouch",
      specialization: "Natural Retouching",
      image: peterImage
    },
    {
      name: "Akeju Oluwatunmise",
      role: "Specialist at Magazine",
      experience: "High-end Retouching",
      specialization: "Magazine & Editorial",
      image: akejuImage
    }
  ];

  const beforeAfterShowcase = [
    { before: aBefore, after: aAfter, title: "Portrait Enhancement" },
    { before: bBefore, after: bAfter, title: "Fashion Retouching" },
    { before: cBefore, after: cAfter, title: "Commercial Photography" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full -translate-y-36 translate-x-36 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full translate-y-48 -translate-x-48 opacity-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
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
              About EliteRetoucher
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              Crafting Visual <span className="text-blue-700">Excellence</span> Since 2019
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              We're passionate about transforming ordinary photos into extraordinary works of art.
              With years of experience and cutting-edge technology, we deliver professional photo
              retouching services that exceed expectations.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold text-blue-900 mb-6">Our Story</h2>
                <div className="space-y-6 text-gray-600">
                  <p className="text-lg leading-relaxed">
                    Founded in 2019, EliteRetoucher began with a simple mission: to bridge the gap between
                    talented photographers and world-class photo retouching. We recognized that many
                    photographers lacked the time or specialized skills to perfect their images post-capture.
                  </p>
                  <p className="text-lg leading-relaxed">
                    What started as a small team of passionate retouchers has grown into a trusted partner
                    for photographers, agencies, and brands worldwide. Our commitment to excellence,
                    combined with cutting-edge technology and artistic expertise, sets us apart in the
                    competitive world of professional photo retouching.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Today, we serve clients across the globe, from freelance photographers to major
                    advertising agencies, delivering consistent quality and unmatched service that helps
                    our clients shine in their respective fields.
                  </p>
                </div>

                {/* Mission Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl border-l-4 border-blue-500"
                >
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Our Mission</h3>
                  <p className="text-gray-700">
                    To empower photographers and brands by providing exceptional photo retouching services
                    that enhance their vision and elevate their work to new heights of professionalism.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <img
                    src="/api/placeholder/600/400"
                    alt="EliteRetoucher Team"
                    className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>

                  {/* Floating Achievement Cards */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">99.8%</div>
                        <div className="text-sm text-gray-500">On-time delivery</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">ISO 9001</div>
                        <div className="text-sm text-gray-500">Certified</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Showcase Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Work Speaks for Itself</h2>
            <p className="text-blue-700 text-lg">
              See the transformation that happens when art meets technology in our professional retouching process.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {beforeAfterShowcase.map((item, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <BeforeAfterComparison
                    beforeImage={item.before}
                    afterImage={item.after}
                    altText={item.title}
                  />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-lg font-bold text-blue-900 text-center">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Values</h2>
            <p className="text-blue-700 text-lg">
              The principles that guide everything we do and define our commitment to excellence.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="text-center p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-blue-700 text-lg">
              Passionate professionals dedicated to bringing your vision to life with unparalleled skill and attention to detail.
            </p>
          </motion.div>

          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-blue-200">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-semibold text-blue-600">{member.experience}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-semibold text-gray-900">{member.specialization}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            {...fadeIn}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
            <p className="text-blue-200 text-lg mb-8">
              Join thousands of satisfied clients who trust EliteRetoucher with their most important images.
              Let's create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
              >
                View Our Services
              </motion.button>
              <motion.button
                onClick={() => navigate('/contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-medium transition-all duration-300"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
