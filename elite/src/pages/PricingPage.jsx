import { useState } from 'react';
import { motion } from 'framer-motion';
import SubscriptionRequestForm from '../components/SubscriptionRequestForm';
import PayPerImageModal from '../components/PayPerImageModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Crown,
  Image,
  Settings,
  Download,
  BarChart3,
  Shield
} from 'lucide-react';
import PricingHero from '../components/pricing/PricingHero';
import PricingTabs from '../components/pricing/PricingTabs';
import SubscriptionPlansSection from '../components/pricing/SubscriptionPlansSection';
import PayPerImageSection from '../components/pricing/PayPerImageSection';
import PricingFAQ from '../components/pricing/PricingFAQ';
import PricingCTA from '../components/pricing/PricingCTA';
import PricingFooter from '../components/pricing/PricingFooter';

const PricingPage = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeTab, setActiveTab] = useState('subscription');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showPayPerImageModal, setShowPayPerImageModal] = useState(false);
  const [subscriptionCurrency, setSubscriptionCurrency] = useState('USD'); // USD or NGN for subscription plans
  const [payPerImageCurrency, setPayPerImageCurrency] = useState('USD'); // USD or NGN for pay-per-image services

  // Currency conversion rates (approximate as of 2024)
  // Note: These rates should be updated periodically for accuracy
  const USD_TO_NGN_RATE = 1540; // 1 USD ≈ 1540 NGN
  const NGN_TO_USD_RATE = 1 / USD_TO_NGN_RATE;

  // Fixed NGN pricing and breakdowns per plan
  const NGN_PLAN_OVERRIDES = {
    'silver-plan': {
      monthlyPrice: 90000,
      images: 30,
      breakdown: [
        { type: 'Basic', count: 20 },
        { type: 'Pro', count: 5 },
        { type: 'Highend', count: 5 }
      ]
    },
    'gold-plan': {
      monthlyPrice: 120000,
      images: 60,
      breakdown: [
        { type: 'Basic', count: 30 },
        { type: 'Pro', count: 20 },
        { type: 'Highend', count: 10 }
      ]
    },
    'diamond-plan': {
      monthlyPrice: 200000,
      images: 150,
      breakdown: [
        { type: 'Basic', count: 70 },
        { type: 'Pro', count: 60 },
        { type: 'Highend', count: 20 }
      ]
    }
  };

  // Fixed NGN pricing for pay-per-image services
  const NGN_PAY_PER_IMAGE_OVERRIDES = {
    "Natural Retouch (Basic)": 3000,
    "High-End Retouch (Premium)": 5000,
    "Magazine Retouch (Luxury)": 7000,
    "Basic Product": 3000,
    "Premium Product": 5000,
    "Campaign Ready": 7000,
    "Advanced composites & manipulations": "Custom Quote"
  };

  // Currency conversion utility for subscription plans
  const convertPrice = (usdPrice, useSubscriptionCurrency = true) => {
    const currentCurrency = useSubscriptionCurrency ? subscriptionCurrency : payPerImageCurrency;
    if (currentCurrency === 'NGN') {
      return Math.round(usdPrice * USD_TO_NGN_RATE);
    }
    return usdPrice;
  };

  const formatPrice = (price, useSubscriptionCurrency = true) => {
    const currentCurrency = useSubscriptionCurrency ? subscriptionCurrency : payPerImageCurrency;
    if (currentCurrency === 'NGN') {
      return `₦${price.toLocaleString()}`;
    }
    return `$${price}`;
  };

  const formatCurrencySymbol = (useSubscriptionCurrency = true) => {
    const currentCurrency = useSubscriptionCurrency ? subscriptionCurrency : payPerImageCurrency;
    return currentCurrency === 'NGN' ? '₦' : '$';
  };

  const getPlanPrice = (plan, cycle) => {
    if (subscriptionCurrency === 'NGN') {
      const override = NGN_PLAN_OVERRIDES[plan._id];
      if (override) {
        if (cycle === 'annual') {
          return Math.round(override.monthlyPrice * 12 * 0.85);
        }
        return override.monthlyPrice;
      }
    }
    return cycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getPlanImages = (plan) => {
    const override = NGN_PLAN_OVERRIDES[plan._id];
    return subscriptionCurrency === 'NGN' && override ? override.images : plan.images;
  };

  const getPayPerImagePrice = (service) => {
    if (payPerImageCurrency === 'NGN') {
      const override = NGN_PAY_PER_IMAGE_OVERRIDES[service.name];
      if (override && typeof override === 'number') {
        return override;
      }
      return service.price; // Return original price for custom quote services
    }
    return service.price;
  };

  const subscriptionPlans = [
    {
      _id: "silver-plan",
      name: "Silver Plan",
      monthlyPrice: 97,
      annualPrice: 989, // (97 * 0.85) * 12 = 82.45 * 12 = 989.4
      images: 20,
      bestFor: "Freelancers, new photographers",
      notes: "Entry-level option to try the service.",
      popular: false,
      savings: "$163 (~14% off)", // 97*12 - 989 = 1164 - 989 = 175, but showing effective savings
      effectiveRate: "$4.11/image", // 989/12/20 = 4.11
      retailValue: "$170",
      includes: [
        { type: "Natural", count: 10, value: "$50" },
        { type: "High-End", count: 8, value: "$80" },
        { type: "Magazine", count: 2, value: "$40" },
      ],
      features: [
        "Basic color correction",
        "Exposure adjustments",
        "Background cleanup",
        "Skin smoothing",
        "5-day turnaround time"
      ],
      icon: Star,
      color: "gray"
    },
    {
      _id: "gold-plan",
      name: "Gold Plan",
      monthlyPrice: 197,
      annualPrice: 2010, // (197 * 0.85) * 12 = 167.45 * 12 = 2009.4
      images: 60,
      bestFor: "Busy portrait & fashion photographers",
      notes: "Highlight as Best Value.",
      popular: true,
      savings: "$366 (~15% off)", // 197*12 - 2010 = 2364 - 2010 = 354, but showing effective savings
      effectiveRate: "$2.79/image", // 2010/12/60 = 2.79
      retailValue: "$500",
      includes: [
        { type: "Natural", count: 30, value: "$150" },
        { type: "High-End", count: 25, value: "$250" },
        { type: "Magazine", count: 5, value: "$100" },
      ],
      features: [
        "All Silver features",
        "Advanced retouching",
        "Detail enhancement",
        "Object removal",
        "2-day turnaround time",
        "Priority support"
      ],
      icon: Zap,
      color: "amber"
    },
    {
      _id: "diamond-plan",
      name: "Diamond Plan",
      monthlyPrice: 397,
      annualPrice: 4050, // (397 * 0.85) * 12 = 337.45 * 12 = 4049.4
      images: 150,
      bestFor: "Brands, agencies, studios",
      notes: "High-volume plan, premium option.",
      popular: false,
      savings: "$726 (~15% off)", // 397*12 - 4050 = 4764 - 4050 = 714, but showing effective savings
      effectiveRate: "$2.25/image", // 4050/12/150 = 2.25
      retailValue: "$1,275",
      includes: [
        { type: "Natural", count: 75, value: "$375" },
        { type: "High-End", count: 60, value: "$600" },
        { type: "Magazine", count: 15, value: "$300" },
      ],
      features: [
        "All Gold features",
        "Premium retouching",
        "Complex edits",
        "Unlimited revisions",
        "Same-day turnaround",
        "Dedicated account manager",
        "Custom workflow integration"
      ],
      icon: Crown,
      color: "blue"
    }
  ];

  const payPerImageServices = [
    {
      category: "Portrait / Beauty Retouching",
      services: [
        { name: "Natural Retouch (Basic)", price: 5, desc: "simple clean-up, natural skin", icon: Image },
        { name: "High-End Retouch (Premium)", price: 10, desc: "detailed skin, tones, pro look", icon: Settings },
        { name: "Magazine Retouch (Luxury)", price: 20, desc: "editorial-level polish, advanced techniques", icon: Crown }
      ]
    },
    {
      category: "E-Commerce / Product Retouching",
      services: [
        { name: "Basic Product", price: 5, desc: "background removal + color correction", icon: Download },
        { name: "Premium Product", price: 10, desc: "background removal + shadows/reflections", icon: BarChart3 },
        { name: "Campaign Ready", price: 20, desc: "creative retouch, composites, lifestyle polish", icon: Zap }
      ]
    },
    {
      category: "Creative / Manipulation",
      services: [
        { name: "Advanced composites & manipulations", price: "Custom Quote", desc: "starts from $25/image", icon: Shield }
      ]
    }
  ];

  const faqData = [
    {
      id: 'subscription-work',
      question: 'How does the subscription work?',
      answer: 'Each month, you get a fresh allocation of images based on your plan. You can use these images for any of our retouching services, following the limits for each service type. Unused images can roll over up to 20% to the next month.'
    },
    {
      id: 'who-for',
      question: 'Who are these plans for?',
      answer: 'Our subscription plans aren\'t just for photographers — e-commerce brands, modeling agencies, and creative studios use EliteRetoucher to handle all their image needs every month.'
    },
    {
      id: 'turnaround-time',
      question: 'What\'s the turnaround time?',
      answer: 'Silver plan: 5 business days, Gold plan: 2-3 business days, Diamond plan: Same-day turnaround available. Rush services are available for an additional fee.'
    },
    {
      id: 'change-cancel',
      question: 'Can I change or cancel my plan?',
      answer: 'You can upgrade your plan at any time. To cancel, we require 30 days notice. Annual plans can be canceled with a prorated refund.'
    }
  ];

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleGetStarted = (plan) => {
    if (!user) {
      toast.dismiss();
      toast.info('Please sign in to subscribe to a plan', { toastId: 'pricing-page-toast' });
      return;
    }
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPlan(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPlan(null);
  };

  const handlePayPerImageGetStarted = (service) => {
    if (!user) {
      toast.dismiss();
      toast.info('Please sign in to order images', { toastId: 'pricing-page-toast' });
      return;
    }
    setSelectedService(service);
    setShowPayPerImageModal(true);
  };

  const handlePayPerImageFormSuccess = () => {
    setShowPayPerImageModal(false);
    setSelectedService(null);
  };

  const handlePayPerImageFormClose = () => {
    setShowPayPerImageModal(false);
    setSelectedService(null);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-24">
      <main className="container mx-auto px-4 py-12 mt-24">
        {/* Hero Section */}
        <PricingHero fadeIn={fadeIn} />

        {/* Pricing Tabs */}
        <PricingTabs activeTab={activeTab} setActiveTab={setActiveTab} fadeIn={fadeIn} />

        {/* Subscription Plans */}
        {activeTab === 'subscription' && (
          <SubscriptionPlansSection
            fadeIn={fadeIn}
            staggerChildren={staggerChildren}
            subscriptionPlans={subscriptionPlans}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            subscriptionCurrency={subscriptionCurrency}
            setSubscriptionCurrency={setSubscriptionCurrency}
            NGN_PLAN_OVERRIDES={NGN_PLAN_OVERRIDES}
            convertPrice={convertPrice}
            formatPrice={formatPrice}
            getPlanPrice={getPlanPrice}
            getPlanImages={getPlanImages}
            handleGetStarted={handleGetStarted}
          />
        )}

        {/* Pay Per Image Services */}
        {activeTab === 'pay-per-image' && (
          <PayPerImageSection
            fadeIn={fadeIn}
            staggerChildren={staggerChildren}
            payPerImageServices={payPerImageServices}
            payPerImageCurrency={payPerImageCurrency}
            setPayPerImageCurrency={setPayPerImageCurrency}
            formatPrice={formatPrice}
            getPayPerImagePrice={getPayPerImagePrice}
            handlePayPerImageGetStarted={handlePayPerImageGetStarted}
          />
        )}

        {/* FAQ Section */}
        <PricingFAQ
          fadeIn={fadeIn}
          faqData={faqData}
          expandedFAQ={expandedFAQ}
          toggleFAQ={toggleFAQ}
        />

        {/* CTA Section */}
        <PricingCTA fadeIn={fadeIn} />
      </main>

      {/* Footer */}
      <PricingFooter />

      {/* Subscription Request Form Modal */}
      {showForm && selectedPlan && (
        <SubscriptionRequestForm
          plan={selectedPlan}
          currency={subscriptionCurrency}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Pay Per Image Modal */}
      {showPayPerImageModal && selectedService && (
        <PayPerImageModal
          service={selectedService}
          currency={payPerImageCurrency}
          onClose={handlePayPerImageFormClose}
          onSuccess={handlePayPerImageFormSuccess}
        />
      )}
    </div>
  );
};

export default PricingPage;