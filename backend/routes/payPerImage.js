import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  createPayPerImageRequest,
  getUserPayPerImageRequests,
  getPayPerImageRequest,
  updatePayPerImageRequestStatus,
  getAllPayPerImageRequests,
  createPayPerImageInvoice,
  updatePayPerImagePaymentStatus,
  getActivePayPerImageSubscriptions,
  updatePayPerImageUsage
} from '../controllers/payPerImageController.js';

const router = express.Router();

// User routes
router.post('/request', authenticateToken, createPayPerImageRequest);
router.get('/requests', authenticateToken, getUserPayPerImageRequests);
router.get('/requests/:id', authenticateToken, getPayPerImageRequest);
router.put('/requests/:id/payment-status', authenticateToken, updatePayPerImagePaymentStatus);

// Admin routes
router.get('/admin/requests', authenticateToken, requireAdmin, getAllPayPerImageRequests);
router.get('/admin/active', authenticateToken, requireAdmin, getActivePayPerImageSubscriptions);
router.put('/admin/requests/:id/status', authenticateToken, requireAdmin, updatePayPerImageRequestStatus);
router.put('/admin/:id/usage', authenticateToken, requireAdmin, updatePayPerImageUsage);
router.post('/admin/invoices/:requestId', authenticateToken, requireAdmin, createPayPerImageInvoice);

export default router;
