import React from 'react';
import { FaFileInvoiceDollar, FaSpinner } from 'react-icons/fa';

const PaymentsTab = ({ paymentReceipts, handleProcessReceipt, processingReceipts }) => {
  return (
    <div className="space-y-4">
      {paymentReceipts.length > 0 ? (
        paymentReceipts.map((receipt) => (
          <div key={receipt._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <FaFileInvoiceDollar className="text-blue-600" />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Receipt #{receipt._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {receipt.userId?.fullName || 'Unknown User'} - {receipt.currency === 'NGN' ? `₦${receipt.amount.toLocaleString()}` : `$${receipt.amount}`}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    receipt.status === 'submitted' ? 'text-yellow-600 bg-yellow-100' :
                    receipt.status === 'approved' ? 'text-green-600 bg-green-100' :
                    'text-red-600 bg-red-100'
                  }`}>
                    {receipt.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Payment Method:</strong> {receipt.paymentMethod}
                  </div>
                  <div>
                    <strong>Transaction Ref:</strong> {receipt.transactionReference}
                  </div>
                  <div>
                    <strong>Payment Date:</strong> {new Date(receipt.paymentDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Receipt Document */}
                {(receipt.receiptUrl || receipt.fileName) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Receipt Document</h4>
                    {receipt.fileName ? (
                      <div className="flex items-center space-x-2">
                        <FaFileInvoiceDollar className="text-gray-600" />
                        <span className="text-sm text-gray-700">{receipt.fileName}</span>
                        <a
                          href={receipt.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View/Download
                        </a>
                      </div>
                    ) : receipt.receiptUrl ? (
                      <div className="flex items-center space-x-2">
                        <FaFileInvoiceDollar className="text-gray-600" />
                        <span className="text-sm text-gray-700">Receipt Link</span>
                        <a
                          href={receipt.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View Receipt
                        </a>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Notes */}
                {receipt.notes && (
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Notes:</strong> {receipt.notes}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                {receipt.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => handleProcessReceipt(receipt._id, 'approved')}
                      disabled={processingReceipts.has(receipt._id)}
                      className={`bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center ${
                        processingReceipts.has(receipt._id)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-green-700'
                      }`}
                    >
                      {processingReceipts.has(receipt._id) && (
                        <FaSpinner className="animate-spin mr-2" />
                      )}
                      {processingReceipts.has(receipt._id) ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleProcessReceipt(receipt._id, 'rejected')}
                      disabled={processingReceipts.has(receipt._id)}
                      className={`bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center ${
                        processingReceipts.has(receipt._id)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-red-700'
                      }`}
                    >
                      {processingReceipts.has(receipt._id) && (
                        <FaSpinner className="animate-spin mr-2" />
                      )}
                      {processingReceipts.has(receipt._id) ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
                {receipt.status === 'approved' && (
                  <span className="text-green-600 text-sm font-medium">Approved</span>
                )}
                {receipt.status === 'rejected' && (
                  <span className="text-red-600 text-sm font-medium">Rejected</span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Payment Receipts</h3>
          <p className="mt-1 text-sm text-gray-500">
            No payment receipts have been submitted yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;
