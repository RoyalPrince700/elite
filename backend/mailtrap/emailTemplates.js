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
    const firstName = userName.split(' ')[0];
    const subject = "Welcome to Elite Retoucher!";
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
          .steps { margin: 20px 0; }
          .step { margin: 15px 0; padding-left: 20px; position: relative; }
          .step-number { position: absolute; left: 0; background: #667eea; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; font-size: 12px; line-height: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Elite Retoucher!</h1>
            <p>Your destination for professional, high-end photo retouching</p>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Welcome to Elite Retoucher, your destination for professional, high-end photo retouching. We're excited to bring your images to life with exceptional detail and quality.</p>

            <p>Here's how to get started:</p>

            <div class="steps">
              <div class="step">
                <span class="step-number">1</span>
                Choose Your Service – Select a Subscription Plan for ongoing retouching or a Per-Image Option for one-time projects.
              </div>
              <div class="step">
                <span class="step-number">2</span>
                Upload Your Photos – After selecting your plan, send us the images you'd like retouched.
              </div>
              <div class="step">
                <span class="step-number">3</span>
                Download the Results – Receive beautifully retouched, high-resolution images ready for print or online use.
              </div>
            </div>

            <p>With your account, you can also track orders, manage your plan, and securely download completed edits anytime.</p>

            <p>Start by selecting the service that best fits your needs:</p>
            <a href="https://www.eliteretoucher.com/pricing" class="button">View Plans & Pricing</a>

            <p>Thanks for choosing Elite Retoucher—your photos deserve expert retouching every time.</p>

            <p>Best regards,<br>The Elite Retoucher Team<br><a href="https://www.eliteretoucher.com">www.eliteretoucher.com</a></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.</p>
            <p>This email was sent to you because you created an account with us.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Welcome to Elite Retoucher!

      Hi ${firstName},

      Welcome to Elite Retoucher, your destination for professional, high-end photo retouching. We're excited to bring your images to life with exceptional detail and quality.

      Here's how to get started:

      1. Choose Your Service – Select a Subscription Plan for ongoing retouching or a Per-Image Option for one-time projects.

      2. Upload Your Photos – After selecting your plan, send us the images you'd like retouched.

      3. Download the Results – Receive beautifully retouched, high-resolution images ready for print or online use.

      With your account, you can also track orders, manage your plan, and securely download completed edits anytime.

      Start by selecting the service that best fits your needs: View Plans & Pricing
      https://www.eliteretoucher.com/pricing

      Thanks for choosing Elite Retoucher—your photos deserve expert retouching every time.

      Best regards,
      The Elite Retoucher Team
      www.eliteretoucher.com

      © ${new Date().getFullYear()} Elite Retoucher. All rights reserved.
    `;
    return { subject, html, text };
  },

  /**
   * Pay-per-image activated email template
   * @param {Object} data
   * @param {string} data.fullName
   * @param {string} data.serviceName
   * @param {number} data.quantity
   * @param {string} data.currency
   * @param {number} data.unitPrice
   * @param {number} data.totalPrice
   * @param {Date|string} [data.activatedAt]
   * @returns {Object}
   */
  payPerImageActivated: (data = {}) => {
    const {
      fullName = 'Customer',
      serviceName = 'Pay-per-Image Service',
      quantity = 1,
      currency = 'USD',
      unitPrice,
      totalPrice,
      activatedAt
    } = data || {};

    const firstName = (fullName || '').split(' ')[0] || 'there';
    const currencySymbol = currency === 'NGN' ? '₦' : '$';
    const unitStr = typeof unitPrice === 'number' ? unitPrice.toLocaleString() : unitPrice;
    const totalStr = typeof totalPrice === 'number' ? totalPrice.toLocaleString() : totalPrice;
    const dateStr = activatedAt ? new Date(activatedAt).toLocaleDateString() : new Date().toLocaleDateString();

    const subject = `Your ${serviceName} is Active – ${quantity} images`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pay-per-Image Activated - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; }
          .container { max-width: 640px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 28px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; }
          .section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 14px 0; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; }
          .label { color: #64748b; }
          .value { color: #0f172a; font-weight: 600; }
          .button { display: inline-block; background: #0ea5e9; color: #ffffff !important; padding: 12px 20px; text-decoration: none; border-radius: 8px; margin-top: 14px; font-weight: 600; }
          .footer { text-align: center; margin-top: 16px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're all set, ${firstName}! ✅</h1>
            <p>Your pay-per-image order is now active</p>
          </div>
          <div class="content">
            <p>Thanks for your purchase. You can now submit up to <strong>${quantity}</strong> images for <strong>${serviceName}</strong>.</p>
            <div class="section">
              <div class="row"><span class="label">Service</span><span class="value">${serviceName}</span></div>
              <div class="row"><span class="label">Images</span><span class="value">${quantity}</span></div>
              ${unitStr ? `<div class="row"><span class="label">Unit price</span><span class="value">${currencySymbol}${unitStr} ${currency}</span></div>` : ''}
              ${totalStr ? `<div class="row"><span class="label">Total paid</span><span class="value">${currencySymbol}${totalStr} ${currency}</span></div>` : ''}
              <div class="row"><span class="label">Activated</span><span class="value">${dateStr}</span></div>
              <div class="row"><span class="label">Status</span><span class="value">Active</span></div>
            </div>
            <p>Head to your dashboard to upload photos and track progress.</p>
            <a href="https://www.eliteretoucher.com/dashboard" class="button">Open Dashboard</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = [
      `You're all set, ${firstName}!`,
      `Your pay-per-image order is now active.`,
      `Service: ${serviceName}`,
      `Images: ${quantity}`,
      unitStr ? `Unit price: ${currencySymbol}${unitStr} ${currency}` : '',
      totalStr ? `Total paid: ${currencySymbol}${totalStr} ${currency}` : '',
      `Activated: ${dateStr}`,
      'Status: Active',
      '',
      'Open Dashboard: https://www.eliteretoucher.com/dashboard'
    ].filter(Boolean).join('\n');

    return { subject, html, text };
  },

  /**
   * Subscription activated email template
   * @param {Object} data
   * @param {string} data.fullName
   * @param {string} data.planName
   * @param {string} data.billingCycle
   * @param {string} data.currency
   * @param {number|string} data.amount
   * @param {Date|string} data.startDate
   * @param {Date|string} data.endDate
   * @returns {Object}
   */
  subscriptionActivated: (data = {}) => {
    const {
      fullName = 'Customer',
      planName = 'Your Plan',
      billingCycle = 'monthly',
      currency = 'USD',
      amount,
      startDate,
      endDate
    } = data;

    const firstName = (fullName || '').split(' ')[0] || 'there';
    const currencySymbol = currency === 'NGN' ? '₦' : '$';
    const formattedAmount = typeof amount === 'number' ? amount.toLocaleString() : amount;
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : null;
    const startStr = start.toLocaleDateString();
    const endStr = end ? end.toLocaleDateString() : '';

    const subject = `Your Subscription is Active – ${planName} (${billingCycle})`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Activated - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; }
          .container { max-width: 640px; margin: 0 auto; padding: 20px; }
          .header { background: #16a34a; color: white; padding: 28px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; }
          .section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 14px 0; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; }
          .label { color: #64748b; }
          .value { color: #0f172a; font-weight: 600; }
          .button { display: inline-block; background: #0ea5e9; color: #ffffff !important; padding: 12px 20px; text-decoration: none; border-radius: 8px; margin-top: 14px; font-weight: 600; }
          .footer { text-align: center; margin-top: 16px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Congratulations, ${firstName}! 🎉</h1>
            <p>Your subscription is now active</p>
          </div>
          <div class="content">
            <p>We're excited to let you know that your subscription has been activated.</p>
            <div class="section">
              <div class="row"><span class="label">Plan</span><span class="value">${planName}</span></div>
              <div class="row"><span class="label">Billing cycle</span><span class="value">${billingCycle}</span></div>
              ${formattedAmount ? `<div class="row"><span class="label">Amount</span><span class="value">${currencySymbol}${formattedAmount} ${currency}</span></div>` : ''}
              <div class="row"><span class="label">Start date</span><span class="value">${startStr}</span></div>
              ${endStr ? `<div class="row"><span class="label">Expires</span><span class="value">${endStr}</span></div>` : ''}
              <div class="row"><span class="label">Status</span><span class="value">Active</span></div>
            </div>
            <p>Head to your dashboard to view your plan details and start submitting images.</p>
            <a href="https://www.eliteretoucher.com/dashboard" class="button">Open Dashboard</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Your subscription is active – ${planName} (${billingCycle})

      Plan: ${planName}
      Billing cycle: ${billingCycle}
      ${formattedAmount ? `Amount: ${currencySymbol}${formattedAmount} ${currency}\n` : ''}Start date: ${startStr}
      ${endStr ? `Expires: ${endStr}\n` : ''}Status: Active

      Open Dashboard: https://www.eliteretoucher.com/dashboard
    `;
    return { subject, html, text };
  },

  /**
   * Subscription request receipt email template
   * @param {Object} data - Receipt data
   * @param {string} data.fullName - User's full name
   * @param {string} data.planName - Plan name
   * @param {string} data.billingCycle - Billing cycle (monthly|yearly)
   * @param {number|string} data.amount - Final amount
   * @param {string} data.currency - Currency code (USD|NGN)
   * @param {string} [data.companyName]
   * @param {string} [data.contactPerson]
   * @param {Object} [data.address]
   * @returns {Object}
   */
  subscriptionRequestReceipt: (data) => {
    const {
      fullName = 'Customer',
      planName,
      billingCycle,
      amount,
      currency = 'USD',
      companyName,
      contactPerson,
      address,
    } = data || {};

    const currencySymbol = currency === 'NGN' ? '₦' : '$';
    const formattedAmount = typeof amount === 'number' ? amount.toLocaleString() : amount;
    const subject = `Subscription Request Received - ${planName} (${billingCycle})`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Request Receipt - Elite Retoucher</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 24px; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; }
          .label { color: #475569; }
          .value { font-weight: 600; color: #0f172a; }
          .button { display: inline-block; background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 12px; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thanks for your request, ${fullName}!</h1>
            <p>We’ve received your subscription details.</p>
          </div>
          <div class="content">
            <p>Here is a receipt of your subscription request. We’ll email your invoice and next steps shortly.</p>
            <div class="section">
              <div class="row"><span class="label">Plan</span><span class="value">${planName}</span></div>
              <div class="row"><span class="label">Billing cycle</span><span class="value">${billingCycle}</span></div>
              <div class="row"><span class="label">Amount</span><span class="value">${currencySymbol}${formattedAmount}</span></div>
              <div class="row"><span class="label">Currency</span><span class="value">${currency}</span></div>
            </div>
            ${companyName || contactPerson || address ? `
            <div class="section">
              <h3 style="margin:0 0 8px 0;">Billing info</h3>
              ${companyName ? `<div class="row"><span class="label">Company</span><span class="value">${companyName}</span></div>` : ''}
              ${contactPerson ? `<div class="row"><span class="label">Contact</span><span class="value">${contactPerson}</span></div>` : ''}
              ${address ? `<div style="margin-top:8px;">
                <div class="label" style="margin-bottom:4px;">Address</div>
                <div class="value" style="white-space:pre-line;">
                  ${[address?.street, address?.city, address?.state, address?.zipCode, address?.country].filter(Boolean).join(', ')}
                </div>
              </div>` : ''}
            </div>` : ''}
            <p>If anything looks incorrect, reply to this email and we’ll help fix it.</p>
            <a href="https://www.eliteretoucher.com/dashboard" class="button">View dashboard</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const text = `
      Subscription Request Receipt - Elite Retoucher

      Thanks for your request, ${fullName}!

      Plan: ${planName}
      Billing cycle: ${billingCycle}
      Amount: ${currencySymbol}${formattedAmount}
      Currency: ${currency}

      ${companyName ? `Company: ${companyName}\n` : ''}${contactPerson ? `Contact: ${contactPerson}\n` : ''}${address ? `Address: ${[address?.street, address?.city, address?.state, address?.zipCode, address?.country].filter(Boolean).join(', ')}` : ''}

      View dashboard: https://www.eliteretoucher.com/dashboard
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
          .button { display: inline-block; background: #0ea5e9; color: #ffffff !important; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin: 16px 0; font-weight: 600; }
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
            <p>You can view this invoice and make payment from your dashboard.</p>
            <p>
              <a href="https://www.eliteretoucher.com/dashboard" class="button" target="_blank" rel="noopener noreferrer">Go to Dashboard</a>
            </p>
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
      
      View and pay your invoice in your dashboard:
      https://www.eliteretoucher.com/dashboard
      
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
  adminNotification: (notificationType, data = {}) => {
    const {
      requestId,
      createdAt,
      user = {},
      plan = {},
      billingCycle,
      currency = 'USD',
      amount,
      companyName,
      contactPerson,
      phone,
      address = {}
    } = data || {};

    const currencySymbol = currency === 'NGN' ? '₦' : '$';
    const formattedAmount = typeof amount === 'number' ? amount.toLocaleString() : (amount || '');
    const createdAtDisplay = createdAt ? new Date(createdAt).toUTCString() : new Date().toUTCString();

    const subjectBase = notificationType?.toLowerCase?.().includes('subscription')
      ? `New Subscription Request`
      : notificationType || 'Admin Notification';
    const subjectSuffix = plan?.name ? ` – ${plan.name}${billingCycle ? ` (${billingCycle})` : ''}` : '';
    const subject = `${subjectBase}${subjectSuffix}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; background:#f1f5f9; }
          .container { max-width: 640px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align:center; }
          .content { background: #ffffff; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(15,23,42,0.08); }
          .section { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; font-size:14px; }
          .label { color: #64748b; }
          .value { color: #0f172a; font-weight:600; }
          .h3 { margin: 0 0 8px 0; color:#0f172a; font-size:16px; }
          .footer { text-align: center; margin-top: 16px; color: #64748b; font-size: 12px; }
          .pill { display:inline-block; background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="pill">${notificationType || 'Notification'}</div>
            <h1 style="margin:8px 0 0 0; font-size:22px;">${subjectBase}</h1>
            ${plan?.name ? `<div style="margin-top:4px; opacity:0.9;">Plan: <strong>${plan.name}</strong>${billingCycle ? ` • ${billingCycle}` : ''}</div>` : ''}
          </div>
          <div class="content">
            <div class="section">
              <div class="h3">Request Summary</div>
              ${requestId ? `<div class="row"><div class="label">Request ID</div><div class="value">${requestId}</div></div>` : ''}
              <div class="row"><div class="label">Created</div><div class="value">${createdAtDisplay}</div></div>
              ${plan?.name ? `<div class="row"><div class="label">Plan</div><div class="value">${plan.name}</div></div>` : ''}
              ${billingCycle ? `<div class="row"><div class="label">Billing Cycle</div><div class="value">${billingCycle}</div></div>` : ''}
              ${formattedAmount ? `<div class="row"><div class="label">Amount</div><div class="value">${currencySymbol}${formattedAmount} ${currency}</div></div>` : ''}
            </div>

            <div class="section">
              <div class="h3">User</div>
              ${user.fullName ? `<div class="row"><div class="label">Name</div><div class="value">${user.fullName}</div></div>` : ''}
              ${user.email ? `<div class="row"><div class="label">Email</div><div class="value">${user.email}</div></div>` : ''}
              ${user.id ? `<div class="row"><div class="label">User ID</div><div class="value">${user.id}</div></div>` : ''}
            </div>

            ${(companyName || contactPerson || phone || (address && (address.street || address.city || address.state || address.zipCode || address.country))) ? `
            <div class="section">
              <div class="h3">Billing & Contact</div>
              ${companyName ? `<div class="row"><div class="label">Company</div><div class="value">${companyName}</div></div>` : ''}
              ${contactPerson ? `<div class="row"><div class="label">Contact</div><div class="value">${contactPerson}</div></div>` : ''}
              ${phone ? `<div class="row"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ''}
              ${(address.street || address.city || address.state || address.zipCode || address.country) ? `
              <div style="margin-top:8px;">
                <div class="label" style="margin-bottom:4px;">Address</div>
                <div class="value" style="white-space:pre-line;">${[
                  address.street,
                  address.city,
                  address.state,
                  address.zipCode,
                  address.country
                ].filter(Boolean).join(', ')}</div>
              </div>` : ''}
            </div>` : ''}

            <p style="margin-top:12px; font-size:14px; color:#334155;">Please review this request in the admin dashboard and take appropriate action.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textLines = [];
    textLines.push(`${subjectBase}${plan?.name ? ` - ${plan.name}${billingCycle ? ` (${billingCycle})` : ''}` : ''}`);
    if (requestId) textLines.push(`Request ID: ${requestId}`);
    textLines.push(`Created: ${createdAtDisplay}`);
    if (plan?.name) textLines.push(`Plan: ${plan.name}`);
    if (billingCycle) textLines.push(`Billing Cycle: ${billingCycle}`);
    if (formattedAmount) textLines.push(`Amount: ${currencySymbol}${formattedAmount} ${currency}`);
    if (user.fullName) textLines.push(`User: ${user.fullName}`);
    if (user.email) textLines.push(`Email: ${user.email}`);
    if (companyName) textLines.push(`Company: ${companyName}`);
    if (contactPerson) textLines.push(`Contact: ${contactPerson}`);
    if (phone) textLines.push(`Phone: ${phone}`);
    if (address && (address.street || address.city || address.state || address.zipCode || address.country)) {
      textLines.push(`Address: ${[
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.country
      ].filter(Boolean).join(', ')}`);
    }
    textLines.push('\nPlease review this request in the admin dashboard.');

    const text = textLines.join('\n');
    return { subject, html, text };
  },

  /**
   * Chat: Notify admin about a new user message
   * @param {Object} data
   * @param {string} data.userFullName
   * @param {string} data.userEmail
   * @param {string} data.messageText
   * @param {string} [data.chatId]
   * @param {string} [data.dashboardUrl]
   * @param {Date|string} [data.sentAt]
   */
  chatMessageToAdmin: (data = {}) => {
    const {
      userFullName = 'User',
      userEmail = '',
      messageText = '',
      chatId,
      dashboardUrl = 'https://www.eliteretoucher.com/admin',
      sentAt
    } = data || {};

    const subject = `New Chat Message from ${userFullName}`;
    const createdDisplay = sentAt ? new Date(sentAt).toUTCString() : new Date().toUTCString();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Chat Message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; background:#f1f5f9; }
          .container { max-width: 640px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; border-radius: 12px 12px 0 0; }
          .content { background: #ffffff; padding: 20px; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(15,23,42,0.08); }
          .row { display: flex; justify-content: space-between; margin: 8px 0; font-size:14px; }
          .label { color: #64748b; }
          .value { color: #0f172a; font-weight:600; }
          .button { display:inline-block; background:#0ea5e9; color:#ffffff !important; padding: 10px 16px; text-decoration:none; border-radius:8px; margin-top: 14px; font-weight:600; }
          .meta { font-size:12px; color:#64748b; margin-top:8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">New Chat Message</h1>
            <div class="meta">${createdDisplay}</div>
          </div>
          <div class="content">
            <div class="row"><div class="label">From</div><div class="value">${userFullName}</div></div>
            ${userEmail ? `<div class="row"><div class="label">Email</div><div class="value">${userEmail}</div></div>` : ''}
            ${chatId ? `<div class="row"><div class="label">Chat ID</div><div class="value">${chatId}</div></div>` : ''}
            <p style="margin-top:6px; color:#334155;">You have received a new chat message. Log in to your dashboard to view and reply.</p>
            <a class="button" href="${dashboardUrl}">Open Admin Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = [
      'New Chat Message',
      `From: ${userFullName}`,
      userEmail ? `Email: ${userEmail}` : '',
      chatId ? `Chat ID: ${chatId}` : '',
      `Time: ${createdDisplay}`,
      '',
      'You have a new chat message. View it in your dashboard.',
      `Open Admin Dashboard: ${dashboardUrl}`
    ].filter(Boolean).join('\n');

    return { subject, html, text };
  },

  /**
   * Deliverables notification email template
   * @param {Object} data
   * @param {string} data.userFullName - User's full name
   * @param {string} data.title - Deliverable title
   * @param {string} data.description - Deliverable description
   * @param {string} data.downloadUrl - Direct download link
   * @param {string} data.dashboardUrl - Dashboard URL with downloads tab
   * @param {string} [data.adminName] - Admin who created the deliverable
   * @param {Date|string} [data.createdAt] - When deliverable was created
   * @returns {Object}
   */
  deliverablesNotification: (data = {}) => {
    const {
      userFullName = 'Customer',
      title = 'Your Deliverable',
      description = '',
      downloadUrl = '#',
      dashboardUrl = 'https://www.eliteretoucher.com/dashboard?tab=downloads',
      adminName = 'Admin',
      createdAt
    } = data || {};

    const firstName = (userFullName || '').split(' ')[0] || 'there';
    const subject = `New Deliverable Available: ${title}`;
    const createdDisplay = createdAt ? new Date(createdAt).toLocaleDateString() : new Date().toLocaleDateString();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Deliverable Available</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; background:#f1f5f9; }
          .container { max-width: 640px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 28px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: #ffffff; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(15,23,42,0.08); }
          .deliverable-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0; background: #f8fafc; }
          .button { display: inline-block; background: #0ea5e9; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 12px 6px 0 0; font-weight: 600; text-align: center; }
          .secondary-button { background: #64748b; }
          .meta { font-size: 12px; color: #64748b; margin-top: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
          .download-icon { display: inline-block; margin-right: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size:24px;">📦 New Deliverable Available!</h1>
            <p style="margin:8px 0 0 0; opacity:0.9;">your retouch images is ready for download</p>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Great news! Your deliverable has been added to your Download Center.</p>

            <div class="deliverable-card">
              <h3 style="margin:0 0 8px 0; color:#0f172a; font-size:18px;">${title}</h3>
              ${description ? `<p style="margin:0 0 12px 0; color:#475569;">${description}</p>` : ''}
              <div class="meta">
                Added on ${createdDisplay} by ${adminName}
              </div>
            </div>

            <p>Access your deliverable through your dashboard:</p>

            <a href="${dashboardUrl}" class="button secondary-button">
              View in Dashboard
            </a>

            <p style="margin-top:16px; color:#334155; font-size:14px;">
              Your downloads are securely stored and available anytime. Check your Download Center for all your completed work.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = [
      `Hi ${firstName},`,
      '',
      'Great news! Your deliverable has been added to your Download Center.',
      '',
      `Title: ${title}`,
      description ? `Description: ${description}` : '',
      `Added on: ${createdDisplay} by ${adminName}`,
      '',
      'View in your dashboard:',
      dashboardUrl,
      '',
      'Your downloads are securely stored and available anytime.',
      '',
      `© ${new Date().getFullYear()} Elite Retoucher. All rights reserved.`
    ].filter(Boolean).join('\n');

    return { subject, html, text };
  },

  /**
   * Chat: Notify user about a new admin message
   * @param {Object} data
   * @param {string} data.adminFullName
   * @param {string} data.userFullName
   * @param {string} data.messageText
   * @param {string} [data.chatUrl]
   * @param {Date|string} [data.sentAt]
   */
  chatMessageToUser: (data = {}) => {
    const {
      adminFullName = 'Admin',
      userFullName = 'Customer',
      messageText = '',
      chatUrl = 'https://www.eliteretoucher.com/dashboard',
      sentAt
    } = data || {};

    const firstName = (userFullName || '').split(' ')[0] || 'there';
    const subject = `New Message from ${adminFullName}`;
    const createdDisplay = sentAt ? new Date(sentAt).toUTCString() : new Date().toUTCString();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; background:#f8fafc; }
          .container { max-width: 640px; margin: 0 auto; padding: 20px; }
          .header { background: #16a34a; color: white; padding: 20px; border-radius: 12px 12px 0 0; }
          .content { background: #ffffff; padding: 20px; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(15,23,42,0.08); }
          .button { display:inline-block; background:#0ea5e9; color:#ffffff !important; padding: 10px 16px; text-decoration:none; border-radius:8px; margin-top: 14px; font-weight:600; }
          .meta { font-size:12px; color:#64748b; margin-top:8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">You have a new message</h1>
            <div class="meta">${createdDisplay}</div>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p><strong>${adminFullName}</strong> sent you a new message. Open your dashboard to view and reply.</p>
            <a class="button" href="${chatUrl}">Reply in your dashboard</a>
            <p style="margin-top:12px; color:#334155; font-size:14px;">You can also open the chat widget from any page when you're signed in.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = [
      `Hi ${firstName},`,
      `${adminFullName} sent you a new message.`,
      'Open your dashboard to view and reply.',
      `Reply in your dashboard: ${chatUrl}`
    ].join('\n');

    return { subject, html, text };
  }
};
