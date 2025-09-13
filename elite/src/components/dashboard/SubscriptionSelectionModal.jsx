import React from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const SubscriptionSelectionModal = ({
  showSubscriptionSelection,
  subscriptions,
  onClose,
  onSubscriptionSelect,
  getRemainingUploads
}) => {
  if (!showSubscriptionSelection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Select Subscription</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            You have multiple active subscriptions. Please select which one to use for uploading photos:
          </p>

          <div className="space-y-4">
            {subscriptions
              .map(sub => ({
                ...sub,
                _limit: sub.imagesLimit || sub.planId?.imagesPerMonth || 0,
                _used: sub.imagesUsed || 0
              }))
              .filter(sub => sub.status === 'active' && sub._limit > 0 && sub._used < sub._limit)
              .map((subscription) => (
                <div
                  key={subscription._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => onSubscriptionSelect(subscription)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {subscription.planId?.name || 'Subscription Plan'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {subscription.billingCycle} • {subscription.currency} {subscription.monthlyPrice}/month
                      </p>
                      <div className="flex items-center mt-2 text-sm">
                        <span className="text-gray-600">
                          Used: {subscription._used} / {subscription._limit}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-green-600 font-medium">
                          {getRemainingUploads(subscription)} uploads remaining
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUpload className="text-blue-600 text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSelectionModal;
