import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, Users, Zap, LogIn } from 'lucide-react';
import UserChat from '../components/chat/UserChat';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: '',
    urgency: 'normal'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: ["+234 708 754 6988", "+234 706 736 7631"],
      description: "Active 24/7",
      color: "blue"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: ["eliteretoucher@gmail.com", "Support@eliteretoucher.com"],
      description: "We respond within 2 hours",
      color: "green"
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["Remote"],
      description: "Available worldwide",
      color: "purple"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["24/7 Support"],
      description: "Always available",
      color: "amber"
    }
  ];

  const services = [
    "Natural Retouching",
    "High-End Retouching",
    "Magazine Style",
    "Product Photography",
    "Fashion & Beauty",
    "Commercial Work",
    "Wedding Photography",
    "Other"
  ];

  const urgencyLevels = [
    { value: 'normal', label: 'Normal (2-3 days)', color: 'blue' },
    { value: 'urgent', label: 'Urgent (24 hours)', color: 'amber' },
    { value: 'rush', label: 'Rush (Same day)', color: 'red' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        service: '',
        message: '',
        urgency: 'normal'
      });
    }, 3000);
  };

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
              Get in Touch
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              Let's Create Something <span className="text-blue-700">Amazing Together</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Ready to transform your photos? We'd love to hear about your project.
              Get in touch and let's discuss how we can bring your vision to life.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            >
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 font-medium">Response within 2 hours</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700 font-medium">Fast turnaround times</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${info.color}-500 to-${info.color}-600 rounded-xl flex items-center justify-center mb-4`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
                <p className="text-gray-500 text-xs">{info.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-3xl shadow-2xl p-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Send Us a Message</h2>
                  <p className="text-gray-600">
                    Tell us about your project and we'll get back to you with a personalized quote and timeline.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">We'll get back to you within 2 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="+234 708 754 6988"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Needed</label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="">Select a service</option>
                          {services.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Brief description of your project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        {urgencyLevels.map((level) => (
                          <label key={level.value} className="relative">
                            <input
                              type="radio"
                              name="urgency"
                              value={level.value}
                              checked={formData.urgency === level.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`px-4 py-3 border-2 rounded-lg text-center cursor-pointer transition-all duration-300 ${
                              formData.urgency === level.value
                                ? `border-${level.color}-500 bg-${level.color}-50 text-${level.color}-700`
                                : 'border-gray-300 hover:border-gray-400'
                            }`}>
                              <span className="text-sm font-medium">{level.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell us about your project, timeline, and any specific requirements..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>

              {/* Map & Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Map Placeholder */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-blue-900 mb-2">Our Location</h3>
                        <p className="text-blue-700">Remote<br />Available Worldwide</p>
                      </div>
                    </div>
                    {/* Map would go here in production */}
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-900">Quick Answers</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">How quickly do you respond?</h4>
                      <p className="text-gray-600 text-sm">We respond to all inquiries within 2 hours during business hours.</p>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Do you offer rush services?</h4>
                      <p className="text-gray-600 text-sm">Yes! We offer same-day service for urgent projects.</p>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">What's your typical turnaround time?</h4>
                      <p className="text-gray-600 text-sm">Standard projects: 2-3 business days. Rush: Same day to 24 hours.</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Do you provide free consultations?</h4>
                      <p className="text-gray-600 text-sm">Absolutely! We offer free project consultations and quotes.</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
                  <p className="mb-6 opacity-90">
                    For urgent inquiries or quick questions, give us a call.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="tel:+2347087546988"
                      className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg inline-block"
                    >
                      Call Now: +234 708 754 6988
                    </a>
                    <p className="text-sm opacity-75">Active 24/7</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Message Admin Now Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeIn}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-24 translate-x-24 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100 to-amber-200 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-8 right-8 w-16 h-16 bg-blue-200 rounded-full opacity-20"
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
                className="absolute bottom-8 left-8 w-12 h-12 bg-amber-200 rounded-full opacity-15"
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

              <div className="relative z-10">
                <motion.div
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  Live Support Available
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-blue-900 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Message the Admin <span className="text-blue-700">Now</span>
                </motion.h2>

                <motion.p
                  className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Need immediate assistance or have a quick question? Our admin is available to chat
                  right now. Get instant responses and personalized support for your retouching needs.
                </motion.p>

                {/* Chat Benefits */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-900 mb-2">Instant Response</h4>
                    <p className="text-sm text-blue-700">Get answers within minutes</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-900 mb-2">Direct Support</h4>
                    <p className="text-sm text-green-700">Speak directly with our admin</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-amber-900 mb-2">24/7 Available</h4>
                    <p className="text-sm text-amber-700">Always here when you need us</p>
                  </div>
                </motion.div>

                {/* Chat Trigger Button */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {user ? (
                    <motion.button
                      onClick={() => setShowChat(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageSquare className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                      Start Live Chat
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => navigate('/auth')}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                      Login to Chat
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </motion.button>
                  )}
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <p className="text-sm text-gray-500">
                    💬 Average response time: <span className="font-semibold text-blue-600">2 minutes</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    🎯 Get instant quotes, project updates, and personalized recommendations
                  </p>
                  {!user && (
                    <p className="text-sm text-amber-600 mt-3 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                      🔒 <span className="font-semibold">Login required</span> to access live chat support
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            {...fadeIn}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Start Your Project Today</h2>
            <p className="text-blue-200 text-lg mb-8">
              Ready to see your photos transformed? Let's discuss your vision and create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
              >
                Get Free Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-600 transition-colors shadow-lg"
              >
                View Our Work
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Chat Component */}
      {showChat && (
        <div className="fixed bottom-6 right-6 z-50">
          <UserChat />
        </div>
      )}
    </div>
  );
};

export default Contact;
