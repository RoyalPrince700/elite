import React, { useState } from 'react';
import { FaImage, FaCalendar, FaUser, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PayPerImageSubscriptionsTab = ({
  payPerImageSubscriptions,
  handleUpdatePayPerImageUsage,
  getStatusColor,
  loading
}) => {
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editForm, setEditForm] = useState({
    imagesUsed: 0
  });

  const handleEditClick = (subscription) => {
    const subscriptionId = subscription._id || subscription.id;

    if (!subscriptionId) {
      console.error('❌ [PayPerImageSubscriptionsTab] subscription has no _id or id field');
      toast.error('Subscription data is invalid - missing ID');
      return;
    }

    setEditingSubscription(subscriptionId);
    setEditForm({
      imagesUsed: subscription.imagesUsed || 0
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingSubscription) {
        console.error('❌ [PayPerImageSubscriptionsTab] editingSubscription is undefined/null');
        toast.error('No subscription selected for editing');
        return;
      }

      // API only expects imagesUsed, not the full form data
      const updateData = {
        imagesUsed: editForm.imagesUsed
      };

      await handleUpdatePayPerImageUsage(editingSubscription, updateData);
      setEditingSubscription(null);
      toast.success('Pay-per-image subscription updated successfully!');
    } catch (error) {
      console.error('Error updating pay-per-image subscription:', error);
      toast.error('Failed to update pay-per-image subscription');
    }
  };

  const handleCancelEdit = () => {
    setEditingSubscription(null);
    setEditForm({ imagesUsed: 0 });
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

  const getServiceTypeColor = (serviceType) => {
    const type = serviceType?.toLowerCase() || '';
    if (type.includes('premium') || type.includes('high-end')) return 'text-purple-600 bg-purple-100';
    if (type.includes('basic') || type.includes('standard')) return 'text-blue-600 bg-blue-100';
    if (type.includes('express') || type.includes('rush')) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading pay-per-image subscriptions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payPerImageSubscriptions.length > 0 ? (
        payPerImageSubscriptions.map((subscription, index) => {
          // Use the correct ID field - MongoDB uses _id, but sometimes it might be id
          const subscriptionId = subscription._id || subscription.id;
          // Fallback to index if ID is missing, but this should not happen after our fixes
          const uniqueKey = subscriptionId || `subscription-${index}`;

          // Warn if we're using fallback key (indicates data issue)
          if (!subscriptionId) {
            console.warn('⚠️ [PayPerImageSubscriptionsTab] Subscription missing ID, using fallback key:', uniqueKey);
          }

          const isEditing = editingSubscription === subscriptionId;

          return (
            <div key={uniqueKey} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaImage className="text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscription.userId?.fullName || 'Unknown User'}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getServiceTypeColor(subscription.serviceType)}`}>
                      {subscription.serviceType || 'Unknown Service'}
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
                        <strong>Purchase Date:</strong><br />
                        {formatDate(subscription.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-gray-400" />
                      <div>
                        <strong>Service:</strong><br />
                        {subscription.serviceName} ({subscription.quantity} images)
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaImage className="text-gray-400" />
                      <div>
                        <strong>Images Used:</strong><br />
                        {subscription.imagesUsed || 0} / {subscription.quantity}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaImage className="text-gray-400" />
                      <div>
                        <strong>Unit Price:</strong><br />
                        ${subscription.unitPrice}
                      </div>
                    </div>
                  </div>

                  {subscription.specialInstructions && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <strong className="text-sm text-gray-700">Special Instructions:</strong>
                      <p className="text-sm text-gray-600 mt-1">{subscription.specialInstructions}</p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <FaCheck className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        <FaTimes className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(subscription)}
                      disabled={!subscriptionId}
                      className={`flex items-center px-3 py-2 text-sm rounded ${
                        subscriptionId
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <FaEdit className="mr-1" />
                      Edit Usage
                    </button>
                  )}
                </div>
              </div>

              {isEditing && subscriptionId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images Used</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={editForm.imagesUsed}
                        onChange={(e) => setEditForm({...editForm, imagesUsed: parseInt(e.target.value) || 0})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max={subscription.quantity}
                      />
                      <span className="text-sm text-gray-500">/ {subscription.quantity} images</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <FaImage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pay-per-image subscriptions</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no active pay-per-image subscriptions.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayPerImageSubscriptionsTab;
