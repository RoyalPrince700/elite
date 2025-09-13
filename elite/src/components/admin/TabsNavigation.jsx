import React from 'react';
import { FaSearch, FaFilter, FaCrown, FaComments, FaImage } from 'react-icons/fa';

const TabsNavigation = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  paymentReceipts,
  unreadMessagesCount,
  subscriptionRequests,
  payPerImageRequests
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('users');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => {
              setActiveTab('subscriptions');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaCrown className="inline mr-1" />
            Subscriptions
          </button>
          <button
            onClick={() => {
              setActiveTab('requests');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap relative ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Subscription Requests
            {/* Show notification badge for pending requests */}
            {(() => {
              const pendingRequests = subscriptionRequests?.filter(request => request.status === 'pending').length || 0;
              return pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingRequests > 9 ? '9+' : pendingRequests}
                </span>
              );
            })()}
          </button>
          <button
            onClick={() => {
              setActiveTab('pay-per-image-requests');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap relative ${
              activeTab === 'pay-per-image-requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaImage className="inline mr-1" />
            Pay-Per-Image Requests
            {/* Show notification badge for pending requests */}
            {(() => {
              const pendingRequests = payPerImageRequests?.filter(request => request.status === 'pending').length || 0;
              return pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingRequests > 9 ? '9+' : pendingRequests}
                </span>
              );
            })()}
          </button>
          <button
            onClick={() => {
              setActiveTab('pay-per-image-subscriptions');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'pay-per-image-subscriptions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaImage className="inline mr-1" />
            Pay-Per-Image Subscriptions
          </button>
          <button
            onClick={() => {
              setActiveTab('invoices');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Invoices
          </button>
          <button
            onClick={() => {
              setActiveTab('payments');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap relative ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Payment Receipts
            {/* Show notification badge for pending receipts */}
            {(() => {
              const pendingReceipts = paymentReceipts.filter(receipt => receipt.status === 'submitted').length;
              return pendingReceipts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingReceipts > 9 ? '9+' : pendingReceipts}
                </span>
              );
            })()}
          </button>
          <button
            onClick={() => {
              setActiveTab('chat');
              setStatusFilter('');
              setRoleFilter('');
              setSearchTerm('');
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap relative ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaComments className="inline mr-1" />
            Messages
            {typeof unreadMessagesCount === 'number' && unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'users' ? "Search by email, name, or company..." :
                activeTab === 'subscriptions' ? "Search by user name, email, or company..." :
                "Search..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {activeTab === 'users' ? (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : activeTab === 'subscriptions' ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          ) : activeTab === 'requests' || activeTab === 'pay-per-image-requests' ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="invoice_sent">Invoice Sent</option>
              <option value="completed">Completed</option>
            </select>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TabsNavigation;
