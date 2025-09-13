import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload, uploadReceipt } from '../config/cloudinary.js';
import multer from 'multer';

// Custom multer for receipt submission - handle file upload only
const receiptUpload = multer({
  storage: uploadReceipt.storage,
  limits: uploadReceipt.limits,
  fileFilter: uploadReceipt.fileFilter
}).single('receipt');
import {
  createSubscriptionRequest,
  getUserSubscriptionRequests,
  getAllSubscriptionRequests,
  updateSubscriptionRequestStatus,
  createInvoice,
  getUserInvoices,
  getInvoice,
  updateInvoiceStatus,
  confirmPayment,
  submitPaymentReceipt,
  uploadPaymentReceipt,
  getUserPaymentReceipts,
  processPaymentReceipt,
  getUserSubscription
} from '../controllers/subscriptionController.js';

const router = express.Router();

console.log('🔍 [Routes] Subscription routes loaded');

// User routes
router.post('/request', authenticateToken, createSubscriptionRequest);
router.get('/requests', authenticateToken, getUserSubscriptionRequests);
router.get('/active', authenticateToken, getUserSubscription);
router.get('/invoices', authenticateToken, getUserInvoices);
router.get('/invoices/:id', authenticateToken, getInvoice);
router.put('/invoices/:id/status', authenticateToken, updateInvoiceStatus);
// Route moved to server.js to handle before body parsers
router.post('/payments/receipt/:id/upload', authenticateToken, uploadReceipt.single('receipt'), uploadPaymentReceipt);
router.get('/payments/receipts', authenticateToken, getUserPaymentReceipts);

// Admin routes
console.log('🔍 [Routes] Setting up subscription admin routes');
router.get('/admin/requests', authenticateToken, requireAdmin, getAllSubscriptionRequests);
router.put('/admin/requests/:id', authenticateToken, requireAdmin, updateSubscriptionRequestStatus);
router.post('/admin/invoices', authenticateToken, requireAdmin, createInvoice);
router.put('/admin/invoices/:id/confirm-payment', authenticateToken, requireAdmin, confirmPayment);
console.log('🔍 [Routes] Confirm payment route set up in subscription routes');
router.put('/admin/payments/receipts/:id', authenticateToken, requireAdmin, processPaymentReceipt);

export default router;
