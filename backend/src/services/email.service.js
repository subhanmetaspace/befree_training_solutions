/**
 * Email Service
 * BeFree EdTech Platform
 * 
 * Handles all email notifications for orders and payments
 */

const nodemailer = require('nodemailer');

// Create transporter - configure based on your email provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@befreetraining.net';
const FROM_NAME = process.env.FROM_NAME || 'BeFree Training Solutions';
const COMPANY_NAME = 'BeFree Training Solutions';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@befreetraining.net';

/**
 * Send order created email
 */
async function sendOrderCreatedEmail(order) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${COMPANY_NAME}</h1>
        </div>
        <div class="content">
          <h2>Order Received</h2>
          <p>Dear ${order.first_name || order.firstName},</p>
          <p>Thank you for your order! We have received your order and are waiting for payment confirmation.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber || order.merchant_order_reference}</p>
            <p><strong>Plan:</strong> ${order.plan_name || order.planName}</p>
            <p><strong>Billing:</strong> ${order.billing_cycle || order.billingCycle}</p>
            <p><strong>Amount:</strong> ${order.currency || 'AED'} ${parseFloat(order.total_amount || order.amount).toFixed(2)}</p>
          </div>
          
          <p>If you haven't completed your payment, please do so to activate your subscription.</p>
        </div>
        <div class="footer">
          <p>If you have any questions, contact us at ${SUPPORT_EMAIL}</p>
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: order.email,
    subject: `Order Received - ${order.orderNumber || order.merchant_order_reference}`,
    html
  });
}

/**
 * Send payment success email
 */
async function sendPaymentSuccessEmail(order) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .success-badge { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${COMPANY_NAME}</h1>
          <p>Payment Successful</p>
        </div>
        <div class="content">
          <div style="text-align: center; margin: 20px 0;">
            <span class="success-badge">Payment Confirmed</span>
          </div>
          
          <p>Dear ${order.first_name || order.firstName},</p>
          <p>Great news! Your payment has been successfully processed.</p>
          
          <div class="order-details">
            <h3>Payment Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber || order.merchant_order_reference}</p>
            <p><strong>Plan:</strong> ${order.plan_name || order.planName}</p>
            <p><strong>Amount Paid:</strong> ${order.currency || 'AED'} ${parseFloat(order.total_amount || order.amount).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.cardBrand || 'Card'} ending in ${order.cardLastFour || '****'}</p>
            <p><strong>Transaction Date:</strong> ${new Date(order.paidAt || Date.now()).toLocaleString()}</p>
            ${order.authCode ? `<p><strong>Auth Code:</strong> ${order.authCode}</p>` : ''}
          </div>
          
          <p>Your subscription is now active! You can start accessing your classes immediately.</p>
          <p>An invoice will be sent separately for your records.</p>
        </div>
        <div class="footer">
          <p>If you have any questions, contact us at ${SUPPORT_EMAIL}</p>
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: order.email,
    subject: `Payment Confirmed - ${order.orderNumber || order.merchant_order_reference}`,
    html
  });
}

/**
 * Send payment failed email
 */
async function sendPaymentFailedEmail(order, reason = 'Payment declined') {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .failed-badge { background: #fef2f2; color: #991b1b; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${COMPANY_NAME}</h1>
          <p>Payment Failed</p>
        </div>
        <div class="content">
          <div style="text-align: center; margin: 20px 0;">
            <span class="failed-badge">Payment Unsuccessful</span>
          </div>
          
          <p>Dear ${order.first_name || order.firstName},</p>
          <p>Unfortunately, your payment could not be processed.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber || order.merchant_order_reference}</p>
            <p><strong>Plan:</strong> ${order.plan_name || order.planName}</p>
            <p><strong>Amount:</strong> ${order.currency || 'AED'} ${parseFloat(order.total_amount || order.amount).toFixed(2)}</p>
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
          
          <p>Please try again with a different payment method or contact your bank for more information.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/checkout" class="btn">Try Again</a>
          </div>
        </div>
        <div class="footer">
          <p>If you need assistance, contact us at ${SUPPORT_EMAIL}</p>
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: order.email,
    subject: `Payment Failed - ${order.orderNumber || order.merchant_order_reference}`,
    html
  });
}

/**
 * Send invoice email with PDF attachment
 */
async function sendInvoiceEmail(order, invoiceBuffer) {
  const invoiceNumber = `INV-${order.orderNumber || order.merchant_order_reference}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${COMPANY_NAME}</h1>
          <p>Invoice</p>
        </div>
        <div class="content">
          <p>Dear ${order.first_name || order.firstName},</p>
          <p>Please find attached your invoice for your recent purchase.</p>
          
          <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
          <p><strong>Amount:</strong> ${order.currency || 'AED'} ${parseFloat(order.total_amount || order.amount).toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(order.paidAt || Date.now()).toLocaleDateString()}</p>
          
          <p>Thank you for choosing ${COMPANY_NAME}!</p>
        </div>
        <div class="footer">
          <p>This is an automated email. For queries, contact ${SUPPORT_EMAIL}</p>
          <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: order.email,
    subject: `Your Invoice - ${invoiceNumber}`,
    html,
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        content: invoiceBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

module.exports = {
  sendOrderCreatedEmail,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendInvoiceEmail
};
