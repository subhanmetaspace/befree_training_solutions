/**
 * N-Genius Payment Gateway Service
 * BeFree EdTech Platform
 * 
 * Handles all communication with N-Genius payment gateway
 * Includes invoice generation and email notifications
 */

const axios = require('axios');
const config = require('../config/ngenius.config');
const { sendOrderCreatedEmail, sendPaymentSuccessEmail, sendPaymentFailedEmail, sendInvoiceEmail } = require('./email.service');
const { generateInvoicePDF } = require('./invoice.service');
console.log(config)
class NGeniusService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Authenticate with N-Genius and get access token
   */
  async authenticate() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
        
      const response = await axios({
    method: "post",
    url: config.identityUrl,
    headers: {
      "Content-Type": "application/vnd.ni-identity.v1+json",
      Authorization: `Basic ${config.apiKey}`
    },
    data: {
      grant_type: "client_credentials"
    }
  });

  this.accessToken = response.data.access_token;
      

      // Token typically valid for 5 minutes, refresh 30 seconds early
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 30000;

      return this.accessToken;
    } catch (error) {
      console.error('N-Genius Authentication Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with payment gateway');
    }
  }

  /**
   * Create a payment order
   * @param {Object} orderData - Order details
   * @returns {Object} N-Genius order response with payment URL
   */
  async createOrder(orderData) {
    const accessToken = await this.authenticate();
    
    // Convert amount to fils (smallest currency unit)
    // 1 AED = 100 fils
    const amountInFils = Math.round(orderData.amount * 100);

    const orderRequest = {
      action: 'SALE',
      amount: {
        currencyCode: orderData.currency || config.currency,
        value: amountInFils
      },
      merchantOrderReference: orderData.merchantOrderReference,
      emailAddress: orderData.email,
      billingAddress: {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        address1: orderData.address1,
        address2: orderData.address2 || '',
        city: orderData.city,
        stateProvince: orderData.state || '',
        postalCode: orderData.postalCode || '',
        countryCode: this.getCountryCode(orderData.country)
      },
      merchantAttributes: {
        redirectUrl: orderData.redirectUrl || config.redirectUrl,
        cancelUrl: orderData.cancelUrl || config.cancelUrl,
        skipConfirmationPage: true
      }
    };

    // Add phone if provided
    if (orderData.phone) {
      orderRequest.billingAddress.phoneNumber = orderData.phone;
    }

    try {
    console.log(orderRequest)
    let obj = {
        currencyCode: orderRequest.amount.currencyCode,
        value: Number(Number(orderRequest.amount.value))
      }
      console.log(obj)
       const response = await axios({
    method: "post",
    url: config.gatewayUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/vnd.ni-payment.v2+json",
      Accept: "application/vnd.ni-payment.v2+json",
    },
    data: {
      action: "PURCHASE",
      amount: {
        currencyCode: orderRequest.amount.currencyCode,
        value: Number(Number(orderRequest.amount.value))
      },
      merchantAttributes: {
        redirectUrl: 'https://befreetraining.net/payment-success',
        skipConfirmationPage: true,
        cancelUrl: "https://befreetraining.net/payment-cancel",
      }
    }
  });
      
      return {
        success: true,
        orderRef: response.data.reference,
        paymentUrl: response.data._links?.payment?.href,
        orderData: response.data
      };
    } catch (error) {
      console.error('N-Genius Create Order Error:', error.response.data);
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  /**
   * Get order status
   * @param {string} orderRef - N-Genius order reference
   */
  async getOrderStatus(orderRef) {
    const accessToken = await this.authenticate();

    try {
      const response = await axios.get(
        `${config.gatewayUrl}/orders/${orderRef}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.ni-payment.v2+json'
          }
        }
      );

      const order = response.data;
      const payment = order._embedded?.payment?.[0];

      return {
        success: true,
        orderRef: order.reference,
        state: order.state,
        amount: order.amount?.value / 100,
        currency: order.amount?.currencyCode,
        payment: payment ? {
          paymentRef: payment.reference,
          state: payment.state,
          authCode: payment.authorizationCode,
          cardBrand: payment._embedded?.cnpResponse?.scheme,
          cardLastFour: payment._embedded?.cnpResponse?.pan?.slice(-4)
        } : null,
        rawResponse: order
      };
    } catch (error) {
      console.error('N-Genius Get Order Error:', error.response?.data || error.message);
      throw new Error('Failed to get order status');
    }
  }

  /**
   * Verify payment and send appropriate emails with invoice
   * Call this when user redirects back from N-Genius payment page
   * @param {string} orderRef - N-Genius order reference
   * @param {Object} orderDetails - Full order details from database
   * @returns {Object} Payment verification result with email status
   */
  async verifyPaymentAndNotify(orderRef, orderDetails) {
    try {
      const ngeniusStatus = await this.getOrderStatus(orderRef);
      const paymentState = ngeniusStatus.payment?.state || ngeniusStatus.state;
      
      const isSuccess = paymentState === 'CAPTURED' || paymentState === 'PURCHASED';
      const isFailed = paymentState === 'FAILED' || paymentState === 'DECLINED';

      // Prepare order data for emails
      const orderForEmail = {
        ...orderDetails,
        orderNumber: orderDetails.merchant_order_reference || orderDetails.merchantOrderReference,
        paymentStatus: isSuccess ? 'paid' : (isFailed ? 'failed' : 'pending'),
        paymentMethod: 'card',
        cardBrand: ngeniusStatus.payment?.cardBrand,
        cardLastFour: ngeniusStatus.payment?.cardLastFour,
        authCode: ngeniusStatus.payment?.authCode,
        paidAt: isSuccess ? new Date() : null,
        amount: ngeniusStatus.amount || orderDetails.total_amount,
        currency: ngeniusStatus.currency || orderDetails.currency || 'AED'
      };

      let emailsSent = false;
      let invoiceSent = false;

      if (isSuccess) {
        // Send payment success email
        await sendPaymentSuccessEmail(orderForEmail).catch(err =>
          console.error("Error sending payment success email:", err)
        );
        emailsSent = true;

        // Generate and send invoice
        try {
          const invoiceBuffer = await generateInvoicePDF(orderForEmail);
          await sendInvoiceEmail(orderForEmail, invoiceBuffer);
          invoiceSent = true;
        } catch (err) {
          console.error("Error sending invoice email:", err);
        }
      } else if (isFailed) {
        // Send payment failed email
        await sendPaymentFailedEmail(orderForEmail, 'Payment was declined by the bank').catch(err =>
          console.error("Error sending payment failed email:", err)
        );
        emailsSent = true;
      }

      return {
        ...ngeniusStatus,
        isSuccess,
        isFailed,
        emailsSent,
        invoiceSent
      };
    } catch (error) {
      console.error('Verify Payment and Notify Error:', error);
      throw error;
    }
  }

  /**
   * Process refund
   * @param {string} orderRef - N-Genius order reference
   * @param {string} paymentRef - N-Genius payment reference
   * @param {number} amount - Refund amount (optional, full refund if not provided)
   */
  async refundPayment(orderRef, paymentRef, amount = null) {
    const accessToken = await this.authenticate();

    const refundRequest = amount ? {
      amount: {
        currencyCode: config.currency,
        value: Math.round(amount * 100)
      }
    } : {};

    try {
      const response = await axios.post(
        `${config.gatewayUrl}/orders/${orderRef}/payments/${paymentRef}/refund`,
        refundRequest,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/vnd.ni-payment.v2+json',
            'Accept': 'application/vnd.ni-payment.v2+json'
          }
        }
      );

      return {
        success: true,
        refundRef: response.data.reference,
        state: response.data.state,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('N-Genius Refund Error:', error.response?.data || error.message);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Convert country name to ISO 3166-1 alpha-2 code
   */
  getCountryCode(countryName) {
    const countryCodes = {
      'United Arab Emirates': 'AE',
      'UAE': 'AE',
      'Saudi Arabia': 'SA',
      'Egypt': 'EG',
      'Jordan': 'JO',
      'Kuwait': 'KW',
      'Bahrain': 'BH',
      'Qatar': 'QA',
      'Oman': 'OM',
      'India': 'IN',
      'Pakistan': 'PK',
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Italy': 'IT',
      'Spain': 'ES',
      'Netherlands': 'NL',
      'Belgium': 'BE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Ireland': 'IE',
      'Portugal': 'PT',
      'Greece': 'GR',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Czechia': 'CZ',
      'Hungary': 'HU',
      'Romania': 'RO',
      'Bulgaria': 'BG',
      'Croatia': 'HR',
      'Slovenia': 'SI',
      'Slovakia': 'SK',
      'Estonia': 'EE',
      'Latvia': 'LV',
      'Lithuania': 'LT',
      'Cyprus': 'CY',
      'Malta': 'MT',
      'Luxembourg': 'LU',
      'Iceland': 'IS',
      'Turkey': 'TR',
      'Russia': 'RU',
      'Ukraine': 'UA',
      'South Africa': 'ZA',
      'Nigeria': 'NG',
      'Kenya': 'KE',
      'Morocco': 'MA',
      'Tunisia': 'TN',
      'Algeria': 'DZ',
      'Lebanon': 'LB',
      'Iraq': 'IQ',
      'Syria': 'SY',
      'Yemen': 'YE',
      'Libya': 'LY',
      'Sudan': 'SD',
      'China': 'CN',
      'Japan': 'JP',
      'South Korea': 'KR',
      'Singapore': 'SG',
      'Malaysia': 'MY',
      'Thailand': 'TH',
      'Vietnam': 'VN',
      'Indonesia': 'ID',
      'Philippines': 'PH',
      'Bangladesh': 'BD',
      'Sri Lanka': 'LK',
      'Nepal': 'NP',
      'New Zealand': 'NZ',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Argentina': 'AR',
      'Chile': 'CL',
      'Colombia': 'CO',
      'Peru': 'PE',
      'Venezuela': 'VE',
      'Ecuador': 'EC'
    };

    return countryCodes[countryName] || 'AE'; // Default to UAE
  }
}

module.exports = new NGeniusService();
