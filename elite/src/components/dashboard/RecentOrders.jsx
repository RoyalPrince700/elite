import React from 'react';
import { FaHistory, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const RecentOrders = ({ recentOrders }) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'approved': return <FaCheckCircle className="text-green-600" />;
      case 'rejected': return <FaExclamationTriangle className="text-red-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Orders</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      {recentOrders.length > 0 ? (
        <div className="space-y-3 md:space-y-4">
          {recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                    {order.orderTitle || `Order #${order._id.slice(-8)}`}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {(order.orderType === 'pay-per-image' ? 'Pay-Per-Image' : 'Subscription')}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-2 flex-shrink-0">
                {typeof order.orderAmount === 'number' && (
                  <span className="mr-3 text-sm font-semibold text-gray-800">
                    {order.orderCurrency === 'NGN' ? `₦${order.orderAmount.toLocaleString()}` : `$${order.orderAmount}`}
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 md:py-8">
          <FaHistory className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500 px-2">
            Start by uploading some photos to create your first order.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
