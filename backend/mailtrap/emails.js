// emails.js
import { mailtrapClient, sender } from './mailtrap.config.js';
import { emailTemplates } from './emailTemplates.js';

/**
 * Send email using Mailtrap
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {string} text - Plain text content of the email
 * @param {Object} attachments - Optional attachments
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendEmail = async (to, subject, html, text, attachments = null) => {
  try {
    const emailData = {
      from: sender,
      to: [{ email: to }],
      subject,
      html,
      text,
    };

    if (attachments) {
      emailData.attachments = attachments;
    }

    const response = await mailtrapClient.send(emailData);
    console.log('✅ Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  const { subject, html, text } = emailTemplates.welcome(userName);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send password reset email
 * @param {string} userEmail - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetUrl = `https://www.eliteretoucher.com/reset-password?token=${resetToken}`;
  const { subject, html, text } = emailTemplates.passwordReset(resetUrl);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send subscription confirmation email
 * @param {string} userEmail - User's email address
 * @param {string} planName - Subscription plan name
 * @param {string} amount - Subscription amount
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendSubscriptionConfirmationEmail = async (userEmail, planName, amount) => {
  const { subject, html, text } = emailTemplates.subscriptionConfirmation(planName, amount);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send photo processing complete email
 * @param {string} userEmail - User's email address
 * @param {string} photoId - Processed photo ID
 * @param {string} downloadUrl - Download URL for the processed photo
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendPhotoProcessingCompleteEmail = async (userEmail, photoId, downloadUrl) => {
  const { subject, html, text } = emailTemplates.photoProcessingComplete(photoId, downloadUrl);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send invoice email
 * @param {string} userEmail - User's email address
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendInvoiceEmail = async (userEmail, invoiceData) => {
  const { subject, html, text } = emailTemplates.invoice(invoiceData);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send subscription activated email
 * @param {string} userEmail - User's email address
 * @param {Object} data - Activation data
 */
export const sendSubscriptionActivatedEmail = async (userEmail, data) => {
  const { subject, html, text } = emailTemplates.subscriptionActivated(data);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send admin notification email
 * @param {string} adminEmail - Admin's email address
 * @param {string} notificationType - Type of notification
 * @param {Object} data - Notification data
 * @returns {Promise<Object>} - Mailtrap response
 */
export const sendAdminNotificationEmail = async (adminEmail, notificationType, data) => {
  const { subject, html, text } = emailTemplates.adminNotification(notificationType, data);
  return await sendEmail(adminEmail, subject, html, text);
};

/**
 * Send subscription request receipt email
 * @param {string} userEmail - User email
 * @param {Object} data - Receipt data (planName, billingCycle, amount, currency, etc.)
 */
export const sendSubscriptionRequestReceiptEmail = async (userEmail, data) => {
  const { subject, html, text } = emailTemplates.subscriptionRequestReceipt(data);
  return await sendEmail(userEmail, subject, html, text);
};

/**
 * Send chat notification to admin when user sends a message
 * @param {string} adminEmail
 * @param {Object} data - { userFullName, userEmail, messageText, chatId, dashboardUrl, sentAt }
 */
export const sendChatNotificationToAdmin = async (adminEmail, data = {}) => {
  const { subject, html, text } = emailTemplates.chatMessageToAdmin(data);
  return await sendEmail(adminEmail, subject, html, text);
};

/**
 * Send chat notification to user when admin sends a message
 * @param {string} userEmail
 * @param {Object} data - { adminFullName, userFullName, messageText, chatUrl, sentAt }
 */
export const sendChatNotificationToUser = async (userEmail, data = {}) => {
  const { subject, html, text } = emailTemplates.chatMessageToUser(data);
  return await sendEmail(userEmail, subject, html, text);
};