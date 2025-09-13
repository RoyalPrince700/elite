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
  ReceiptUploadModal
} from '../components/dashboard';
import UserChat from '../components/chat/UserChat';

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
      if (requestsResponse.success) {
        const requests = requestsResponse.data.requests || [];
        const pendingRequests = requests.filter(req => req.status === 'pending');
        const approvedRequests = requests.filter(req => req.status === 'approved');

        setStats(prev => ({
          ...prev,
          pendingOrders: pendingRequests.length,
          completedOrders: approvedRequests.length
        }));

        // Set recent orders (last 3)
        setRecentOrders(requests.slice(0, 3));
      }

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









  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track orders and monitor your subscription.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/subscriptions"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors font-medium shadow-md inline-block"
              >
                Manage Subscriptions
              </Link>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track orders and monitor your subscription.
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <Link
                to="/subscriptions"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-md transition-colors font-medium shadow-md inline-block text-sm"
              >
                Manage Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <RecentOrders recentOrders={recentOrders} />

          {/* Quick Actions */}
          <QuickActions subscriptions={subscriptions} />
        </div>


        {/* Subscription & Billing Section */}
        <SubscriptionBilling
          subscriptions={subscriptions}
          invoices={invoices}
          paymentReceipts={paymentReceipts}
          onViewInvoice={handleViewInvoice}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
          onRefreshSubscriptions={handleRefreshSubscriptions}
        />

        {/* Invoice Modal */}
        <InvoiceModal
          showInvoiceModal={showInvoiceModal}
          selectedInvoice={selectedInvoice}
          onClose={() => setShowInvoiceModal(false)}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
        />

        {/* Receipt Upload Modal */}
        <ReceiptUploadModal
          showReceiptModal={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          receiptData={receiptData}
          onInputChange={handleReceiptInputChange}
          onSubmit={handleSubmitReceipt}
          submittingReceipt={submittingReceipt}
        />

        {/* User Chat */}
        <UserChat />

      </div>
    </div>
  );
};

export default Dashboard;
