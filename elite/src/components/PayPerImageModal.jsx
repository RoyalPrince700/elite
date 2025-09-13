import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import { FaTimes, FaCreditCard, FaUser, FaBuilding, FaPhone, FaEnvelope, FaMinus, FaPlus } from 'react-icons/fa';

// Toast ID constant for managing single active toast
const PAY_PER_IMAGE_FORM_TOAST_ID = 'pay-per-image-form-toast';

const PayPerImageModal = ({ service, currency = 'USD', onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Currency conversion rates (should match PricingPage)
  const USD_TO_NGN_RATE = 1540;

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

  const convertPrice = (usdPrice) => {
    if (currency === 'NGN') {
      return Math.round(usdPrice * USD_TO_NGN_RATE);
    }
    return usdPrice;
  };

  const getServicePrice = () => {
    if (currency === 'NGN') {
      const override = NGN_PAY_PER_IMAGE_OVERRIDES[service.name];
      if (override && typeof override === 'number') {
        return override;
      }
      return service.price; // Return original price for custom quote services
    }
    return service.price;
  };

  const formatPrice = (price) => {
    if (currency === 'NGN') {
      return `₦${price.toLocaleString()}`;
    }
    return `$${price}`;
  };

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    contactPerson: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
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

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const getTotalPrice = () => {
    return getServicePrice() * quantity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        serviceName: service.name,
        serviceType: service.name,
        quantity: quantity,
        unitPrice: getServicePrice(),
        totalPrice: getTotalPrice(),
        currency: currency,
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        taxId: formData.taxId,
        specialInstructions: formData.specialInstructions,
        requestType: 'pay-per-image'
      };

      const response = await apiService.createPayPerImageRequest(requestData);

      if (response.success) {
        toast.dismiss(PAY_PER_IMAGE_FORM_TOAST_ID);
        toast.success('Pay-per-image request submitted successfully! You will receive an invoice soon.', { toastId: PAY_PER_IMAGE_FORM_TOAST_ID });
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting pay-per-image request:', error);
      toast.dismiss(PAY_PER_IMAGE_FORM_TOAST_ID);
      toast.error('Failed to submit request. Please try again.', { toastId: PAY_PER_IMAGE_FORM_TOAST_ID });
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
              <h2 className="text-2xl font-bold text-gray-900">Order {service?.name}</h2>
              <p className="text-gray-600 mt-1">Fill out the form below to submit your request</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Service Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-blue-900">{service?.name}</h3>
                <p className="text-blue-700 text-sm">{service?.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-700 text-sm">Unit Price</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatPrice(getServicePrice())}
                </p>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <FaPlus className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-700 text-sm">Total Price</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatPrice(getTotalPrice())}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Any special requirements or notes for your images..."
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
                <span>{loading ? 'Submitting...' : `Submit Request - ${formatPrice(getTotalPrice())}`}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayPerImageModal;
