import React from 'react';
import { FaCreditCard, FaFileInvoiceDollar, FaEye, FaRedo, FaSync } from 'react-icons/fa';

// Plan breakdown mapping based on pricing tiers
const planBreakdowns = {
  'Silver Plan': 'Up to 10 Natural, 8 High-End, 2 Magazine',
  'Gold Plan': 'Up to 30 Natural, 25 High-End, 5 Magazine',
  'Diamond Plan': 'Up to 75 Natural, 60 High-End, 15 Magazine'
};

const SubscriptionBilling = ({
  subscriptions,
  invoices,
  paymentReceipts,
  onViewInvoice,
  onPaymentStatusUpdate,
  onRefreshSubscriptions
}) => {
  const getPlanBreakdown = (planName) => {
    if (planName && planName.includes('Pay-per-Image')) {
      return 'Pay-per-image service';
    }
    return planBreakdowns[planName] || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'viewed': return 'text-purple-600 bg-purple-100';
      case 'payment_made': return 'text-orange-600 bg-orange-100';
      case 'payment_confirmed': return 'text-green-600 bg-green-100';
      case 'paid': return 'text-green-700 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if ((!subscriptions || subscriptions.length === 0) && invoices.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Subscription & Billing</h2>
        <div className="flex items-center space-x-3">
          <a
            href="/subscriptions"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Subscriptions →
          </a>
          {onRefreshSubscriptions && (
            <button
              onClick={onRefreshSubscriptions}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
              title="Refresh subscriptions"
            >
              <FaSync className="mr-1" />
              Refresh
            </button>
          )}
          <FaCreditCard className="text-gray-400" />
        </div>
      </div>

      {subscriptions && subscriptions.length > 0 ? (
        <div className="space-y-6">
          {subscriptions.map((subscription, index) => {
            const limit = subscription.imagesLimit || subscription.planId?.imagesPerMonth || 0;
            const used = subscription.imagesUsed || 0;
            const isExhausted = subscription.status === 'active' && used >= limit && limit > 0;

            return (
              <div key={subscription._id} className={`border rounded-lg p-4 ${
                isExhausted ? 'border-red-200 bg-red-50' :
                subscription.status === 'active' ? 'border-green-200 bg-green-50' :
                'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    {isExhausted ? 'Plan Exhausted' :
                     subscription.status === 'active' ? 'Active Subscription' :
                     'Subscription'}
                    {subscriptions.length > 3 && <span className="text-sm text-gray-500 ml-2">({index + 1} of {subscriptions.length})</span>}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {isExhausted && (
                      <a
                        href="/pricing"
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center"
                      >
                        <FaRedo className="inline mr-1" />
                        Renew
                      </a>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isExhausted ? 'text-red-600 bg-red-100' :
                      subscription.status === 'active' ? 'text-green-600 bg-green-100' :
                      subscription.status === 'inactive' ? 'text-gray-600 bg-gray-100' :
                      subscription.status === 'cancelled' ? 'text-red-600 bg-red-100' :
                      'text-yellow-600 bg-yellow-100'
                    }`}>
                      {isExhausted ? 'Exhausted' : subscription.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Plan Details</h4>
                    <p className="text-xl font-bold text-blue-600">{subscription.planId?.name || 'N/A'}</p>
                    {getPlanBreakdown(subscription.planId?.name) && (
                      <p className="text-sm text-gray-700 mt-1 font-medium">
                        {getPlanBreakdown(subscription.planId?.name)}
                      </p>
                    )}
                    <p className={`text-sm mt-1 ${isExhausted ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {used} / {limit} images used
                      {isExhausted && <span className="ml-2 text-red-500">⚠️ Limit reached</span>}
                    </p>
                    <p className="text-sm text-gray-600">
                      Billing: {subscription.billingCycle || (subscription.subscriptionType === 'payPerImage' ? 'one-time' : 'monthly')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {subscription.subscriptionType === 'payPerImage' ? 'Payment Info' : 'Next Billing'}
                    </h4>
                    {subscription.subscriptionType === 'payPerImage' ? (
                      <>
                        <p className="text-lg font-semibold text-gray-900">
                          One-time Payment
                        </p>
                        <p className="text-sm text-gray-600">
                          Paid on {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </p>
                      </>
                    ) : isExhausted ? (
                      <p className="text-sm text-red-600 font-medium">
                        Renew to continue uploading
                      </p>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-gray-900">
                          {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </p>
                        {subscription.nextBillingDate && subscription.status === 'active' && (
                          <p className="text-sm text-gray-600">
                            {(() => {
                              const today = new Date();
                              const nextBilling = new Date(subscription.nextBillingDate);
                              const diffTime = nextBilling - today;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                              if (diffDays === 0) {
                                return 'Due today';
                              } else if (diffDays === 1) {
                                return 'Due tomorrow';
                              } else if (diffDays > 0) {
                                return `Due in ${diffDays} days`;
                              } else {
                                return 'Overdue';
                              }
                            })()}
                          </p>
                        )}
                      </>
                    )}
                    <p className="text-sm text-gray-600">
                      {subscription.currency === 'NGN' ? `₦${(subscription.monthlyPrice || subscription.planId?.monthlyPrice || subscription.unitPrice || 0).toLocaleString()}` : `$${subscription.monthlyPrice || subscription.planId?.monthlyPrice || subscription.unitPrice || 0}`} / {subscription.billingCycle || (subscription.subscriptionType === 'payPerImage' ? 'one-time' : 'month')}
                    </p>
                  </div>
                </div>

                {isExhausted && (
                  <div className="mt-4 bg-red-100 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">⚠️</span>
                        <span className="text-red-800 font-medium text-sm">Upload limit reached for this plan</span>
                      </div>
                      <a
                        href="/pricing"
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center"
                      >
                        <FaRedo className="inline mr-1" />
                        Renew Now
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaCreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No active subscription</h3>
          <p className="mt-1 text-sm text-gray-500">
            Subscribe to a plan to start uploading photos.
          </p>
          <a
            href="/pricing"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            View Plans
          </a>
        </div>
      )}

      {invoices.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-4">Recent Invoices</h3>
          <div className="space-y-2">
            {invoices.slice(0, 3).map((invoice) => {
              const hasPaymentReceipt = paymentReceipts.some(receipt => receipt.invoiceId === invoice._id);
              return (
                <div key={invoice._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaFileInvoiceDollar className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Invoice #{invoice.invoiceNumber || invoice._id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {invoice.currency === 'NGN' ? `₦${invoice.amount.toLocaleString()}` : `$${invoice.amount}`}
                      </p>
                      <p className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status === 'payment_made' ? 'Awaiting Confirmation' :
                         invoice.status === 'payment_confirmed' ? 'Payment Confirmed' :
                         invoice.status}
                      </p>
                    </div>
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <FaEye className="inline mr-1" />
                      View
                    </button>
                    {invoice.status === 'sent' && !hasPaymentReceipt && (
                      <button
                        onClick={() => onPaymentStatusUpdate(invoice._id, 'payment_made')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                    {hasPaymentReceipt && (
                      <span className="text-sm text-blue-600 font-medium">Payment Submitted</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionBilling;
