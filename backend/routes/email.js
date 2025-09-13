import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  sendWelcomeEmail,
  sendSubscriptionConfirmationEmail,
  sendPhotoReadyEmail,
  sendPaymentReceivedEmail,
  sendPasswordResetEmail,
  sendAdminNotification,
  sendCustomEmail
} from '../services/emailService.js';
import { testEmailConfig } from '../config/mailtrap.js';

const router = express.Router();

// Test email configuration (Admin only for security)
router.get('/test-config', authenticateToken, async (req, res) => {
  try {
    const isConnected = await testEmailConfig();
    res.json({
      success: true,
      message: isConnected ? 'Email configuration is working' : 'Email configuration failed',
      connected: isConnected
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email configuration test failed',
      error: error.message
    });
  }
});

// Send test welcome email
router.post('/test/welcome', authenticateToken, async (req, res) => {
  try {
    const { email, userName } = req.body;

    if (!email || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Email and userName are required'
      });
    }

    const result = await sendWelcomeEmail(email, userName);

    res.json({
      success: true,
      message: 'Welcome email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
});

// Send test subscription confirmation email
router.post('/test/subscription-confirmation', authenticateToken, async (req, res) => {
  try {
    const { email, userName, planName, amount, startDate } = req.body;

    if (!email || !userName || !planName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Email, userName, planName, and amount are required'
      });
    }

    const result = await sendSubscriptionConfirmationEmail(
      email,
      userName,
      planName,
      amount,
      startDate || new Date()
    );

    res.json({
      success: true,
      message: 'Subscription confirmation email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send subscription confirmation email',
      error: error.message
    });
  }
});

// Send test photo ready email
router.post('/test/photo-ready', authenticateToken, async (req, res) => {
  try {
    const { email, userName, photoId, photoName } = req.body;

    if (!email || !userName || !photoId || !photoName) {
      return res.status(400).json({
        success: false,
        message: 'Email, userName, photoId, and photoName are required'
      });
    }

    const result = await sendPhotoReadyEmail(email, userName, photoId, photoName);

    res.json({
      success: true,
      message: 'Photo ready email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send photo ready email',
      error: error.message
    });
  }
});

// Send test payment received email
router.post('/test/payment-received', authenticateToken, async (req, res) => {
  try {
    const { email, userName, amount, transactionId } = req.body;

    if (!email || !userName || !amount || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Email, userName, amount, and transactionId are required'
      });
    }

    const result = await sendPaymentReceivedEmail(email, userName, amount, transactionId);

    res.json({
      success: true,
      message: 'Payment received email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send payment received email',
      error: error.message
    });
  }
});

// Send test password reset email
router.post('/test/password-reset', authenticateToken, async (req, res) => {
  try {
    const { email, userName, resetLink } = req.body;

    if (!email || !userName || !resetLink) {
      return res.status(400).json({
        success: false,
        message: 'Email, userName, and resetLink are required'
      });
    }

    const result = await sendPasswordResetEmail(email, userName, resetLink);

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
});

// Send test admin notification email
router.post('/test/admin-notification', authenticateToken, async (req, res) => {
  try {
    const { email, subject, message, details } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email, subject, and message are required'
      });
    }

    const result = await sendAdminNotification(email, subject, message, details);

    res.json({
      success: true,
      message: 'Admin notification email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send admin notification email',
      error: error.message
    });
  }
});

// Send custom email
router.post('/test/custom', authenticateToken, async (req, res) => {
  try {
    const { email, subject, htmlContent, textContent } = req.body;

    if (!email || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Email, subject, and htmlContent are required'
      });
    }

    const result = await sendCustomEmail(email, subject, htmlContent, textContent);

    res.json({
      success: true,
      message: 'Custom email sent successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send custom email',
      error: error.message
    });
  }
});

export default router;
