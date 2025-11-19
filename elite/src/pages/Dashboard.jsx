import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import {
  StatsCards,
  RecentOrders,
  QuickActions,
  SubscriptionBilling,
  InvoiceModal,
  ReceiptUploadModal,
  DashboardSidebar
} from '../components/dashboard';
import UserChat from '../components/chat/UserChat';
import { FaBars } from 'react-icons/fa';

// Toast ID constant for managing single active toast
const DASHBOARD_TOAST_ID = 'user-dashboard-toast';
import {
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaImage,
  FaDownload
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, subscription, subscriptions, refreshSubscription } = useAuth();

  // Wrapper function to refresh subscriptions
  const handleRefreshSubscriptions = async () => {
    try {
      await refreshSubscription();
    } catch (error) {
      console.error('Failed to refresh subscriptions:', error);
    }
  };

  const [stats, setStats] = useState({
    pendingOrders: 0,
    completedOrders: 0,
    currentMonthUsage: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState({
    invoiceId: null,
    amount: 0,
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    receiptFile: null,
    receiptLink: '',
    notes: ''
  });
  const subscriptionRefreshed = useRef(false);
  const [deliverables, setDeliverables] = useState([]);

  // Sidebar state
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []); // Only run once on mount

  useEffect(() => {
    // Refresh subscription data only once when component mounts and user is available
    if (refreshSubscription && user && !subscriptionRefreshed.current) {
      subscriptionRefreshed.current = true;
      refreshSubscription();
    }
  }, [refreshSubscription, user]); // Safe to include these as user changes infrequently

  const fetchDashboardData = async () => {
    try {
      setLoading(true);


      // Fetch user's subscription requests
      const requestsResponse = await apiService.getUserSubscriptionRequests();
      const subscriptionRequests = requestsResponse.success ? (requestsResponse.data.requests || []) : [];

      const payPerImageResponse = await apiService.getUserPayPerImageRequests().catch(error => {
        console.error('Failed to fetch pay-per-image requests:', error);
        return { success: false };
      });
      const payPerImageRequests = payPerImageResponse.success ? (payPerImageResponse.data.requests || []) : [];

      const normalizedSubscriptionRequests = subscriptionRequests.map(request => ({
        ...request,
        orderType: 'subscription',
        orderTitle: request.planId?.name || 'Subscription Plan',
        orderAmount: request.finalPrice,
        orderCurrency: request.currency || 'USD'
      }));

      const normalizedPayPerImageRequests = payPerImageRequests.map(request => ({
        ...request,
        orderType: 'pay-per-image',
        orderTitle: request.serviceName || 'Pay-Per-Image Order',
        orderAmount: request.totalPrice,
        orderCurrency: request.currency || 'USD'
      }));

      const allRequests = [...normalizedSubscriptionRequests, ...normalizedPayPerImageRequests];

      const pendingOrders = allRequests.filter(req => req.status === 'pending');
      const completedOrders = allRequests.filter(req => ['approved', 'completed', 'invoice_sent'].includes(req.status));

      setStats(prev => ({
        ...prev,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length
      }));

      const sortedRecentOrders = allRequests
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setRecentOrders(sortedRecentOrders);

      // Fetch user's invoices
      const invoicesResponse = await apiService.getUserInvoices();
      if (invoicesResponse.success) {
        setInvoices(invoicesResponse.data.invoices || []);
      }

      // Fetch user's payment receipts
      const receiptsResponse = await apiService.getUserPaymentReceipts();
      if (receiptsResponse.success) {
        setPaymentReceipts(receiptsResponse.data.receipts || []);
      }

      // Fetch user's deliverables
      const deliverablesResponse = await apiService.getUserDeliverables();
      if (deliverablesResponse.success) {
        setDeliverables(deliverablesResponse.data.deliverables || []);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.dismiss(DASHBOARD_TOAST_ID);
      toast.error('Failed to load dashboard data', { toastId: DASHBOARD_TOAST_ID });
    } finally {
      setLoading(false);
    }
  };


  const handlePaymentStatusUpdate = async (invoiceId, status) => {
    try {
      if (status === 'payment_submitted') {
        // Submit payment receipt
        const invoice = invoices.find(inv => inv._id === invoiceId);
        const receiptData = {
          invoiceId,
          amount: invoice?.amount || 100,
          currency: invoice?.currency || 'USD',
          paymentMethod: 'bank_transfer',
          transactionReference: `TXN-${Date.now()}`,
          paymentDate: new Date().toISOString(),
          notes: 'Payment submitted via dashboard'
        };

        const response = await apiService.submitPaymentReceipt(receiptData);
        if (response.success) {
          toast.dismiss(DASHBOARD_TOAST_ID);
          toast.success('Payment receipt submitted successfully!', { toastId: DASHBOARD_TOAST_ID });
          fetchDashboardData(); // Refresh data
        }
      } else if (status === 'payment_made') {
        // Show receipt upload modal instead of directly updating status
        const invoice = invoices.find(inv => inv._id === invoiceId);
        if (invoice) {
          setReceiptData(prev => ({
            ...prev,
            invoiceId,
            amount: invoice.amount,
            currency: invoice.currency || 'USD',
            transactionReference: `TXN-${Date.now()}`
          }));
          setSubmittingReceipt(false); // Reset loading state
          setShowReceiptModal(true);
        }
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.dismiss(DASHBOARD_TOAST_ID);
      toast.error('Failed to update payment status', { toastId: DASHBOARD_TOAST_ID });
    }
  };

  const handleReceiptInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receiptFile' && files) {
      setReceiptData(prev => ({
        ...prev,
        receiptFile: files[0],
        receiptLink: '' // Clear link if file is selected
      }));
    } else {
      setReceiptData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'receiptLink' && value && { receiptFile: null }) // Clear file if link is provided
      }));
    }
  };

  const handleSubmitReceipt = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (submittingReceipt) {
      return;
    }

    setSubmittingReceipt(true);

    try {
      const formData = new FormData();

      // Add receipt data
      Object.keys(receiptData).forEach(key => {
        if (key === 'receiptFile' && receiptData[key]) {
          formData.append('receipt', receiptData[key]);
        } else if (key !== 'receiptFile' && receiptData[key] !== null) {
          formData.append(key, receiptData[key]);
        }
      });

      const response = await apiService.submitPaymentReceipt(formData);
      if (response.success) {
        // Now update the invoice status to payment_made
        const invoiceResponse = await apiService.updateInvoiceStatus(receiptData.invoiceId, 'payment_made');

        if (invoiceResponse.success) {
          toast.dismiss(DASHBOARD_TOAST_ID);
          toast.success('Payment receipt submitted! Awaiting admin confirmation.', { toastId: DASHBOARD_TOAST_ID });

          // Close modal and refresh data
          setShowReceiptModal(false);
          fetchDashboardData();

          // Also refresh subscription data
          if (refreshSubscription) {
            subscriptionRefreshed.current = false;
            refreshSubscription();
          }
        }
      }
    } catch (error) {
      console.error('Error submitting receipt:', error);
      toast.dismiss(DASHBOARD_TOAST_ID);
      toast.error('Failed to submit payment receipt', { toastId: DASHBOARD_TOAST_ID });
    } finally {
      setSubmittingReceipt(false);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // Sidebar handlers
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Tab content components
  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Quick Actions - Moved to top for better mobile UX */}
      <div>
        <QuickActions subscriptions={subscriptions} />
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Recent Orders */}
      <RecentOrders recentOrders={recentOrders} />

      {/* Full Subscription & Billing Section */}
      <SubscriptionBilling
        subscriptions={subscriptions}
        invoices={invoices}
        paymentReceipts={paymentReceipts}
        onViewInvoice={handleViewInvoice}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
        onRefreshSubscriptions={handleRefreshSubscriptions}
      />
    </div>
  );

  const renderUploadTab = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Photos</h2>
        <QuickActions subscriptions={subscriptions} />
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
        <RecentOrders recentOrders={recentOrders} />
      </div>

      {/* Full Subscription & Billing Section */}
      <SubscriptionBilling
        subscriptions={subscriptions}
        invoices={invoices}
        paymentReceipts={paymentReceipts}
        onViewInvoice={handleViewInvoice}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
        onRefreshSubscriptions={handleRefreshSubscriptions}
      />
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Invoices & Billing</h2>
        <SubscriptionBilling
          subscriptions={subscriptions}
          invoices={invoices}
          paymentReceipts={paymentReceipts}
          onViewInvoice={handleViewInvoice}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
          onRefreshSubscriptions={handleRefreshSubscriptions}
        />
      </div>
    </div>
  );

  const renderDownloadsTab = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Download Center</h2>
        {deliverables.length > 0 ? (
          <div className="space-y-4">
            {deliverables.map((deliverable) => (
              <div key={deliverable._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaDownload className="text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {deliverable.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Added {new Date(deliverable.createdAt).toLocaleDateString()} by {deliverable.createdBy?.fullName || 'Admin'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {deliverable.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <a
                      href={deliverable.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <FaDownload className="text-sm" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaDownload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No Downloads Available</h3>
            <p className="text-gray-600 mb-6">
              Your admin will add downloadable content here when it's ready.
            </p>
            <p className="text-sm text-gray-500">
              Check back later or contact support if you have any questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Support Chat</h2>
        <UserChat />
      </div>
    </div>
  );









  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'upload':
        return renderUploadTab();
      case 'orders':
        return renderOrdersTab();
      case 'invoices':
        return renderInvoicesTab();
      case 'downloads':
        return renderDownloadsTab();
      case 'chat':
        return renderChatTab();
      default:
        return renderOverviewTab();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20 flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={handleMobileSidebarToggle}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile sidebar toggle */}
                <button
                  onClick={handleMobileSidebarToggle}
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <FaBars className="h-6 w-6" />
                </button>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">
                    {activeTab === 'overview' && `Welcome back, ${user?.fullName || 'User'}!`}
                    {activeTab === 'upload' && 'Upload Photos'}
                    {activeTab === 'orders' && 'Order History'}
                    {activeTab === 'invoices' && 'Invoices & Billing'}
                    {activeTab === 'downloads' && 'Download Center'}
                    {activeTab === 'chat' && 'Support Chat'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeTab === 'overview' && 'Track orders and monitor your subscription.'}
                    {activeTab === 'upload' && 'Upload your photos for professional retouching.'}
                    {activeTab === 'orders' && 'View and manage all your orders.'}
                    {activeTab === 'invoices' && 'Manage your billing and payments.'}
                    {activeTab === 'downloads' && 'Download your completed orders.'}
                    {activeTab === 'chat' && 'Get help from our support team.'}
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-3">
                {activeTab !== 'subscriptions' && (
                  <Link
                    to="/subscriptions"
                    className="hidden md:inline-flex bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium shadow-md text-sm"
                  >
                    Manage Subscriptions
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
          {renderActiveTab()}
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        showInvoiceModal={showInvoiceModal}
        selectedInvoice={selectedInvoice}
        onClose={() => setShowInvoiceModal(false)}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
      />

      <ReceiptUploadModal
        showReceiptModal={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receiptData={receiptData}
        onInputChange={handleReceiptInputChange}
        onSubmit={handleSubmitReceipt}
        submittingReceipt={submittingReceipt}
      />
    </div>
  );
};

export default Dashboard;
