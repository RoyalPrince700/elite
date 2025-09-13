import React from 'react';
import { FaTimes } from 'react-icons/fa';

const PayPerImageInvoiceModal = ({
  showPayPerImageInvoiceModal,
  setShowPayPerImageInvoiceModal,
  selectedRequest,
  payPerImageInvoiceFormData,
  handlePayPerImageInvoiceFormChange,
  handlePayPerImageInvoiceSubmit,
  sendingPayPerImageInvoice
}) => {
  if (!showPayPerImageInvoiceModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Pay-Per-Image Invoice</h2>
              <p className="text-gray-600 mt-1">Enter payment details for {selectedRequest.companyName}</p>
            </div>
            <button
              onClick={() => setShowPayPerImageInvoiceModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Invoice Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">{selectedRequest.companyName}</h3>
                <p className="text-blue-700 text-sm">{selectedRequest.contactPerson}</p>
                <p className="text-blue-700 text-sm">{selectedRequest.email}</p>
                <p className="text-blue-700 text-sm">{selectedRequest.serviceName}</p>
                <p className="text-blue-700 text-sm">Quantity: {selectedRequest.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">
                  {selectedRequest.currency === 'NGN' ? `₦${selectedRequest.totalPrice.toLocaleString()}` : `$${selectedRequest.totalPrice}`}
                </p>
                <p className="text-blue-700 text-sm">Total Price</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlePayPerImageInvoiceSubmit} className="space-y-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={payPerImageInvoiceFormData.dueDate}
                onChange={handlePayPerImageInvoiceFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="paymentDetails.accountNumber"
                    value={payPerImageInvoiceFormData.paymentDetails.accountNumber}
                    onChange={handlePayPerImageInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="paymentDetails.accountName"
                    value={payPerImageInvoiceFormData.paymentDetails.accountName}
                    onChange={handlePayPerImageInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="paymentDetails.bankName"
                    value={payPerImageInvoiceFormData.paymentDetails.bankName}
                    onChange={handlePayPerImageInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="paymentDetails.paymentLink"
                    value={payPerImageInvoiceFormData.paymentDetails.paymentLink}
                    onChange={handlePayPerImageInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Instructions
                </label>
                <textarea
                  name="paymentDetails.additionalInstructions"
                  value={payPerImageInvoiceFormData.paymentDetails.additionalInstructions}
                  onChange={handlePayPerImageInvoiceFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional payment instructions..."
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Notes
              </label>
              <textarea
                name="notes"
                value={payPerImageInvoiceFormData.notes}
                onChange={handlePayPerImageInvoiceFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes for the invoice..."
              />
            </div>

            {/* Payment Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Instructions
              </label>
              <textarea
                name="paymentInstructions"
                value={payPerImageInvoiceFormData.paymentInstructions}
                onChange={handlePayPerImageInvoiceFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instructions for making payment..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowPayPerImageInvoiceModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingPayPerImageInvoice}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {sendingPayPerImageInvoice ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaTimes className="text-sm" />
                )}
                <span>{sendingPayPerImageInvoice ? 'Sending...' : 'Send Invoice'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayPerImageInvoiceModal;
