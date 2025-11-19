import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { blogService } from '../services/blogService';
import { toast } from 'react-toastify';

// Import new components
import StatsCards from '../components/admin/StatsCards';
import TabsNavigation from '../components/admin/TabsNavigation';
import AdminSidebar from '../components/admin/AdminSidebar';
import UsersTab from '../components/admin/UsersTab';
import DeliverablesTab from '../components/admin/DeliverablesTab';
import AddDeliverableModal from '../components/admin/AddDeliverableModal';
import SubscriptionsTab from '../components/admin/SubscriptionsTab';
import RequestsTab from '../components/admin/RequestsTab';
import PayPerImageRequestsTab from '../components/admin/PayPerImageRequestsTab';
import PayPerImageSubscriptionsTab from '../components/admin/PayPerImageSubscriptionsTab';
import InvoicesTab from '../components/admin/InvoicesTab';
import PaymentsTab from '../components/admin/PaymentsTab';
import InvoiceModal from '../components/admin/InvoiceModal';
import PayPerImageInvoiceModal from '../components/admin/PayPerImageInvoiceModal';
import ChatTab from '../components/admin/ChatTab';
import BlogTab from '../components/admin/BlogTab';
import BlogFormModal from '../components/admin/BlogFormModal';
import ImageUploadModal from '../components/admin/ImageUploadModal';
import { useSocket } from '../context/SocketContext';
import { chatService } from '../services/chatService';

// Toast ID constant for managing single active toast
const ADMIN_TOAST_ID = 'admin-dashboard-toast';
import {
  FaUsers,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUser,
  FaTimes,
  FaBars,
  FaLink
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [subscriptionRequests, setSubscriptionRequests] = useState([]);
  const [payPerImageRequests, setPayPerImageRequests] = useState([]);
  const [payPerImageSubscriptions, setPayPerImageSubscriptions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { socket } = useSocket();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [invoiceFormData, setInvoiceFormData] = useState({
    dueDate: '',
    paymentDetails: {
      accountNumber: '',
      accountName: '',
      bankName: '',
      paymentLink: '',
      additionalInstructions: ''
    },
    notes: '',
    paymentInstructions: ''
  });
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [showPayPerImageInvoiceModal, setShowPayPerImageInvoiceModal] = useState(false);
  const [selectedPayPerImageRequest, setSelectedPayPerImageRequest] = useState(null);
  const [payPerImageInvoiceFormData, setPayPerImageInvoiceFormData] = useState({
    dueDate: '',
    paymentDetails: {
      accountNumber: '',
      accountName: '',
      bankName: '',
      paymentLink: '',
      additionalInstructions: ''
    },
    notes: '',
    paymentInstructions: ''
  });
  const [sendingPayPerImageInvoice, setSendingPayPerImageInvoice] = useState(false);
  const [confirmingPayments, setConfirmingPayments] = useState(new Set());
  const [processingReceipts, setProcessingReceipts] = useState(new Set());
  const [blogs, setBlogs] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [deliverables, setDeliverables] = useState([]);
  const [showDeliverableModal, setShowDeliverableModal] = useState(false);
  const [selectedUserForDeliverable, setSelectedUserForDeliverable] = useState(null);
  const [savingDeliverable, setSavingDeliverable] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
      refreshUnreadCount();
    }
  }, [user]);

  // Listen for unread updates and new messages in admin room
  useEffect(() => {
    if (!socket) return;
    const handleUnreadUpdate = () => {
      // Recalculate total unread across all chats for accuracy
      refreshUnreadCount();
    };
    const handleNewChatMessage = () => {
      refreshUnreadCount();
    };
    socket.on('chat_unread_update', handleUnreadUpdate);
    socket.on('new_chat_message', handleNewChatMessage);
    return () => {
      socket.off('chat_unread_update', handleUnreadUpdate);
      socket.off('new_chat_message', handleNewChatMessage);
    };
  }, [socket]);

  const refreshUnreadCount = async () => {
    try {
      if (user?.role !== 'admin') return;
      const res = await chatService.getAllChats();
      if (res?.success && Array.isArray(res.chats)) {
        const total = res.chats.reduce((sum, c) => sum + (c?.unreadCount?.admin || 0), 0);
        setUnreadMessagesCount(total);
      }
    } catch (e) {
      // Non-fatal; keep previous value
      console.error('❌ [AdminDashboard] Failed to refresh unread count:', e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await apiService.getAdminDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch subscription requests
      const requestsResponse = await apiService.getAllSubscriptionRequests();
      if (requestsResponse.success) {
        setSubscriptionRequests(requestsResponse.data.requests);
      }

      // Fetch pay-per-image requests
      const payPerImageRequestsResponse = await apiService.getAllPayPerImageRequests();
      if (payPerImageRequestsResponse.success) {
        setPayPerImageRequests(payPerImageRequestsResponse.data.requests);
      }

      // Fetch users
      const usersResponse = await apiService.getAllUsers();
      if (usersResponse.success) {
        setUsers(usersResponse.data.users);
      }

      // Fetch all subscriptions
      const subscriptionsResponse = await apiService.getAllSubscriptions();
      if (subscriptionsResponse.success) {
        setSubscriptions(subscriptionsResponse.data.subscriptions);
      }

      // Fetch active pay-per-image subscriptions
      const payPerImageSubscriptionsResponse = await apiService.getActivePayPerImageSubscriptions();
      if (payPerImageSubscriptionsResponse.success) {
        setPayPerImageSubscriptions(payPerImageSubscriptionsResponse.data.subscriptions || []);
      }

      // Fetch all invoices
      const invoicesResponse = await apiService.getAllInvoices();
      if (invoicesResponse.success) {
        setInvoices(invoicesResponse.data.invoices);
      }

      // Fetch payment receipts
      const receiptsResponse = await apiService.getAllPaymentReceipts();
      if (receiptsResponse.success) {
        setPaymentReceipts(receiptsResponse.data.receipts);
      }

      // Fetch blogs
      const blogsResponse = await blogService.getAllBlogsAdmin();

      if (blogsResponse.success) {
        // The response has data.blogs structure
        const blogsArray = blogsResponse.data?.blogs || [];
        setBlogs(blogsArray);
      } else {
        console.error('❌ [AdminDashboard] Failed to fetch blogs - success is false');
        setBlogs([]);
      }

      // Fetch deliverables
      const deliverablesResponse = await apiService.getAllDeliverables();
      if (deliverablesResponse.success) {
        setDeliverables(deliverablesResponse.data.deliverables || []);
      } else {
        console.error('❌ [AdminDashboard] Failed to fetch deliverables');
        setDeliverables([]);
      }

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to load dashboard data', { toastId: ADMIN_TOAST_ID });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await apiService.updateSubscriptionRequestStatus(requestId, {
        status: newStatus,
        adminNotes: `Status updated to ${newStatus}`
      });

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success(`Request ${newStatus}`, { toastId: ADMIN_TOAST_ID });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to update request status', { toastId: ADMIN_TOAST_ID });
    }
  };

  const handlePayPerImageStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await apiService.updatePayPerImageRequestStatus(requestId, {
        status: newStatus,
        adminNotes: `Status updated to ${newStatus}`
      });

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success(`Pay-per-image request ${newStatus}`, { toastId: ADMIN_TOAST_ID });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating pay-per-image request status:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to update pay-per-image request status', { toastId: ADMIN_TOAST_ID });
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      const response = await apiService.updateUserRole(userId, newRole);

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success(`User role updated to ${newRole}`, { toastId: ADMIN_TOAST_ID });
        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to update user role', { toastId: ADMIN_TOAST_ID });
    }
  };

  const handleProcessReceipt = async (receiptId, status) => {
    // Check if already processing this receipt
    if (processingReceipts.has(receiptId)) {
      return;
    }

    // Add to processing set
    setProcessingReceipts(prev => new Set([...prev, receiptId]));

    try {
      const response = await apiService.processPaymentReceipt(receiptId, { status });

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success(`Payment receipt ${status}`, { toastId: ADMIN_TOAST_ID });

        // Update local state
        setPaymentReceipts(prevReceipts =>
          prevReceipts.map(receipt =>
            receipt._id === receiptId ? { ...receipt, status } : receipt
          )
        );

        // If approved, also confirm the payment and create subscription
        if (status === 'approved') {
          const receipt = paymentReceipts.find(r => r._id === receiptId);
          if (receipt?.invoiceId) {
            try {
              // Extract the invoice ID (could be string or object)
              const invoiceId = typeof receipt.invoiceId === 'object' ? receipt.invoiceId._id : receipt.invoiceId;
              await apiService.confirmPayment(invoiceId);
              toast.success('Payment confirmed and subscription activated!', { toastId: ADMIN_TOAST_ID });
            } catch (confirmError) {
              console.error('Error confirming payment:', confirmError);
              toast.error('Receipt approved but payment confirmation failed', { toastId: ADMIN_TOAST_ID });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing payment receipt:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to process payment receipt', { toastId: ADMIN_TOAST_ID });
    } finally {
      // Remove from processing set
      setProcessingReceipts(prev => {
        const newSet = new Set(prev);
        newSet.delete(receiptId);
        return newSet;
      });
    }
  };

  const handleUpdateSubscription = async (subscriptionId, updateData) => {
    try {
      const response = await apiService.updateSubscription(subscriptionId, updateData);

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Subscription updated successfully', { toastId: ADMIN_TOAST_ID });

        // Update local state
        setSubscriptions(prevSubscriptions =>
          prevSubscriptions.map(subscription =>
            subscription._id === subscriptionId ? response.data : subscription
          )
        );
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to update subscription', { toastId: ADMIN_TOAST_ID });
      throw error; // Re-throw to let the component handle it
    }
  };

  const handleUpdatePayPerImageUsage = async (subscriptionId, updateData) => {
    try {
      if (!subscriptionId) {
        console.error('❌ [AdminDashboard] subscriptionId is undefined/null');
        throw new Error('Subscription ID is required');
      }

      const response = await apiService.updatePayPerImageUsage(subscriptionId, updateData);

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Pay-per-image subscription updated successfully', { toastId: ADMIN_TOAST_ID });

        // Update local state
        setPayPerImageSubscriptions(prevSubscriptions =>
          prevSubscriptions.map(subscription =>
            subscription._id === subscriptionId ? response.data : subscription
          )
        );
      }
    } catch (error) {
      console.error('Error updating pay-per-image subscription:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to update pay-per-image subscription', { toastId: ADMIN_TOAST_ID });
      throw error; // Re-throw to let the component handle it
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (blogData) => {
    setSavingBlog(true);
    try {
      let response;
      if (selectedBlog) {
        // Update existing blog
        response = await blogService.updateBlog(selectedBlog._id, blogData);
      } else {
        // Create new blog
        response = await blogService.createBlog(blogData);
      }

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success(`Blog ${selectedBlog ? 'updated' : 'created'} successfully`, { toastId: ADMIN_TOAST_ID });
        setShowBlogModal(false);
        setSelectedBlog(null);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.dismiss(ADMIN_TOAST_ID);

      // Show detailed validation errors if available
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map(err => err.msg || err.message).join(', ');
        toast.error(`Validation failed: ${errorMessages}`, { toastId: ADMIN_TOAST_ID });
      } else {
        toast.error(`Failed to ${selectedBlog ? 'update' : 'create'} blog: ${error.message || 'Unknown error'}`, { toastId: ADMIN_TOAST_ID });
      }
      // Re-throw so the form modal can map field-level errors
      throw error;
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await blogService.deleteBlog(blogId);
      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Blog deleted successfully', { toastId: ADMIN_TOAST_ID });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to delete blog', { toastId: ADMIN_TOAST_ID });
    }
  };

  const handleTogglePublish = async (blogId, currentStatus) => {
    try {
      const response = await blogService.publishBlog(blogId, !currentStatus);
      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully`, { toastId: ADMIN_TOAST_ID });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error toggling blog publish status:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to update blog status', { toastId: ADMIN_TOAST_ID });
    }
  };

  const handleAddDeliverable = (user) => {
    setSelectedUserForDeliverable(user);
    setShowDeliverableModal(true);
  };

  const handleSaveDeliverable = async (deliverableData) => {
    setSavingDeliverable(true);
    try {
      const response = await apiService.createDeliverable(deliverableData);

      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Deliverable created successfully', { toastId: ADMIN_TOAST_ID });

        // Update local state
        setDeliverables(prev => [response.data, ...prev]);

        // Close modal
        setShowDeliverableModal(false);
        setSelectedUserForDeliverable(null);
      }
    } catch (error) {
      console.error('Error creating deliverable:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to create deliverable', { toastId: ADMIN_TOAST_ID });
      throw error; // Re-throw to let modal handle it
    } finally {
      setSavingDeliverable(false);
    }
  };

  const handleDeleteDeliverable = async (deliverableId) => {
    try {
      const response = await apiService.deleteDeliverable(deliverableId);

      if (response.success) {
        // Update local state
        setDeliverables(prev => prev.filter(d => d._id !== deliverableId));
      }
    } catch (error) {
      console.error('Error deleting deliverable:', error);
      throw error; // Re-throw to let component handle it
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'invoice_sent': return 'text-blue-600 bg-blue-100';
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
      case 'invoice_sent': return <FaFileInvoiceDollar className="text-blue-600" />;
      default: return <FaClock className="text-gray-600" />;
    }
  };

  const filteredRequests = subscriptionRequests.filter(request => {
    const matchesSearch = !searchTerm ||
      request.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredPayPerImageRequests = payPerImageRequests.filter(request => {
    const matchesSearch = !searchTerm ||
      request.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = !searchTerm ||
      subscription.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.planId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || subscription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleSendInvoice = (request) => {
    setSelectedRequest(request);
    // Set default due date to 30 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    setInvoiceFormData({
      ...invoiceFormData,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    });
    setShowInvoiceModal(true);
  };

  const handleSendPayPerImageInvoice = (request) => {
    setSelectedPayPerImageRequest(request);
    // Set default due date to 30 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    setPayPerImageInvoiceFormData({
      ...payPerImageInvoiceFormData,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    });
    setShowPayPerImageInvoiceModal(true);
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (sendingInvoice) return; // guard against double submits
    setSendingInvoice(true);
    try {
      const invoiceData = {
        subscriptionRequestId: selectedRequest._id,
        dueDate: invoiceFormData.dueDate,
        currency: selectedRequest.currency || 'USD',
        paymentDetails: {
          accountNumber: invoiceFormData.paymentDetails.accountNumber || '',
          accountName: invoiceFormData.paymentDetails.accountName || '',
          bankName: invoiceFormData.paymentDetails.bankName || '',
          paymentLink: invoiceFormData.paymentDetails.paymentLink || '',
          additionalInstructions: invoiceFormData.paymentDetails.additionalInstructions || ''
        },
        notes: invoiceFormData.notes || '',
        paymentInstructions: invoiceFormData.paymentInstructions || 'Please make payment using the details provided above.'
      };

      const response = await apiService.createInvoice(invoiceData);
      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Invoice sent successfully!', { toastId: ADMIN_TOAST_ID });
        setShowInvoiceModal(false);
        setSelectedRequest(null);
        fetchDashboardData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to send invoice. Please try again.', { toastId: ADMIN_TOAST_ID });
    } finally {
      setSendingInvoice(false);
    }
  };

  const handlePayPerImageInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (sendingPayPerImageInvoice) return; // guard against double submits
    setSendingPayPerImageInvoice(true);
    try {
      const invoiceData = {
        dueDate: payPerImageInvoiceFormData.dueDate,
        paymentDetails: {
          accountNumber: payPerImageInvoiceFormData.paymentDetails.accountNumber || '',
          accountName: payPerImageInvoiceFormData.paymentDetails.accountName || '',
          bankName: payPerImageInvoiceFormData.paymentDetails.bankName || '',
          paymentLink: payPerImageInvoiceFormData.paymentDetails.paymentLink || '',
          additionalInstructions: payPerImageInvoiceFormData.paymentDetails.additionalInstructions || ''
        },
        notes: payPerImageInvoiceFormData.notes || '',
        paymentInstructions: payPerImageInvoiceFormData.paymentInstructions || 'Please make payment using the details provided above.'
      };

      const response = await apiService.createPayPerImageInvoice(selectedPayPerImageRequest._id, invoiceData);
      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Pay-per-image invoice sent successfully!', { toastId: ADMIN_TOAST_ID });
        setShowPayPerImageInvoiceModal(false);
        setSelectedPayPerImageRequest(null);
        fetchDashboardData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error sending pay-per-image invoice:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to send pay-per-image invoice. Please try again.', { toastId: ADMIN_TOAST_ID });
    } finally {
      setSendingPayPerImageInvoice(false);
    }
  };

  const handleInvoiceFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoiceFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setInvoiceFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePayPerImageInvoiceFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPayPerImageInvoiceFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPayPerImageInvoiceFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleConfirmPayment = async (invoiceId) => {
    // Extract the invoice ID if it's an object
    const actualInvoiceId = typeof invoiceId === 'object' ? invoiceId._id || invoiceId.id : invoiceId;

    if (!actualInvoiceId) {
      console.error('🔍 [AdminDashboard] Invalid invoice ID:', invoiceId);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Invalid invoice ID', { toastId: ADMIN_TOAST_ID });
      return;
    }

    // Check if already confirming this payment
    if (confirmingPayments.has(actualInvoiceId)) {
      return;
    }

    // Add to confirming set
    setConfirmingPayments(prev => new Set([...prev, actualInvoiceId]));

    try {
      const response = await apiService.confirmPayment(actualInvoiceId);
      if (response.success) {
        toast.dismiss(ADMIN_TOAST_ID);
        toast.success('Payment confirmed successfully!', { toastId: ADMIN_TOAST_ID });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.dismiss(ADMIN_TOAST_ID);
      toast.error('Failed to confirm payment', { toastId: ADMIN_TOAST_ID });
    } finally {
      // Remove from confirming set
      setConfirmingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(actualInvoiceId);
        return newSet;
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        subscriptionRequests={subscriptionRequests}
        payPerImageRequests={payPerImageRequests}
        paymentReceipts={paymentReceipts}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        setIsMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FaBars className="text-lg" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-0.5 text-sm">
                    Manage users, subscription requests, invoices, and payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Overview Tab - Show Stats Cards */}
          {activeTab === 'overview' && (
            <StatsCards
              stats={stats}
              invoices={invoices}
              paymentReceipts={paymentReceipts}
              onUsersClick={() => setActiveTab('users')}
            />
          )}

          {/* Other tabs - show search/filter and content */}
          {activeTab !== 'overview' && (
            <>
              {/* Search and Filter - hidden for chat tab (ChatTab has its own search UI) */}
              {activeTab !== 'chat' && (
                <div className="bg-white rounded-lg shadow-sm mb-4">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
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
              )}

              {/* Content Container */}
              {activeTab === 'chat' ? (
                // Dedicated layout for chat: height fills the screen area beneath the header
                <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-hidden">
                  <ChatTab />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4">
                    {/* Content based on active tab */}
                    {activeTab === 'users' && (
              <UsersTab
                filteredUsers={filteredUsers}
                handleUserRoleChange={handleUserRoleChange}
              />
                    )}

                    {activeTab === 'deliverables' && (
                      <DeliverablesTab
                        filteredUsers={filteredUsers}
                        onAddDeliverable={handleAddDeliverable}
                        deliverables={deliverables}
                        onDeleteDeliverable={handleDeleteDeliverable}
                      />
                    )}

                    {activeTab === 'subscriptions' && (
                      <SubscriptionsTab
                        subscriptions={filteredSubscriptions}
                        handleUpdateSubscription={handleUpdateSubscription}
                        getStatusColor={getStatusColor}
                      />
                    )}

                    {activeTab === 'requests' && (
                      <RequestsTab
                        filteredRequests={filteredRequests}
                        handleStatusUpdate={handleStatusUpdate}
                        handleSendInvoice={handleSendInvoice}
                        getStatusColor={getStatusColor}
                        getStatusIcon={getStatusIcon}
                      />
                    )}

                    {activeTab === 'pay-per-image-requests' && (
                      <PayPerImageRequestsTab
                        filteredRequests={filteredPayPerImageRequests}
                        handleStatusUpdate={handlePayPerImageStatusUpdate}
                        handleSendInvoice={handleSendPayPerImageInvoice}
                        getStatusColor={getStatusColor}
                        getStatusIcon={getStatusIcon}
                      />
                    )}

                    {activeTab === 'pay-per-image-subscriptions' && (
                      <PayPerImageSubscriptionsTab
                        payPerImageSubscriptions={payPerImageSubscriptions}
                        handleUpdatePayPerImageUsage={handleUpdatePayPerImageUsage}
                        getStatusColor={getStatusColor}
                        loading={loading}
                      />
                    )}

                    {activeTab === 'invoices' && (
                      <InvoicesTab
                        invoices={invoices}
                        paymentReceipts={paymentReceipts}
                        handleConfirmPayment={handleConfirmPayment}
                        setActiveTab={setActiveTab}
                        getStatusColor={getStatusColor}
                        confirmingPayments={confirmingPayments}
                      />
                    )}

                    {activeTab === 'payments' && (
                      <PaymentsTab
                        paymentReceipts={paymentReceipts}
                        handleProcessReceipt={handleProcessReceipt}
                        processingReceipts={processingReceipts}
                      />
                    )}

                    {activeTab === 'blog' && (
                      <div>
                        {/* Action Buttons */}
                        <div className="mb-6 flex flex-wrap gap-3">
                          <button
                            onClick={handleCreateBlog}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                          >
                            <FaEdit />
                            <span>Create New Blog Post</span>
                          </button>
                          <button
                            onClick={() => setShowImageUploadModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                          >
                            <FaLink />
                            <span>Image Link</span>
                          </button>
                        </div>

                        <BlogTab
                          blogs={blogs}
                          onEditBlog={handleEditBlog}
                          onDeleteBlog={handleDeleteBlog}
                          onTogglePublish={handleTogglePublish}
                          loading={loading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        showInvoiceModal={showInvoiceModal}
        setShowInvoiceModal={setShowInvoiceModal}
        selectedRequest={selectedRequest}
        invoiceFormData={invoiceFormData}
        handleInvoiceFormChange={handleInvoiceFormChange}
        handleInvoiceSubmit={handleInvoiceSubmit}
        sendingInvoice={sendingInvoice}
      />

      {/* Pay-Per-Image Invoice Modal */}
      <PayPerImageInvoiceModal
        showPayPerImageInvoiceModal={showPayPerImageInvoiceModal}
        setShowPayPerImageInvoiceModal={setShowPayPerImageInvoiceModal}
        selectedRequest={selectedPayPerImageRequest}
        payPerImageInvoiceFormData={payPerImageInvoiceFormData}
        handlePayPerImageInvoiceFormChange={handlePayPerImageInvoiceFormChange}
        handlePayPerImageInvoiceSubmit={handlePayPerImageInvoiceSubmit}
        sendingPayPerImageInvoice={sendingPayPerImageInvoice}
      />

      {/* Blog Form Modal */}
      <BlogFormModal
        showModal={showBlogModal}
        setShowModal={setShowBlogModal}
        blog={selectedBlog}
        onSave={handleSaveBlog}
        saving={savingBlog}
      />

      {/* Add Deliverable Modal */}
      <AddDeliverableModal
        showModal={showDeliverableModal}
        setShowModal={setShowDeliverableModal}
        selectedUser={selectedUserForDeliverable}
        onSave={handleSaveDeliverable}
        saving={savingDeliverable}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        showModal={showImageUploadModal}
        setShowModal={setShowImageUploadModal}
      />
    </div>
  );
};

export default AdminDashboard;
