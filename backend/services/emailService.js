import { sendEmail } from '../config/mailtrap.js';

// Email templates
const emailTemplates = {
  welcome: (userName) => ({
    subject: 'Welcome to EliteRetoucher! 🎨',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to EliteRetoucher!</h1>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi ${userName},
          </p>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for joining EliteRetoucher! We're excited to help you enhance your photos with professional retouching services.
          </p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Upload and manage your photos</li>
              <li>Choose from our professional retouching styles</li>
              <li>Subscribe to our premium plans for unlimited access</li>
              <li>Chat with our support team</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            If you have any questions, feel free to reach out to our support team.
          </p>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Best regards,<br>
            The EliteRetoucher Team
          </p>
        </div>
      </div>
    `
  }),

  subscriptionConfirmation: (userName, planName, amount, startDate) => ({
    subject: 'Subscription Confirmed - EliteRetoucher',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #28a745; text-align: center; margin-bottom: 30px;">🎉 Subscription Confirmed!</h1>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi ${userName},
          </p>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Great news! Your subscription has been successfully activated.
          </p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Subscription Details:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Plan:</strong> ${planName}</li>
              <li><strong>Amount:</strong> $${amount}</li>
              <li><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</li>
              <li><strong>Status:</strong> <span style="color: #28a745;">Active</span></li>
            </ul>
          </div>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You now have access to all premium features including unlimited photo uploads and priority processing.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Dashboard
            </a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Best regards,<br>
            The EliteRetoucher Team
          </p>
        </div>
      </div>
    `
  }),

  photoReady: (userName, photoId, photoName) => ({
    subject: 'Your Photo is Ready! - EliteRetoucher',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #28a745; text-align: center; margin-bottom: 30px;">✨ Your Photo is Ready!</h1>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi ${userName},
          </p>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Great news! Your photo "${photoName}" has been professionally retouched and is ready for download.
          </p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Photo Details:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Photo ID:</strong> ${photoId}</li>
              <li><strong>Status:</strong> <span style="color: #28a745;">Completed</span></li>
              <li><strong>Ready Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View & Download
            </a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center;">
            If you're not satisfied with the result, please contact our support team.
          </p>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Best regards,<br>
            The EliteRetoucher Team
          </p>
        </div>
      </div>
    `
  }),

  paymentReceived: (userName, amount, transactionId) => ({
    subject: 'Payment Received - EliteRetoucher',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #28a745; text-align: center; margin-bottom: 30px;">💰 Payment Received!</h1>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi ${userName},
          </p>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We've successfully received your payment. Thank you for your business!
          </p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Amount:</strong> $${amount}</li>
              <li><strong>Transaction ID:</strong> ${transactionId}</li>
              <li><strong>Status:</strong> <span style="color: #28a745;">Confirmed</span></li>
              <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your account has been credited and you can now enjoy our premium services.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Premium Features
            </a>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Best regards,<br>
            The EliteRetoucher Team
          </p>
        </div>
      </div>
    `
  }),

  passwordReset: (userName, resetLink) => ({
    subject: 'Password Reset Request - EliteRetoucher',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #dc3545; text-align: center; margin-bottom: 30px;">🔐 Password Reset</h1>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi ${userName},
          </p>

          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You requested a password reset for your EliteRetoucher account. Click the button below to reset your password.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}"
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
              If you didn't request this password reset, please ignore this email.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; text-align: center;">
            Best regards,<br>
            The EliteRetoucher Team
          </p>
        </div>
      </div>
    `
  }),

  adminNotification: (subject, message, details = {}) => ({
    subject: `Admin Alert: ${subject}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #dc3545; text-align: center; margin-bottom: 30px;">🚨 Admin Notification</h1>

        <h2 style="color: #333; margin-bottom: 20px;">${subject}</h2>

        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          ${message}
        </p>

        ${Object.keys(details).length > 0 ? `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Details:</h3>
            <ul style="color: #666; line-height: 1.6;">
              ${Object.entries(details).map(([key, value]) =>
                `<li><strong>${key}:</strong> ${value}</li>`
              ).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin"
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Admin Panel
          </a>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center;">
          This is an automated notification from EliteRetoucher.
        </p>
      </div>
    </div>
    `
  }),

  newChatMessage: (senderName, recipientName, message, chatId) => ({
    subject: `💬 New Message from ${senderName} - EliteRetoucher`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #007bff; text-align: center; margin-bottom: 30px;">💬 New Message Received</h1>

        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Hi ${recipientName},
        </p>

        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          You have received a new message from <strong>${senderName}</strong> in your EliteRetoucher chat.
        </p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="color: #666; font-style: italic; margin: 0; line-height: 1.6;">
            "${message}"
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/chat"
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            💬 Reply to Message
          </a>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center;">
          This is an automated notification from EliteRetoucher.
        </p>

        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
          Chat ID: ${chatId}
        </p>
      </div>
    </div>
    `
  })
};

// Email service functions
export const sendWelcomeEmail = async (email, userName) => {
  const template = emailTemplates.welcome(userName);
  return await sendEmail(email, template.subject, template.html);
};

export const sendSubscriptionConfirmationEmail = async (email, userName, planName, amount, startDate) => {
  const template = emailTemplates.subscriptionConfirmation(userName, planName, amount, startDate);
  return await sendEmail(email, template.subject, template.html);
};

export const sendPhotoReadyEmail = async (email, userName, photoId, photoName) => {
  const template = emailTemplates.photoReady(userName, photoId, photoName);
  return await sendEmail(email, template.subject, template.html);
};

export const sendPaymentReceivedEmail = async (email, userName, amount, transactionId) => {
  const template = emailTemplates.paymentReceived(userName, amount, transactionId);
  return await sendEmail(email, template.subject, template.html);
};

export const sendPasswordResetEmail = async (email, userName, resetLink) => {
  const template = emailTemplates.passwordReset(userName, resetLink);
  return await sendEmail(email, template.subject, template.html);
};

export const sendAdminNotification = async (email, subject, message, details = {}) => {
  const template = emailTemplates.adminNotification(subject, message, details);
  return await sendEmail(email, template.subject, template.html);
};

export const sendChatMessageNotification = async (email, senderName, recipientName, message, chatId) => {
  const template = emailTemplates.newChatMessage(senderName, recipientName, message, chatId);
  return await sendEmail(email, template.subject, template.html);
};

// Generic email sender
export const sendCustomEmail = async (email, subject, htmlContent, textContent = '') => {
  return await sendEmail(email, subject, htmlContent, textContent);
};

export default {
  sendWelcomeEmail,
  sendSubscriptionConfirmationEmail,
  sendPhotoReadyEmail,
  sendPaymentReceivedEmail,
  sendPasswordResetEmail,
  sendAdminNotification,
  sendChatMessageNotification,
  sendCustomEmail
};
