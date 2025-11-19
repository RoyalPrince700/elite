import React, { useState } from 'react';
import { FaCrown, FaCalendar, FaImages, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SubscriptionsTab = ({
  subscriptions,
  handleUpdateSubscription,
  getStatusColor
}) => {
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    imagesUsed: 0,
    imagesLimit: 0,
    subscriptionType: 'subscription'
  });

  const handleEditClick = (subscription) => {
    setEditingSubscription(subscription._id);
    setEditForm({
      status: subscription.status,
      imagesUsed: subscription.imagesUsed,
      imagesLimit: subscription.imagesLimit,
      subscriptionType: subscription.subscriptionType || 'subscription'
    });
  };

  const handleSaveEdit = async () => {
    try {
      await handleUpdateSubscription(editingSubscription, editForm);
      setEditingSubscription(null);
      setEditForm({ status: '', imagesUsed: 0, imagesLimit: 0 });
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubscription(null);
    setEditForm({ status: '', imagesUsed: 0, imagesLimit: 0, subscriptionType: 'subscription' });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const getPlanColor = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('pay-per-image')) return 'text-purple-600 bg-purple-100';
    if (name.includes('gold')) return 'text-yellow-600 bg-yellow-100';
    if (name.includes('silver')) return 'text-gray-600 bg-gray-100';
    if (name.includes('diamond') || name.includes('platinum')) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-4">
      {subscriptions.length > 0 ? (
        subscriptions.map((subscription) => {
          const isEditing = editingSubscription === subscription._id;

          return (
            <div key={subscription._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaCrown className="text-yellow-500" />
                    <h3 className="text-base font-semibold text-gray-900">
                      {subscription.userId?.fullName || 'Unknown User'}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(subscription.planId?.name)}`}>
                      {subscription.planId?.name || 'Unknown Plan'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {subscription.userId?.email} • {subscription.userId?.companyName || 'No company'}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="text-gray-400" />
                      <div>
                        <strong>Start Date:</strong><br />
                        {formatDate(subscription.startDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="text-gray-400" />
                      <div>
                        <strong>{subscription.subscriptionType === 'payPerImage' ? 'Paid Date:' : 'End Date:'}</strong><br />
                        {formatDate(subscription.subscriptionType === 'payPerImage' ? subscription.paidAt : subscription.endDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="text-gray-400" />
                      <div>
                        <strong>{subscription.subscriptionType === 'payPerImage' ? 'Service Type:' : 'Next Billing:'}</strong><br />
                        {subscription.subscriptionType === 'payPerImage' ? subscription.serviceType : formatDate(subscription.nextBillingDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaImages className="text-gray-400" />
                      <div>
                        <strong>Images Used:</strong><br />
                        {isEditing ? (
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={editForm.imagesUsed}
                              onChange={(e) => setEditForm(prev => ({ ...prev, imagesUsed: parseInt(e.target.value) || 0 }))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                              min="0"
                            />
                            <span>/</span>
                            <input
                              type="number"
                              value={editForm.imagesLimit}
                              onChange={(e) => setEditForm(prev => ({ ...prev, imagesLimit: parseInt(e.target.value) || 0 }))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                              min="1"
                            />
                          </div>
                        ) : (
                          <span className={`${(subscription.imagesUsed || 0) >= (subscription.imagesLimit || subscription.planId?.imagesPerMonth || 0) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                            {(subscription.imagesUsed || 0)} / {(subscription.imagesLimit || subscription.planId?.imagesPerMonth || 0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-2">
                    <div>
                      <strong>Billing Cycle:</strong> {subscription.billingCycle || 'One-time'}
                    </div>
                    <div>
                      <strong>Price:</strong> {subscription.currency === 'NGN' ? `₦${subscription.monthlyPrice || subscription.unitPrice}` : `$${subscription.monthlyPrice || subscription.unitPrice}`}
                    </div>
                    <div>
                      <strong>Auto Renew:</strong> {subscription.subscriptionType === 'payPerImage' ? 'N/A' : (subscription.autoRenew ? 'Yes' : 'No')}
                    </div>
                    <div>
                      <strong>Created:</strong> {formatDate(subscription.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      {editForm.subscriptionType === 'subscription' && (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                      {editForm.subscriptionType === 'payPerImage' && (
                        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded">
                          Pay-per-Image subscriptions are always active when paid
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(subscription)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <FaEdit className="text-xs" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <FaCrown className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No subscriptions match your current search and filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsTab;
