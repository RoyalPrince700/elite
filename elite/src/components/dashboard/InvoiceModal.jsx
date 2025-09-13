import React from 'react';
import { FaTimes, FaFileInvoiceDollar } from 'react-icons/fa';

// Helper function to check if payment details have any valid (non-empty) values
const hasValidPaymentDetails = (paymentDetails) => {
  if (!paymentDetails || typeof paymentDetails !== 'object') {
    return false;
  }

  // Check if any of the key fields have non-empty values
  const fieldsToCheck = ['accountNumber', 'accountName', 'bankName', 'paymentLink', 'additionalInstructions'];

  return fieldsToCheck.some(field => {
    const value = paymentDetails[field];
    return value && typeof value === 'string' && value.trim().length > 0;
  });
};

const InvoiceModal = ({
  showInvoiceModal,
  selectedInvoice,
  onClose,
  onPaymentStatusUpdate
}) => {
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

  if (!showInvoiceModal || !selectedInvoice) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
              <p className="text-gray-600 mt-1">Invoice #{selectedInvoice.invoiceNumber || selectedInvoice._id.slice(-8)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Invoice Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Amount Due</h3>
                <p className="text-blue-700 text-sm">Due by {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-900">
                  {selectedInvoice.currency === 'NGN' ? `₦${selectedInvoice.amount.toLocaleString()}` : `$${selectedInvoice.amount}`}
                </p>
                <p className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(selectedInvoice.status)}`}>
                  {selectedInvoice.status === 'payment_made' ? 'Awaiting Confirmation' :
                   selectedInvoice.status === 'payment_confirmed' ? 'Payment Confirmed' :
                   selectedInvoice.status}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Details</h3>


            {selectedInvoice.paymentDetails && hasValidPaymentDetails(selectedInvoice.paymentDetails) ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInvoice.paymentDetails.accountNumber && selectedInvoice.paymentDetails.accountNumber.trim() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Number</label>
                      <p className="text-gray-900 font-mono">{selectedInvoice.paymentDetails.accountNumber}</p>
                    </div>
                  )}
                  {selectedInvoice.paymentDetails.accountName && selectedInvoice.paymentDetails.accountName.trim() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Name</label>
                      <p className="text-gray-900">{selectedInvoice.paymentDetails.accountName}</p>
                    </div>
                  )}
                  {selectedInvoice.paymentDetails.bankName && selectedInvoice.paymentDetails.bankName.trim() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                      <p className="text-gray-900">{selectedInvoice.paymentDetails.bankName}</p>
                    </div>
                  )}
                  {selectedInvoice.paymentDetails.paymentLink && selectedInvoice.paymentDetails.paymentLink.trim() && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Link</label>
                      <a
                        href={selectedInvoice.paymentDetails.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Click here to pay
                      </a>
                    </div>
                  )}
                </div>
                {selectedInvoice.paymentDetails.additionalInstructions && selectedInvoice.paymentDetails.additionalInstructions.trim() && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Instructions</label>
                    <p className="text-gray-700">{selectedInvoice.paymentDetails.additionalInstructions}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">No payment details available for this invoice.</p>
              </div>
            )}
          </div>

          {/* Payment Instructions */}
          {selectedInvoice.paymentInstructions && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Instructions</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700">{selectedInvoice.paymentInstructions}</p>
              </div>
            </div>
          )}

          {/* Invoice Items */}
          {selectedInvoice.invoiceItems && selectedInvoice.invoiceItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Invoice Items</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {selectedInvoice.invoiceItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-900">{item.description}</span>
                    <span className="font-semibold text-gray-900">
                      {selectedInvoice.currency === 'NGN'
                        ? `₦${(item.total || (item.quantity * item.unitPrice)).toLocaleString()}`
                        : `$${item.total || (item.quantity * item.unitPrice)}`
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
            {selectedInvoice.status === 'sent' && (
              <button
                onClick={() => {
                  onPaymentStatusUpdate(selectedInvoice._id, 'payment_made');
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
