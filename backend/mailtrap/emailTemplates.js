// emailTemplates.js

/**
 * Email templates for the Elite Retoucher application
 */

export const emailTemplates = {
  /**
   * Welcome email template
   * @param {string} userName - User's name
   * @returns {Object} - Email template data
   */
  welcome: (userName) => {
    const subject = "Welcome to Elite Retoucher! 🎉";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Elite Retoucher!</h1>
            <p>Professional Photo Retouching Services</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Welcome to Elite Retoucher, where your photos get the professional treatment they deserve!</p>
            <p>We're excited to have you on board. Here's what you can do with your account:</p>
            <ul>
              <li>Upload and retouch your photos with our AI-powered tools</li>
              <li>Choose from various retouching styles and effects</li>
              <li>Download high-quality processed images</li>
              <li>Manage your subscription and billing</li>
            </ul>
            <p>Ready to get started? Upload your first photo and see the magic happen!</p>
            <a href="https://www.eliteretoucher.com" class="button">Get Started</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Elite Retoucher Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Retoucher. All rights reserved.</p>
            <p>This email was sent to you because you created an account with us.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Welcome to Elite Retoucher!
      
      Hello ${userName}!
      
      Welcome to Elite Retoucher, where your photos get the professional treatment they deserve!
      
      We're excited to have you on board. Here's what you can do with your account:
      - Upload and retouch your photos with our AI-powered tools
      - Choose from various retouching styles and effects
      - Download high-quality processed images
      - Manage your subscription and billing
      
      Ready to get started? Visit: https://www.eliteretoucher.com
      
      If you have any questions, feel free to reach out to our support team.
      
      Best regards,
      The Elite Retoucher Team
      
      © 2024 Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  },

  /**
   * Password reset email template
   * @param {string} resetUrl - Password reset URL
   * @returns {Object} - Email template data
   */
  passwordReset: (resetUrl) => {
    const subject = "Reset Your Elite Retoucher Password";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
            <p>Elite Retoucher Account Security</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your Elite Retoucher account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            <p>Best regards,<br>The Elite Retoucher Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Retoucher. All rights reserved.</p>
            <p>This email was sent for account security purposes.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Password Reset Request - Elite Retoucher
      
      We received a request to reset your password for your Elite Retoucher account.
      
      Click this link to reset your password: ${resetUrl}
      
      Important: This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The Elite Retoucher Team
      
      © 2024 Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  },

  /**
   * Subscription confirmation email template
   * @param {string} planName - Subscription plan name
   * @param {string} amount - Subscription amount
   * @returns {Object} - Email template data
   */
  subscriptionConfirmation: (planName, amount) => {
    const subject = `Subscription Confirmed - ${planName} Plan`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Confirmed - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .plan-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Confirmed!</h1>
            <p>Welcome to the ${planName} Plan</p>
          </div>
          <div class="content">
            <h2>Thank you for your subscription!</h2>
            <p>Your subscription to the <strong>${planName}</strong> plan has been successfully activated.</p>
            <div class="plan-details">
              <h3>Subscription Details:</h3>
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Amount:</strong> $${amount}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            <p>You now have access to all the features included in your plan. Start uploading and retouching your photos right away!</p>
            <a href="https://www.eliteretoucher.com/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions about your subscription, please contact our support team.</p>
            <p>Best regards,<br>The Elite Retoucher Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Retoucher. All rights reserved.</p>
            <p>This email confirms your subscription purchase.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Subscription Confirmed - Elite Retoucher
      
      Thank you for your subscription!
      
      Your subscription to the ${planName} plan has been successfully activated.
      
      Subscription Details:
      - Plan: ${planName}
      - Amount: $${amount}
      - Status: Active
      
      You now have access to all the features included in your plan. Start uploading and retouching your photos right away!
      
      Visit your dashboard: https://www.eliteretoucher.com/dashboard
      
      If you have any questions about your subscription, please contact our support team.
      
      Best regards,
      The Elite Retoucher Team
      
      © 2024 Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  },

  /**
   * Photo processing complete email template
   * @param {string} photoId - Processed photo ID
   * @param {string} downloadUrl - Download URL for the processed photo
   * @returns {Object} - Email template data
   */
  photoProcessingComplete: (photoId, downloadUrl) => {
    const subject = "Your Photo is Ready! 📸";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Photo Processing Complete - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .photo-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Photo is Ready! 📸</h1>
            <p>Professional retouching complete</p>
          </div>
          <div class="content">
            <h2>Great news!</h2>
            <p>Your photo has been successfully processed and is ready for download.</p>
            <div class="photo-info">
              <h3>Photo Details:</h3>
              <p><strong>Photo ID:</strong> ${photoId}</p>
              <p><strong>Status:</strong> Processing Complete</p>
              <p><strong>Quality:</strong> High Resolution</p>
            </div>
            <p>Click the button below to download your retouched photo:</p>
            <a href="${downloadUrl}" class="button">Download Photo</a>
            <p>Your photo will be available for download for the next 30 days. Make sure to save it to your device!</p>
            <p>Need more photos retouched? Upload another one and we'll process it for you.</p>
            <p>Best regards,<br>The Elite Retoucher Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Retoucher. All rights reserved.</p>
            <p>This email confirms your photo processing is complete.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Your Photo is Ready! - Elite Retoucher
      
      Great news! Your photo has been successfully processed and is ready for download.
      
      Photo Details:
      - Photo ID: ${photoId}
      - Status: Processing Complete
      - Quality: High Resolution
      
      Download your retouched photo: ${downloadUrl}
      
      Your photo will be available for download for the next 30 days. Make sure to save it to your device!
      
      Need more photos retouched? Upload another one and we'll process it for you.
      
      Best regards,
      The Elite Retoucher Team
      
      © 2024 Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  },

  /**
   * Invoice email template
   * @param {Object} invoiceData - Invoice data
   * @returns {Object} - Email template data
   */
  invoice: (invoiceData) => {
    const subject = `Invoice #${invoiceData.invoiceNumber} - Elite Retoucher`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6c757d; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .invoice-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice</h1>
            <p>Elite Retoucher Services</p>
          </div>
          <div class="content">
            <h2>Invoice #${invoiceData.invoiceNumber}</h2>
            <div class="invoice-details">
              <p><strong>Date:</strong> ${invoiceData.date}</p>
              <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
              <p><strong>Status:</strong> ${invoiceData.status}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Total Amount:</strong></td>
                  <td><strong>$${invoiceData.totalAmount}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p>Thank you for your business! If you have any questions about this invoice, please contact us.</p>
            <p>Best regards,<br>The Elite Retoucher Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Retoucher. All rights reserved.</p>
            <p>This is an automated invoice email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Invoice #${invoiceData.invoiceNumber} - Elite Retoucher
      
      Date: ${invoiceData.date}
      Due Date: ${invoiceData.dueDate}
      Status: ${invoiceData.status}
      
      Items:
      ${invoiceData.items.map(item => `- ${item.description} (Qty: ${item.quantity}) - $${item.price} each = $${item.total}`).join('\n')}
      
      Total Amount: $${invoiceData.totalAmount}
      
      Thank you for your business! If you have any questions about this invoice, please contact us.
      
      Best regards,
      The Elite Retoucher Team
      
      © 2024 Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  },

  /**
   * Admin notification email template
   * @param {string} notificationType - Type of notification
   * @param {Object} data - Notification data
   * @returns {Object} - Email template data
   */
  adminNotification: (notificationType, data) => {
    const subject = `Admin Notification: ${notificationType} - Elite Retoucher`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .notification-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Admin Notification</h1>
            <p>${notificationType}</p>
          </div>
          <div class="content">
            <h2>System Notification</h2>
            <div class="notification-details">
              <h3>Notification Type:</h3>
              <p>${notificationType}</p>
              <h3>Details:</h3>
              <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
            <p>Please review this notification and take appropriate action if necessary.</p>
            <p>Best regards,<br>Elite Retoucher System</p>
          </div>
          <div class="footer">
            <p>© 2024 Elite Retoucher. All rights reserved.</p>
            <p>This is an automated admin notification.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Admin Notification - Elite Retoucher
      
      Notification Type: ${notificationType}
      
      Details:
      ${JSON.stringify(data, null, 2)}
      
      Please review this notification and take appropriate action if necessary.
      
      Best regards,
      Elite Retoucher System
      
      © 2024 Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  }
};
