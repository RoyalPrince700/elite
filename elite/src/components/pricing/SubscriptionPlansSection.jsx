import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BillingToggle, CurrencyToggle } from './BillingToggle';

const SubscriptionPlansSection = ({
  fadeIn,
  staggerChildren,
  subscriptionPlans,
  billingCycle,
  setBillingCycle,
  subscriptionCurrency,
  setSubscriptionCurrency,
  NGN_PLAN_OVERRIDES,
  convertPrice,
  formatPrice,
  getPlanPrice,
  getPlanImages,
  handleGetStarted
}) => {
  return (
    <motion.section
      className="mb-20"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <motion.div
        className="text-center mb-12"
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold text-black mb-4">Subscription Plans</h2>
        <p className="text-black max-w-2xl mx-auto">
          Get the best value with our monthly subscription plans. Save up to 69% compared to individual image pricing.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <BillingToggle
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            subscriptionCurrency={subscriptionCurrency}
            setSubscriptionCurrency={setSubscriptionCurrency}
          />

          <CurrencyToggle
            currency={subscriptionCurrency}
            setCurrency={setSubscriptionCurrency}
            type="subscription"
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={staggerChildren}
      >
        {subscriptionPlans.map((plan, index) => {
          const IconComponent = plan.icon;
          return (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className={`relative rounded-2xl shadow-lg overflow-hidden border-2 ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-500'
                  : 'bg-white text-blue-900 border-blue-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg mr-3 ${
                    plan.popular ? 'bg-blue-500' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      plan.popular ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${
                    plan.popular ? 'text-white' : 'text-blue-900'
                  }`}>{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className={`text-4xl font-bold ${
                      plan.popular ? 'text-white' : 'text-blue-900'
                    }`}>
                      {formatPrice(getPlanPrice(plan, billingCycle))}
                    </span>
                    <span className={`ml-2 ${
                      plan.popular ? 'text-blue-200' : 'text-blue-600'
                    }`}>/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className={`mt-1 ${
                    plan.popular ? 'text-blue-100' : 'text-blue-700'
                  }`}>{getPlanImages(plan)} images per month</p>
                  {billingCycle === 'annual' && (
                    <p className={`text-sm mt-1 ${
                      plan.popular ? 'text-green-300' : 'text-green-600'
                    }`}>Save 15% with annual billing</p>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                    plan.popular ? 'text-blue-200' : 'text-blue-600'
                  }`}>Best For</h4>
                  <p className={`${
                    plan.popular ? 'text-blue-100' : 'text-blue-800'
                  }`}>{plan.bestFor}</p>
                </div>

                <div className={`mb-6 p-4 rounded-lg ${
                  plan.popular ? 'bg-blue-500/20' : 'bg-blue-50'
                }`}>
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                    plan.popular ? 'text-blue-200' : 'text-blue-600'
                  }`}>{subscriptionCurrency === 'NGN' ? 'Included Allocation' : 'Value Breakdown'}</h4>
                  {subscriptionCurrency === 'NGN' ? (
                    <div className="space-y-1 text-sm">
                      {NGN_PLAN_OVERRIDES[plan._id]?.breakdown.map((b, i) => (
                        <div key={i} className={`${plan.popular ? 'text-blue-100' : 'text-blue-700'}`}>
                          {b.count} {b.type}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {plan.includes.map((item, i) => {
                        const itemPrice = parseInt(item.value.replace('$', ''));
                        return (
                          <div key={i} className="flex justify-between text-sm">
                            <span className={`${
                              plan.popular ? 'text-blue-100' : 'text-blue-700'
                            }`}>{item.count} {item.type}</span>
                            <span className={`${
                              plan.popular ? 'text-blue-200' : 'text-blue-600'
                            }`}>{formatPrice(convertPrice(itemPrice))}</span>
                          </div>
                        );
                      })}
                      <div className={`border-t pt-2 mt-2 flex justify-between font-semibold ${
                        plan.popular ? 'border-blue-400' : 'border-blue-200'
                      }`}>
                        <span className={`${
                          plan.popular ? 'text-blue-100' : 'text-blue-800'
                        }`}>Retail Value</span>
                        <span className={`${
                          plan.popular ? 'text-white' : 'text-blue-900'
                        }`}>{formatPrice(convertPrice(parseInt(plan.retailValue.replace('$', '').replace(',', ''))))}</span>
                      </div>
                      <div className={`flex justify-between font-semibold ${
                        plan.popular ? 'text-green-300' : 'text-green-600'
                      }`}>
                        <span>You Save</span>
                        <span>{formatPrice(convertPrice(parseInt(plan.savings.replace('$', '').replace(',', '').split(' ')[0])))}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleGetStarted(plan)}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Get Started
                </button>

                <div className={`mt-6 pt-6 border-t ${
                  plan.popular ? 'border-blue-400' : 'border-blue-200'
                }`}>
                  <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                    plan.popular ? 'text-blue-200' : 'text-blue-600'
                  }`}>What's Included</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`p-1 rounded-full mt-0.5 mr-2 flex-shrink-0 ${
                          plan.popular ? 'bg-blue-500' : 'bg-blue-100'
                        }`}>
                          <Check className={`h-3 w-3 ${
                            plan.popular ? 'text-white' : 'text-blue-600'
                          }`} />
                        </div>
                        <span className={`${
                          plan.popular ? 'text-blue-100' : 'text-blue-700'
                        }`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="mt-12 bg-white rounded-xl p-6 max-w-4xl mx-auto border border-blue-200"
        variants={fadeIn}
      >
        <h3 className="text-xl font-semibold text-black mb-4">How Our Subscription Works</h3>
        <p className="text-black">
          With our subscription, you get a set number of professional retouches every month for one flat fee.
          No surprises, no per-image stress. Just upload, we edit, and your images are delivered fast.
          Whether you're a busy photographer or a brand with constant content needs, you'll always have
          fresh, polished images without worrying about extra costs.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Check className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
            <span className="text-black">Mix & match images across Natural, High-End, and Magazine</span>
          </div>
          <div className="flex items-start">
            <Check className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
            <span className="text-black">Up to 20% rollover of unused images to next month</span>
          </div>
          <div className="flex items-start">
            <Check className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
            <span className="text-black">All plans include full commercial usage rights</span>
          </div>
          <div className="flex items-start">
            <Check className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
            <span className="text-black">Priority support for Gold and Diamond subscribers</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SubscriptionPlansSection;
