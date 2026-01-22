/**
 * Invoice Service
 * BeFree EdTech Platform
 * 
 * Generates PDF invoices for orders
 */

const PDFDocument = require('pdfkit');

const COMPANY_NAME = 'BeFree Training Solutions';
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || 'Dubai, United Arab Emirates';
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'befreeeducation7107@gmail.com';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+971 XX XXX XXXX';
const COMPANY_TRN = process.env.COMPANY_TRN || ''; // Tax Registration Number if applicable

/**
 * Generate invoice HTML (for web display)
 */
function generateInvoiceHTML(order) {
  const invoiceNumber = `INV-${order.orderNumber || order.merchant_order_reference}`;
  const invoiceDate = new Date(order.paidAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  const subtotal = parseFloat(order.base_price || order.total_amount) * (order.quantity || 1);
  const discount = parseFloat(order.discount_amount || 0);
  const tax = parseFloat(order.tax_amount || 0);
  const total = parseFloat(order.total_amount || order.amount);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', Arial, sans-serif; font-size: 14px; color: #333; }
        .invoice { max-width: 800px; margin: 0 auto; padding: 40px; background: white; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company-info h1 { color: #1a365d; font-size: 24px; margin-bottom: 10px; }
        .company-info p { color: #666; line-height: 1.6; }
        .invoice-info { text-align: right; }
        .invoice-info h2 { color: #1a365d; font-size: 28px; margin-bottom: 10px; }
        .invoice-info p { color: #666; }
        .billing-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .billing-box { width: 45%; }
        .billing-box h3 { color: #1a365d; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .billing-box p { line-height: 1.8; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #1a365d; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .text-right { text-align: right; }
        .totals { width: 300px; margin-left: auto; }
        .totals tr td { padding: 8px 12px; }
        .totals .total-row { font-weight: bold; font-size: 18px; background: #f3f4f6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; }
        .paid-stamp { color: #059669; font-size: 24px; font-weight: bold; border: 3px solid #059669; padding: 10px 20px; transform: rotate(-10deg); display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="company-info">
            <h1>${COMPANY_NAME}</h1>
            <p>${COMPANY_ADDRESS}</p>
            <p>Email: ${COMPANY_EMAIL}</p>
            <p>Phone: ${COMPANY_PHONE}</p>
            ${COMPANY_TRN ? `<p>TRN: ${COMPANY_TRN}</p>` : ''}
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoiceDate}</p>
            <p><strong>Order #:</strong> ${order.orderNumber || order.merchant_order_reference}</p>
          </div>
        </div>

        <div class="billing-section">
          <div class="billing-box">
            <h3>Bill To</h3>
            <p><strong>${order.first_name || order.firstName} ${order.last_name || order.lastName}</strong></p>
            <p>${order.email}</p>
            ${order.phone ? `<p>${order.phone}</p>` : ''}
            ${order.address_line1 || order.address1 ? `<p>${order.address_line1 || order.address1}</p>` : ''}
            ${order.city ? `<p>${order.city}${order.state ? `, ${order.state}` : ''} ${order.postal_code || ''}</p>` : ''}
            ${order.country ? `<p>${order.country}</p>` : ''}
          </div>
          <div class="billing-box">
            <h3>Payment Info</h3>
            <p><strong>Status:</strong> <span style="color: #059669;">Paid</span></p>
            <p><strong>Method:</strong> ${order.cardBrand || 'Card'} **** ${order.cardLastFour || '****'}</p>
            ${order.authCode ? `<p><strong>Auth Code:</strong> ${order.authCode}</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Billing Cycle</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.plan_name || order.planName || 'Subscription Plan'}</td>
              <td>${(order.billing_cycle || order.billingCycle || 'monthly').charAt(0).toUpperCase() + (order.billing_cycle || order.billingCycle || 'monthly').slice(1)}</td>
              <td class="text-right">${order.quantity || 1}</td>
              <td class="text-right">${order.currency || 'AED'} ${parseFloat(order.base_price || order.total_amount).toFixed(2)}</td>
              <td class="text-right">${order.currency || 'AED'} ${subtotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td>Subtotal</td>
            <td class="text-right">${order.currency || 'AED'} ${subtotal.toFixed(2)}</td>
          </tr>
          ${discount > 0 ? `
          <tr>
            <td>Discount</td>
            <td class="text-right" style="color: #059669;">-${order.currency || 'AED'} ${discount.toFixed(2)}</td>
          </tr>
          ` : ''}
          ${tax > 0 ? `
          <tr>
            <td>Tax (5% VAT)</td>
            <td class="text-right">${order.currency || 'AED'} ${tax.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td>Total</td>
            <td class="text-right">${order.currency || 'AED'} ${total.toFixed(2)}</td>
          </tr>
        </table>

        <div style="text-align: center;">
          <div class="paid-stamp">PAID</div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For any questions, please contact ${COMPANY_EMAIL}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate invoice PDF
 */
async function generateInvoicePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const invoiceNumber = `INV-${order.orderNumber || order.merchant_order_reference}`;
      const invoiceDate = new Date(order.paidAt || Date.now()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const subtotal = parseFloat(order.base_price || order.total_amount) * (order.quantity || 1);
      const discount = parseFloat(order.discount_amount || 0);
      const tax = parseFloat(order.tax_amount || 0);
      const total = parseFloat(order.total_amount || order.amount);
      const currency = order.currency || 'AED';

      // Header
      doc.fontSize(24).fillColor('#1a365d').text(COMPANY_NAME, 50, 50);
      doc.fontSize(10).fillColor('#666')
        .text(COMPANY_ADDRESS, 50, 80)
        .text(`Email: ${COMPANY_EMAIL}`, 50, 95)
        .text(`Phone: ${COMPANY_PHONE}`, 50, 110);

      // Invoice title
      doc.fontSize(28).fillColor('#1a365d').text('INVOICE', 400, 50, { align: 'right' });
      doc.fontSize(10).fillColor('#666')
        .text(`Invoice #: ${invoiceNumber}`, 400, 85, { align: 'right' })
        .text(`Date: ${invoiceDate}`, 400, 100, { align: 'right' })
        .text(`Order #: ${order.orderNumber || order.merchant_order_reference}`, 400, 115, { align: 'right' });

      // Horizontal line
      doc.moveTo(50, 150).lineTo(550, 150).stroke('#e5e7eb');

      // Bill To section
      doc.fontSize(12).fillColor('#1a365d').text('Bill To', 50, 170);
      doc.fontSize(10).fillColor('#333')
        .text(`${order.first_name || order.firstName} ${order.last_name || order.lastName}`, 50, 190)
        .text(order.email, 50, 205);
      
      if (order.phone) doc.text(order.phone, 50, 220);
      if (order.address_line1 || order.address1) doc.text(order.address_line1 || order.address1, 50, 235);
      if (order.city) doc.text(`${order.city}${order.state ? `, ${order.state}` : ''} ${order.postal_code || ''}`, 50, 250);
      if (order.country) doc.text(order.country, 50, 265);

      // Payment Info section
      doc.fontSize(12).fillColor('#1a365d').text('Payment Info', 350, 170);
      doc.fontSize(10).fillColor('#333')
        .text('Status: ', 350, 190, { continued: true })
        .fillColor('#059669').text('Paid')
        .fillColor('#333')
        .text(`Method: ${order.cardBrand || 'Card'} **** ${order.cardLastFour || '****'}`, 350, 205);
      
      if (order.authCode) doc.text(`Auth Code: ${order.authCode}`, 350, 220);

      // Table header
      const tableTop = 300;
      doc.rect(50, tableTop, 500, 25).fill('#1a365d');
      doc.fontSize(10).fillColor('#ffffff')
        .text('Description', 60, tableTop + 8)
        .text('Billing', 220, tableTop + 8)
        .text('Qty', 300, tableTop + 8, { align: 'right', width: 50 })
        .text('Unit Price', 360, tableTop + 8, { align: 'right', width: 80 })
        .text('Amount', 450, tableTop + 8, { align: 'right', width: 90 });

      // Table row
      doc.fillColor('#333')
        .text(order.plan_name || order.planName || 'Subscription Plan', 60, tableTop + 35)
        .text((order.billing_cycle || order.billingCycle || 'monthly').charAt(0).toUpperCase() + 
              (order.billing_cycle || order.billingCycle || 'monthly').slice(1), 220, tableTop + 35)
        .text(String(order.quantity || 1), 300, tableTop + 35, { align: 'right', width: 50 })
        .text(`${currency} ${parseFloat(order.base_price || order.total_amount).toFixed(2)}`, 360, tableTop + 35, { align: 'right', width: 80 })
        .text(`${currency} ${subtotal.toFixed(2)}`, 450, tableTop + 35, { align: 'right', width: 90 });

      // Line under table row
      doc.moveTo(50, tableTop + 55).lineTo(550, tableTop + 55).stroke('#e5e7eb');

      // Totals
      let totalsY = tableTop + 80;
      doc.text('Subtotal', 360, totalsY, { align: 'right', width: 80 })
        .text(`${currency} ${subtotal.toFixed(2)}`, 450, totalsY, { align: 'right', width: 90 });

      if (discount > 0) {
        totalsY += 20;
        doc.text('Discount', 360, totalsY, { align: 'right', width: 80 })
          .fillColor('#059669')
          .text(`-${currency} ${discount.toFixed(2)}`, 450, totalsY, { align: 'right', width: 90 })
          .fillColor('#333');
      }

      if (tax > 0) {
        totalsY += 20;
        doc.text('Tax (5% VAT)', 360, totalsY, { align: 'right', width: 80 })
          .text(`${currency} ${tax.toFixed(2)}`, 450, totalsY, { align: 'right', width: 90 });
      }

      // Total
      totalsY += 25;
      doc.rect(350, totalsY - 5, 200, 25).fill('#f3f4f6');
      doc.fontSize(12).fillColor('#333')
        .text('Total', 360, totalsY + 2, { align: 'right', width: 80 })
        .text(`${currency} ${total.toFixed(2)}`, 450, totalsY + 2, { align: 'right', width: 90 });

      // Paid stamp
      doc.fontSize(24).fillColor('#059669')
        .text('PAID', 250, totalsY + 60, { align: 'center' });

      // Footer
      doc.fontSize(10).fillColor('#666')
        .text('Thank you for your business!', 50, 700, { align: 'center', width: 500 })
        .text(`For any questions, please contact ${COMPANY_EMAIL}`, 50, 715, { align: 'center', width: 500 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateInvoiceHTML,
  generateInvoicePDF
};
