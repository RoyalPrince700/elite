import React from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const ReceiptUploadModal = ({
  showReceiptModal,
  onClose,
  receiptData,
  onInputChange,
  onSubmit,
  submittingReceipt
}) => {
  if (!showReceiptModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upload Payment Receipt</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={receiptData.paymentMethod}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Transaction Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference</label>
              <input
                type="text"
                name="transactionReference"
                value={receiptData.transactionReference}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction reference"
                required
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={receiptData.paymentDate}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* File Upload or Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Document</label>

              {/* File Upload */}
              <div className="mb-3">
                <input
                  type="file"
                  name="receiptFile"
                  onChange={onInputChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={receiptData.receiptLink}
                />
                <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG, or PDF file (max 10MB)</p>
              </div>

              {/* Or Link */}
              <div className="text-center text-gray-500 text-sm mb-3">- OR -</div>
              <input
                type="url"
                name="receiptLink"
                value={receiptData.receiptLink}
                onChange={onInputChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={receiptData.receiptFile}
              />
              <p className="text-xs text-gray-500 mt-1">Provide a link to your receipt</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                value={receiptData.notes}
                onChange={onInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information about your payment..."
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
                className={`px-6 py-2 text-white rounded-md transition-colors flex items-center space-x-2 ${
                  submittingReceipt
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={submittingReceipt || (!receiptData.receiptFile && !receiptData.receiptLink)}
              >
                {submittingReceipt && <FaSpinner className="animate-spin text-sm" />}
                <span>{submittingReceipt ? 'Submitting...' : 'Submit Receipt'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUploadModal;
