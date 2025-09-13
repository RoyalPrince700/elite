import React from 'react';
import { FaFileInvoiceDollar, FaClock, FaCheckCircle, FaExclamationTriangle, FaImage } from 'react-icons/fa';

const PayPerImageRequestsTab = ({ filteredRequests, handleStatusUpdate, handleSendInvoice, getStatusColor, getStatusIcon }) => {
  return (
    <div className="space-y-4">
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <div key={request._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(request.status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.companyName || request.contactPerson}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Contact:</strong> {request.contactPerson}
                  </div>
                  <div>
                    <strong>Email:</strong> {request.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {request.phone}
                  </div>
                  <div>
                    <strong>Service:</strong> {request.serviceName}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {request.quantity}
                  </div>
                  <div>
                    <strong>Amount:</strong> {request.currency === 'NGN' ? `₦${request.totalPrice.toLocaleString()}` : `$${request.totalPrice}`}
                  </div>
                </div>
                {request.specialInstructions && (
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Instructions:</strong> {request.specialInstructions}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'approved')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {request.status === 'approved' && (
                  <button
                    onClick={() => handleSendInvoice(request)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Send Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <FaImage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pay-per-image requests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No pay-per-image requests match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayPerImageRequestsTab;
