import React from 'react';
import { FaFileInvoiceDollar, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const InvoicesTab = ({
  invoices,
  paymentReceipts,
  handleConfirmPayment,
  setActiveTab,
  getStatusColor,
  confirmingPayments
}) => {
  return (
    <div className="space-y-4">
      {invoices.length > 0 ? (
        invoices.map((invoice) => {
          // Check if there's a payment receipt for this invoice
          const hasReceipt = paymentReceipts.some(receipt =>
            receipt.invoiceId === invoice._id || receipt.invoiceId?._id === invoice._id
          );

          // Get receipt status if exists
          const receipt = paymentReceipts.find(r =>
            r.invoiceId === invoice._id || r.invoiceId?._id === invoice._id
          );

          return (
            <div key={invoice._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FaFileInvoiceDollar className="text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Invoice #{invoice.invoiceNumber || invoice._id.slice(-8)}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    {/* Receipt status indicator */}
                    {invoice.status === 'payment_made' && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        hasReceipt ? 'text-blue-600 bg-blue-100' : 'text-orange-600 bg-orange-100'
                      }`}>
                        {hasReceipt ? 'Receipt Submitted' : 'No Receipt'}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Amount:</strong> {invoice.currency === 'NGN' ? `₦${invoice.amount.toLocaleString()}` : `$${invoice.amount}`}
                      {/* Debug: Currency: {invoice.currency}, Amount: {invoice.amount} */}
                    </div>
                    <div>
                      <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>User:</strong> {invoice.userId?.email || 'N/A'}
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(invoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Receipt warning */}
                  {invoice.status === 'payment_made' && !hasReceipt && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FaExclamationTriangle className="text-orange-600 text-sm" />
                        <span className="text-sm text-orange-800 font-medium">
                          No payment receipt submitted yet
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Please check the Payment Receipts tab to verify the payment before confirming.
                      </p>
                    </div>
                  )}

                  {/* Receipt info if exists */}
                  {hasReceipt && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaFileInvoiceDollar className="text-blue-600 text-sm" />
                        <span className="text-sm text-blue-800 font-medium">
                          Payment Receipt Status: {receipt?.status || 'Unknown'}
                        </span>
                      </div>
                      {receipt?.status === 'submitted' && (
                        <p className="text-sm text-blue-700">
                          Receipt submitted but not yet reviewed. Please check the Payment Receipts tab.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {invoice.status === 'payment_made' && (
                    <>
                      {!hasReceipt ? (
                        <div className="text-center">
                          <button
                            onClick={() => {
                              toast.dismiss('admin-dashboard-toast');
                              toast.warning('No payment receipt found. Please check the Payment Receipts tab first.', {
                                toastId: 'admin-dashboard-toast',
                                autoClose: 5000
                              });
                              setActiveTab('payments');
                            }}
                            className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                          >
                            Check Receipts
                          </button>
                        </div>
                      ) : receipt?.status === 'submitted' ? (
                        <div className="text-center">
                          <button
                            onClick={() => {
                              toast.dismiss('admin-dashboard-toast');
                              toast.info('Please review the payment receipt before confirming payment.', {
                                toastId: 'admin-dashboard-toast'
                              });
                              setActiveTab('payments');
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Review Receipt
                          </button>
                          <button
                            onClick={() => handleConfirmPayment(invoice._id)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors mt-2"
                            disabled
                          >
                            Confirm (Receipt Pending)
                          </button>
                        </div>
                      ) : receipt?.status === 'approved' ? (
                        <button
                          onClick={() => handleConfirmPayment(invoice._id || invoice.id)}
                          disabled={confirmingPayments.has(invoice._id)}
                          className={`bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center ${
                            confirmingPayments.has(invoice._id)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-green-700'
                          }`}
                        >
                          {confirmingPayments.has(invoice._id) && (
                            <FaSpinner className="animate-spin mr-2" />
                          )}
                          {confirmingPayments.has(invoice._id) ? 'Confirming...' : 'Confirm Payment'}
                        </button>
                      ) : (
                        <div className="text-center">
                          <span className="text-red-600 text-sm font-medium block mb-2">
                            Receipt {receipt?.status || 'Rejected'}
                          </span>
                          <button
                            onClick={() => handleConfirmPayment(invoice._id || invoice.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            disabled
                          >
                            Cannot Confirm
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No invoices match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoicesTab;
