import React from 'react';
import { FaTimes } from 'react-icons/fa';

const InvoiceModal = ({
  showInvoiceModal,
  setShowInvoiceModal,
  selectedRequest,
  invoiceFormData,
  handleInvoiceFormChange,
  handleInvoiceSubmit,
  sendingInvoice
}) => {
  if (!showInvoiceModal || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send Invoice</h2>
              <p className="text-gray-600 mt-1">Enter payment details for {selectedRequest.companyName}</p>
            </div>
            <button
              onClick={() => setShowInvoiceModal(false)}
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
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-900">
                  {selectedRequest.currency === 'NGN' ? `₦${selectedRequest.finalPrice.toLocaleString()}` : `$${selectedRequest.finalPrice}`}
                </p>
                <p className="text-blue-700 text-sm">per {selectedRequest.billingCycle}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleInvoiceSubmit} className="space-y-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={invoiceFormData.dueDate}
                onChange={handleInvoiceFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    name="paymentDetails.accountNumber"
                    value={invoiceFormData.paymentDetails.accountNumber}
                    onChange={handleInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                  <input
                    type="text"
                    name="paymentDetails.accountName"
                    value={invoiceFormData.paymentDetails.accountName}
                    onChange={handleInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="paymentDetails.bankName"
                    value={invoiceFormData.paymentDetails.bankName}
                    onChange={handleInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Link (Optional)</label>
                  <input
                    type="url"
                    name="paymentDetails.paymentLink"
                    value={invoiceFormData.paymentDetails.paymentLink}
                    onChange={handleInvoiceFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Instructions</label>
                <textarea
                  name="paymentDetails.additionalInstructions"
                  value={invoiceFormData.paymentDetails.additionalInstructions}
                  onChange={handleInvoiceFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional payment instructions..."
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                name="notes"
                value={invoiceFormData.notes}
                onChange={handleInvoiceFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes for the invoice..."
              />
            </div>

            {/* Payment Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Instructions</label>
              <textarea
                name="paymentInstructions"
                value={invoiceFormData.paymentInstructions}
                onChange={handleInvoiceFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="General payment instructions..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!!sendingInvoice}
                className={`px-6 py-2 text-white rounded-md transition-colors ${sendingInvoice ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {sendingInvoice ? 'Sending...' : 'Send Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
