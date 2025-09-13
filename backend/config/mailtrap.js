import nodemailer from 'nodemailer';

// Create production email transporter
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'mailtrap-production';

  switch (emailService) {
    case 'mailtrap-production':
      // Production Mailtrap (paid plan for real email sending)
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_PROD_HOST || 'live.smtp.mailtrap.io',
        port: process.env.MAILTRAP_PROD_PORT || 587,
        secure: false,
        auth: {
          user: process.env.MAILTRAP_PROD_USER,
          pass: process.env.MAILTRAP_PROD_PASS
        }
      });

    case 'mailtrap-testing':
      // Original Mailtrap testing/sandbox
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.MAILTRAP_PORT || 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      });

    case 'sendgrid':
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });

    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

    case 'mailgun':
      return nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILGUN_SMTP_USER,
          pass: process.env.MAILGUN_SMTP_PASSWORD
        }
      });

    default:
      // Default to production Mailtrap
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_PROD_HOST || 'live.smtp.mailtrap.io',
        port: process.env.MAILTRAP_PROD_PORT || 587,
        secure: false,
        auth: {
          user: process.env.MAILTRAP_PROD_USER,
          pass: process.env.MAILTRAP_PROD_PASS
        }
      });
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    const service = process.env.EMAIL_SERVICE || 'mailtrap-production';
    const transporter = createTransporter();
    await transporter.verify();
    console.log(`✅ ${service.toUpperCase()} connection successful`);
    return true;
  } catch (error) {
    const service = process.env.EMAIL_SERVICE || 'mailtrap-production';
    console.error(`❌ ${service.toUpperCase()} connection failed:`, error.message);
    return false;
  }
};

// Send email function
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.MAILTRAP_FROM || 'noreply@eliteretoucher.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};
