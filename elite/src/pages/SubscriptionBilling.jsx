import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import { FaCreditCard, FaFileInvoiceDollar, FaEye, FaRedo, FaArrowLeft, FaCalendarAlt, FaImages, FaSync } from 'react-icons/fa';
import InvoiceModal from '../components/dashboard/InvoiceModal';
import ReceiptUploadModal from '../components/dashboard/ReceiptUploadModal';

const SubscriptionBillingPage = () => {
  const { user, refreshSubscription } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch user's subscriptions
      const subscriptionResponse = await apiService.getUserSubscription();

      if (subscriptionResponse.success) {
        const subs = subscriptionResponse.data.subscriptions || [];
        setSubscriptions(subs);
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
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handlePaymentStatusUpdate = async (invoiceId, status) => {
    try {
      if (status === 'payment_submitted') {
        // Submit payment receipt
        const invoice = invoices.find(inv => inv._id === invoiceId);
        const receiptDataPayload = {
          invoiceId,
          amount: invoice?.amount || 100,
          currency: invoice?.currency || 'USD',
          paymentMethod: 'bank_transfer',
          transactionReference: `TXN-${Date.now()}`,
          paymentDate: new Date().toISOString(),
          notes: 'Payment submitted via subscription page'
        };

        const response = await apiService.submitPaymentReceipt(receiptDataPayload);
        if (response.success) {
          toast.success('Payment receipt submitted successfully!');
          fetchAllData(); // Refresh data
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
      toast.error('Failed to update payment status');
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
          toast.success('Payment receipt submitted! Awaiting admin confirmation.');

          // Close modal and refresh data
          setShowReceiptModal(false);
          fetchAllData();

          // Also refresh subscription data
          if (refreshSubscription) {
            refreshSubscription();
          }
        }
      }
    } catch (error) {
      console.error('Error submitting receipt:', error);
      toast.error('Failed to submit payment receipt');
    } finally {
      setSubmittingReceipt(false);
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
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={fetchAllData}
              className="flex items-center text-gray-600 hover:text-gray-900"
              title="Refresh data"
            >
              <FaSync className="mr-2" />
              Refresh
            </button>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Subscriptions & Billing</h1>
            <p className="text-gray-600 mt-1">
              Manage all your active subscriptions and view billing history
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaCreditCard className="mr-2 text-gray-400" />
              Active Subscriptions ({subscriptions.length})
            </h2>
          </div>

          {subscriptions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription, index) => {
                const isExhausted = subscription.status === 'active' && subscription.imagesUsed >= subscription.imagesLimit;

                return (
                  <div key={subscription._id} className={`border rounded-lg p-4 ${
                    isExhausted ? 'border-red-200 bg-red-50' :
                    subscription.status === 'active' ? 'border-green-200 bg-green-50' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {isExhausted ? 'Plan Exhausted' :
                         subscription.status === 'active' ? 'Active Subscription' :
                         'Subscription'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isExhausted ? 'text-red-600 bg-red-100' :
                        subscription.status === 'active' ? 'text-green-600 bg-green-100' :
                        subscription.status === 'inactive' ? 'text-gray-600 bg-gray-100' :
                        subscription.status === 'cancelled' ? 'text-red-600 bg-red-100' :
                        'text-yellow-600 bg-yellow-100'
                      }`}>
                        {isExhausted ? 'Exhausted' : subscription.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Plan Details</h4>
                        <p className="text-lg font-bold text-blue-600">{subscription.planId?.name || 'N/A'}</p>
                        <p className={`text-xs mt-1 ${isExhausted ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          <FaImages className="inline mr-1" />
                          {subscription.imagesUsed || 0} / {subscription.imagesLimit || subscription.planId?.imagesPerMonth || 100} images used
                          {isExhausted && <span className="ml-2 text-red-500">⚠️ Limit reached</span>}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Next Billing</h4>
                        {isExhausted ? (
                          <p className="text-xs text-red-600 font-medium">
                            Renew to continue uploading
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900 flex items-center">
                              <FaCalendarAlt className="mr-1 text-gray-400" />
                              {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : 'N/A'}
                            </p>
                            {subscription.nextBillingDate && subscription.status === 'active' && (
                              <p className="text-xs text-gray-600">
                                {(() => {
                                  const today = new Date();
                                  const nextBilling = new Date(subscription.nextBillingDate);
                                  const diffTime = nextBilling - today;
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                  if (diffDays === 0) {
                                    return 'Due today';
                                  } else if (diffDays === 1) {
                                    return 'Due tomorrow';
                                  } else if (diffDays > 0) {
                                    return `Due in ${diffDays} days`;
                                  } else {
                                    return 'Overdue';
                                  }
                                })()}
                              </p>
                            )}
                            <p className="text-xs text-gray-600">
                              {subscription.currency === 'NGN' ? `₦${(subscription.monthlyPrice || subscription.planId?.monthlyPrice || 0).toLocaleString()}` : `$${subscription.monthlyPrice || subscription.planId?.monthlyPrice || 0}`} / {subscription.billingCycle || 'month'}
                            </p>
                          </div>
                        )}
                      </div>

                      {isExhausted && (
                        <a
                          href="/pricing"
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          <FaRedo className="mr-1" />
                          Renew Now
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active subscriptions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Subscribe to a plan to start uploading photos.
              </p>
              <a
                href="/pricing"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                View Plans
              </a>
            </div>
          )}
        </div>

        {/* Billing History */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FaFileInvoiceDollar className="mr-2 text-gray-400" />
              Billing History
            </h2>

            <div className="space-y-4">
              {invoices.map((invoice) => {
                const hasPaymentReceipt = paymentReceipts.some(receipt => receipt.invoiceId === invoice._id);
                return (
                  <div key={invoice._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaFileInvoiceDollar className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Invoice #{invoice.invoiceNumber || invoice._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {invoice.planId?.name || 'Subscription'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {invoice.currency === 'NGN' ? `₦${invoice.amount.toLocaleString()}` : `$${invoice.amount}`}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status === 'payment_made' ? 'Awaiting Confirmation' :
                           invoice.status === 'payment_confirmed' ? 'Payment Confirmed' :
                           invoice.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FaEye className="mr-1" />
                        View
                      </button>
                      {invoice.status === 'sent' && !hasPaymentReceipt && (
                        <button
                          onClick={() => handlePaymentStatusUpdate(invoice._id, 'payment_made')}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      {hasPaymentReceipt && (
                        <span className="text-sm text-blue-600 font-medium">Payment Submitted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default SubscriptionBillingPage;
