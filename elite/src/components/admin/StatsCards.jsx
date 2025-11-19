import React from 'react';
import { FaUsers, FaFileInvoiceDollar, FaCreditCard, FaChartLine, FaNewspaper, FaHeart, FaComment } from 'react-icons/fa';

const StatsCards = ({ stats, invoices, paymentReceipts, onUsersClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      <div
        className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onUsersClick}
      >
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaUsers className="text-blue-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-xl font-bold text-gray-900">{stats.users?.total || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FaChartLine className="text-yellow-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Requests</p>
            <p className="text-xl font-bold text-gray-900">{stats.subscriptionRequests?.pending || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaFileInvoiceDollar className="text-green-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Invoices</p>
            <p className="text-xl font-bold text-gray-900">{stats.invoices?.total || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaCreditCard className="text-purple-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Payments</p>
            <p className="text-xl font-bold text-gray-900">{stats.payments?.pending || 0}</p>
            {/* Show invoices waiting for receipt review */}
            {(() => {
              const pendingReceiptInvoices = invoices.filter(invoice =>
                invoice.status === 'payment_made' &&
                !paymentReceipts.some(receipt =>
                  receipt.invoiceId === invoice._id || receipt.invoiceId?._id === invoice._id
                )
              ).length;
              return pendingReceiptInvoices > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {pendingReceiptInvoices} invoice{pendingReceiptInvoices > 1 ? 's' : ''} waiting for receipt review
                </p>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaNewspaper className="text-green-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Blogs</p>
            <p className="text-xl font-bold text-gray-900">{stats.blogs?.total || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaHeart className="text-purple-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Likes</p>
            <p className="text-xl font-bold text-gray-900">{stats.blogs?.totalLikes || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaComment className="text-blue-600 text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Comments</p>
            <p className="text-xl font-bold text-gray-900">{stats.blogs?.totalComments || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
