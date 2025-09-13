import React, { useState } from 'react';
import { FaCamera, FaHistory, FaFileInvoiceDollar, FaDownload, FaUpload, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const QuickActions = ({ subscriptions = [], onPhotoUpload }) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Check if user has active subscriptions
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const withDerivedLimits = activeSubscriptions.map(sub => ({
    ...sub,
    _limit: sub.imagesLimit || sub.planId?.imagesPerMonth || 0,
    _used: sub.imagesUsed || 0
  }));
  const hasActiveSubscriptions = activeSubscriptions.length > 0;

  // Get subscriptions with remaining uploads (not exhausted)
  const availableSubscriptions = withDerivedLimits.filter(sub => sub._limit > 0 && sub._used < sub._limit);
  const hasAvailableSubscriptions = availableSubscriptions.length > 0;

  // Check if all plans are exhausted
  const allPlansExhausted = hasActiveSubscriptions && !hasAvailableSubscriptions;

  const handleUploadClick = () => {
    if (!hasActiveSubscriptions) {
      toast.error('You need an active subscription to upload photos. Please subscribe to a plan first.', {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    if (!hasAvailableSubscriptions) {
      const exhaustedSubscriptions = withDerivedLimits.filter(sub => sub._limit > 0 && sub._used >= sub._limit);
      const planNames = exhaustedSubscriptions.map(sub => sub.planId?.name || 'Unknown Plan').join(', ');

      toast.error(`You have reached your upload limit for all plans: ${planNames}. Please renew your subscription or upgrade your plan.`, {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    if (availableSubscriptions.length === 1) {
      // Single available subscription - proceed directly
      handleSubscriptionSelection(availableSubscriptions[0]);
    } else {
      // Multiple available subscriptions - show selection modal
      setShowSubscriptionModal(true);
    }
  };

  const handleSubscriptionSelection = (subscription) => {
    setSelectedSubscription(subscription);
    setShowSubscriptionModal(false);

    // Redirect to WeTransfer with subscription context
    const wetransferUrl = 'https://eliteretoucher.wetransfer.com/';
    window.open(wetransferUrl, '_blank');

    toast.success(`Redirecting to upload portal for ${subscription.planId?.name || 'your plan'}`, {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const getSubscriptionStatusText = (subscription) => {
    const limit = subscription._limit ?? subscription.imagesLimit ?? subscription.planId?.imagesPerMonth ?? 0;
    const used = subscription._used ?? subscription.imagesUsed ?? 0;
    const remaining = Math.max(0, limit - used);
    if (limit > 0 && remaining <= 0) {
      return `Plan exhausted (${used}/${limit})`;
    }
    if (limit === 0) {
      return `0 uploads available`;
    }
    return `${remaining} uploads remaining`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

        <div className="space-y-3">
          <button
            onClick={handleUploadClick}
            disabled={!hasAvailableSubscriptions}
            className={`w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-colors ${
              !hasAvailableSubscriptions
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FaCamera className={`${
                !hasAvailableSubscriptions ? 'text-gray-400' : 'text-blue-600'
              }`} />
              <div className="text-left">
                <span className={`font-medium ${
                  !hasAvailableSubscriptions ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  Upload New Photos
                </span>
                {hasAvailableSubscriptions && (
                  <p className="text-xs text-gray-500 mt-1">
                    {availableSubscriptions.length === 1
                      ? getSubscriptionStatusText(availableSubscriptions[0])
                      : `${availableSubscriptions.length} active plans available`
                    }
                  </p>
                )}
                {allPlansExhausted && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    All plan limits reached
                  </p>
                )}
                {!hasActiveSubscriptions && (
                  <p className="text-xs text-gray-500 mt-1">
                    Subscription required
                  </p>
                )}
              </div>
            </div>
            <FaUpload className={`${
              !hasAvailableSubscriptions ? 'text-gray-400' : 'text-gray-400'
            }`} />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FaHistory className="text-green-600" />
              <span className="font-medium text-gray-900">View Order History</span>
            </div>
            <FaHistory className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FaFileInvoiceDollar className="text-purple-600" />
              <span className="font-medium text-gray-900">View Invoices</span>
            </div>
            <FaFileInvoiceDollar className="text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FaDownload className="text-indigo-600" />
              <span className="font-medium text-gray-900">Download Center</span>
            </div>
            <FaDownload className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Subscription Selection Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Select Subscription Plan
            </h3>
            <p className="text-gray-600 mb-4">
              Choose which subscription plan you'd like to use for uploading photos:
            </p>

            <div className="space-y-3 mb-6">
              {availableSubscriptions.map((subscription) => (
                <button
                  key={subscription._id}
                  onClick={() => handleSubscriptionSelection(subscription)}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {subscription.planId?.name || 'Unknown Plan'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {getSubscriptionStatusText(subscription)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ${subscription.monthlyPrice}/{subscription.billingCycle}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
