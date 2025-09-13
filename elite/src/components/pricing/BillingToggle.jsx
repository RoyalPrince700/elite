import { DollarSign, Coins } from 'lucide-react';

const BillingToggle = ({ billingCycle, setBillingCycle, subscriptionCurrency, setSubscriptionCurrency }) => {
  return (
    <div className="inline-flex bg-gray-200 rounded-lg p-1">
      <button
        className={`px-4 py-2 rounded-md ${billingCycle === 'monthly' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        onClick={() => setBillingCycle('monthly')}
      >
        Monthly Billing
      </button>
      <button
        className={`px-4 py-2 rounded-md ${billingCycle === 'annual' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        onClick={() => setBillingCycle('annual')}
      >
        Annual Billing (Save 15%)
      </button>
    </div>
  );
};

const CurrencyToggle = ({ currency, setCurrency, type = 'subscription' }) => {
  return (
    <div className="inline-flex bg-gray-200 rounded-lg p-1">
      <button
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${currency === 'USD' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        onClick={() => setCurrency('USD')}
      >
        <DollarSign className="h-4 w-4" />
        USD
      </button>
      <button
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${currency === 'NGN' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        onClick={() => setCurrency('NGN')}
      >
        <Coins className="h-4 w-4" />
        NGN
      </button>
    </div>
  );
};

export { BillingToggle, CurrencyToggle };
