import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  getAdminDashboardStats,
  getAllSubscriptionRequests,
  updateSubscriptionRequestStatus,
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoiceStatus,
  getAllPaymentReceipts,
  processPaymentReceipt,
  getAllUsers,
  updateUserRole,
  getSubscriptionAnalytics,
  getAllSubscriptions,
  updateSubscription,
  getAllPhotos,
  updatePhotoStatus,
  getPhotoStats,
  getAllDeliverables,
  createDeliverable,
  deleteDeliverable,
  getUserDeliverables
} from '../controllers/adminController.js';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getBlogStats
} from '../controllers/blogController.js';
import { fixNextBillingDates, confirmPayment } from '../controllers/subscriptionController.js';
import { uploadBlogHeader } from '../config/cloudinary.js';
import { validateBlogCreation, validateBlogUpdate } from '../middleware/validators/blogValidators.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

console.log('🔍 [Routes] Admin routes loaded');

// Dashboard stats
router.get('/dashboard/stats', getAdminDashboardStats);

// Subscription requests management
router.get('/subscription-requests', getAllSubscriptionRequests);
router.put('/subscription-requests/:id', updateSubscriptionRequestStatus);

// Invoice management
console.log('🔍 [Routes] Setting up invoice routes');
router.post('/invoices', createInvoice);
router.get('/invoices', getAllInvoices);
router.get('/invoices/:id', getInvoice);
router.put('/invoices/:id/status', updateInvoiceStatus);
// Add the missing confirm-payment route
router.put('/invoices/:id/confirm-payment', confirmPayment);
console.log('🔍 [Routes] Confirm payment route added to admin routes');

// Payment receipts management
router.get('/payment-receipts', getAllPaymentReceipts);
router.put('/payment-receipts/:id', processPaymentReceipt);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Subscription management
router.get('/subscriptions', getAllSubscriptions);
router.put('/subscriptions/:id', updateSubscription);

// Analytics
router.get('/analytics/subscriptions', getSubscriptionAnalytics);

// Fix next billing dates
router.post('/subscriptions/fix-next-billing-dates', fixNextBillingDates);

// Photo management
router.get('/photos', getAllPhotos);
router.put('/photos/:id/status', updatePhotoStatus);
router.get('/photos/stats', getPhotoStats);

// Blog management
router.get('/blogs', getAllBlogs);
router.get('/blogs/stats', getBlogStats);
router.post(
  '/blogs',
  uploadBlogHeader.single('headerImage'),
  validateBlogCreation,
  createBlog
);
router.put(
  '/blogs/:id',
  uploadBlogHeader.single('headerImage'),
  validateBlogUpdate,
  updateBlog
);
router.delete('/blogs/:id', deleteBlog);
router.put('/blogs/:id/publish', publishBlog);
router.put('/blogs/:id/unpublish', unpublishBlog);

// Deliverables management
router.get('/deliverables', getAllDeliverables);
router.post('/deliverables', createDeliverable);
router.delete('/deliverables/:id', deleteDeliverable);

export default router;
