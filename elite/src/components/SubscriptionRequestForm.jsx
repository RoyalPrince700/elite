import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

// Toast ID constant for managing single active toast
const SUBSCRIPTION_FORM_TOAST_ID = 'subscription-form-toast';
import { FaTimes, FaCreditCard, FaUser, FaBuilding, FaPhone, FaEnvelope } from 'react-icons/fa';

const SubscriptionRequestForm = ({ plan, currency = 'USD', onClose, onSuccess }) => {
  const { user } = useAuth();

  // Fixed NGN pricing aligned with PricingPage
  const NGN_PLAN_OVERRIDES = {
    'silver-plan': { monthlyPrice: 90000 },
    'gold-plan': { monthlyPrice: 120000 },
    'diamond-plan': { monthlyPrice: 200000 }
  };

  const getPlanPrice = (plan, cycle) => {
    if (currency === 'NGN') {
      const override = NGN_PLAN_OVERRIDES[plan._id];
      if (override) {
        if (cycle === 'yearly') return Math.round(override.monthlyPrice * 12 * 0.85);
        return override.monthlyPrice;
      }
    }
    // For USD, calculate annual price as (monthly * 0.85) * 12 if not already set correctly
    if (cycle === 'monthly') {
      return plan.monthlyPrice;
    } else {
      // Calculate annual price: (monthly price * 15% discount) * 12 months
      const discountedMonthly = plan.monthlyPrice * 0.85;
      return Math.round(discountedMonthly * 12);
    }
  };

  const formatPrice = (price) => {
    if (currency === 'NGN') {
      return `₦${price.toLocaleString()}`;
    }
    return `$${price}`;
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    contactPerson: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    billingCycle: 'monthly',
    specialInstructions: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    taxId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        planId: plan._id,
        billingCycle: formData.billingCycle,
        currency: currency,
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        taxId: formData.taxId,
        specialInstructions: formData.specialInstructions,
        calculatedPrice: getPlanPrice(plan, 'monthly'),
        finalPrice: getPlanPrice(plan, formData.billingCycle),
        usdPrice: formData.billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.monthlyPrice * 0.85 * 12)
      };

      const response = await apiService.createSubscriptionRequest(requestData);

      if (response.success) {
        toast.dismiss(SUBSCRIPTION_FORM_TOAST_ID);
        toast.success('Subscription request submitted successfully! You will receive an invoice soon.', { toastId: SUBSCRIPTION_FORM_TOAST_ID });
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting subscription request:', error);
      toast.dismiss(SUBSCRIPTION_FORM_TOAST_ID);
      toast.error('Failed to submit subscription request. Please try again.', { toastId: SUBSCRIPTION_FORM_TOAST_ID });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Subscribe to {plan?.name}</h2>
              <p className="text-gray-600 mt-1">Fill out the form below to get started</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">{plan?.name}</h3>
                <p className="text-blue-700 text-sm">{plan?.images} images per month</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">
                  {formatPrice(getPlanPrice(plan, formData.billingCycle))}
                </p>
                <p className="text-blue-700 text-sm">per {formData.billingCycle === 'monthly' ? 'month' : 'year'}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="billingCycle"
                    value="monthly"
                    checked={formData.billingCycle === 'monthly'}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Monthly</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="billingCycle"
                    value="yearly"
                    checked={formData.billingCycle === 'yearly'}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yearly (Save 15%)</span>
                </label>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-1" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-1" />
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Billing Address</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID (Optional)</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="For invoicing purposes"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or notes for your subscription..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaCreditCard className="text-sm" />
                )}
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequestForm;
