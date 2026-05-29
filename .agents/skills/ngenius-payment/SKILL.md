---
name: ngenius-payment
description: Integrate the N-Genius payment gateway (by Network International) into any Node.js + React app. Use when the user asks to add N-Genius payments, set up checkout, handle payment success/cancel flows, or process refunds. Covers backend service, frontend checkout/payment pages, required environment variables, and database schema.
---

# N-Genius Payment Gateway Integration

N-Genius is a payment gateway by Network International, widely used in the UAE and MENA region. It uses a hosted payment page model — your backend creates an order, receives a payment URL, and redirects the user to N-Genius to complete payment. No card data ever touches your server.

## Step 1 — Ask for Required Keys

Before writing any code, ask the user for these values (or read them from existing `.env`):

```
NGENIUS_ENV=sandbox              # or 'production'
NGENIUS_API_KEY=                 # Base64-encoded API key from N-Genius portal
NGENIUS_OUTLET_REF=              # UUID outlet reference from N-Genius portal
NGENIUS_REALM=ni                 # Usually 'ni', confirm with portal
NGENIUS_CURRENCY=INR             # INR, AED, USD, etc.
NGENIUS_REDIRECT_URL=            # https://yourdomain.com/payment-success
NGENIUS_CANCEL_URL=              # https://yourdomain.com/payment-cancel
FRONTEND_URL=                    # https://yourdomain.com (used in redirect URL construction)
```

**Where to get these:**
- Log in to N-Genius portal (UAT: https://uatsandbox.ngenius-payments.com, Prod: https://portal.ngenius-payments.com)
- Go to **Outlets** → select your outlet → copy the **Outlet Reference** (UUID)
- Go to **Settings → API Keys** → copy and Base64-encode your API key: `echo -n "your-api-key" | base64`

Set them via Replit Secrets (never hardcode). Read the `environment-secrets` skill to set them.

---

## Step 2 — Install Backend Dependencies

```bash
npm install axios uuid
```

---

## Step 3 — Backend Files to Create

### `config/ngenius.config.js`
```js
const config = {
  environment: process.env.NGENIUS_ENV || 'sandbox',
  apiKey: process.env.NGENIUS_API_KEY,
  outletRef: process.env.NGENIUS_OUTLET_REF,
  realm: process.env.NGENIUS_REALM || 'ni',
  currency: process.env.NGENIUS_CURRENCY || 'INR',

  get identityUrl() {
    return this.environment === 'production'
      ? 'https://identity.ngenius-payments.com/auth/realms/ni/protocol/openid-connect/token'
      : 'https://identity-uat.ngenius-payments.com/auth/realms/ni/protocol/openid-connect/token';
  },

  get gatewayUrl() {
    const base = this.environment === 'production'
      ? 'https://api-gateway.ngenius-payments.com'
      : 'https://api-gateway.sandbox.ngenius-payments.com';
    return `${base}/transactions/outlets/${this.outletRef}`;
  },

  redirectUrl: process.env.NGENIUS_REDIRECT_URL || 'https://yourdomain.com/payment-success',
  cancelUrl:   process.env.NGENIUS_CANCEL_URL   || 'https://yourdomain.com/payment-cancel',
};

if (!config.apiKey)    console.warn('[N-Genius] NGENIUS_API_KEY not set');
if (!config.outletRef) console.warn('[N-Genius] NGENIUS_OUTLET_REF not set');

module.exports = config;
```

### `services/ngenius.service.js`
```js
const axios = require('axios');
const config = require('../config/ngenius.config');

class NGeniusService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }
    const res = await axios.post(
      config.identityUrl,
      'grant_type=client_credentials',
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${config.apiKey}` } }
    );
    this.accessToken = res.data.access_token;
    this.tokenExpiry = Date.now() + (res.data.expires_in * 1000) - 30000;
    return this.accessToken;
  }

  async createOrder(orderData) {
    const token = await this.authenticate();
    const amountInSmallestUnit = Math.round(orderData.amount * 100); // paise for INR, fils for AED

    const body = {
      action: 'SALE',
      amount: { currencyCode: orderData.currency || config.currency, value: amountInSmallestUnit },
      merchantOrderReference: orderData.merchantOrderReference,
      emailAddress: orderData.email,
      billingAddress: {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        address1: orderData.address1,
        city: orderData.city,
        countryCode: orderData.countryCode || 'IN',
      },
      merchantAttributes: {
        redirectUrl: orderData.redirectUrl || config.redirectUrl,
        cancelUrl: orderData.cancelUrl || config.cancelUrl,
        skipConfirmationPage: true,
      },
    };

    if (orderData.phone) body.billingAddress.phoneNumber = orderData.phone;

    const res = await axios.post(`${config.gatewayUrl}/orders`, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        'Accept': 'application/vnd.ni-payment.v2+json',
      },
    });

    return {
      orderRef: res.data.reference,
      paymentUrl: res.data._links?.payment?.href,
    };
  }

  async getOrderStatus(orderRef) {
    const token = await this.authenticate();
    const res = await axios.get(`${config.gatewayUrl}/orders/${orderRef}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.ni-payment.v2+json' },
    });
    const order = res.data;
    const payment = order._embedded?.payment?.[0];
    return {
      orderRef: order.reference,
      state: order.state,
      amount: order.amount?.value / 100,
      currency: order.amount?.currencyCode,
      isSuccess: ['CAPTURED', 'PURCHASED'].includes(payment?.state || order.state),
      isFailed: ['FAILED', 'DECLINED'].includes(payment?.state || order.state),
      payment: payment ? {
        paymentRef: payment.reference,
        state: payment.state,
        authCode: payment.authorizationCode,
        cardBrand: payment._embedded?.cnpResponse?.scheme,
        cardLastFour: payment._embedded?.cnpResponse?.pan?.slice(-4),
      } : null,
    };
  }

  async refundPayment(orderRef, paymentRef, amount = null) {
    const token = await this.authenticate();
    const body = amount ? { amount: { currencyCode: config.currency, value: Math.round(amount * 100) } } : {};
    const res = await axios.post(
      `${config.gatewayUrl}/orders/${orderRef}/payments/${paymentRef}/refund`,
      body,
      { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/vnd.ni-payment.v2+json', 'Accept': 'application/vnd.ni-payment.v2+json' } }
    );
    return { refundRef: res.data.reference, state: res.data.state };
  }
}

module.exports = new NGeniusService();
```

### `routes/payment.routes.js`
```js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const ngenius = require('../services/ngenius.service');

// POST /api/payment/create-order
// Body: { amount, currency, email, firstName, lastName, phone, address1, city, countryCode, orderId }
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, email, firstName, lastName, phone, address1, city, countryCode, orderId } = req.body;
    if (!amount || !email) return res.status(400).json({ success: false, message: 'amount and email required' });

    const merchantOrderRef = `ORD-${Date.now()}-${(orderId || uuidv4().slice(0, 8)).toUpperCase()}`;
    const frontendUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';

    const result = await ngenius.createOrder({
      amount, currency,
      merchantOrderReference: merchantOrderRef,
      email, firstName, lastName, phone,
      address1, city, countryCode,
      redirectUrl: `${frontendUrl}/payment-success?ref=${merchantOrderRef}`,
      cancelUrl:   `${frontendUrl}/payment-cancel?ref=${merchantOrderRef}`,
    });

    res.json({ success: true, paymentUrl: result.paymentUrl, orderRef: result.orderRef, merchantOrderRef });
  } catch (err) {
    console.error('[N-Genius] create-order error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/payment/verify/:orderRef
router.get('/verify/:orderRef', async (req, res) => {
  try {
    const status = await ngenius.getOrderStatus(req.params.orderRef);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payment/refund
// Body: { orderRef, paymentRef, amount (optional) }
router.post('/refund', async (req, res) => {
  try {
    const { orderRef, paymentRef, amount } = req.body;
    const result = await ngenius.refundPayment(orderRef, paymentRef, amount);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
```

### Register routes in `index.js` / `app.js`
```js
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payment', paymentRoutes);
```

---

## Step 4 — Database Schema (optional but recommended)

```sql
CREATE TABLE orders (
  id                     VARCHAR(36) PRIMARY KEY,
  user_id                INT,
  plan_id                VARCHAR(100),
  amount                 DECIMAL(10,2) NOT NULL,
  currency               VARCHAR(10) DEFAULT 'INR',
  email                  VARCHAR(255) NOT NULL,
  merchant_order_ref     VARCHAR(100) UNIQUE,
  ngenius_order_ref      VARCHAR(100),
  ngenius_payment_ref    VARCHAR(100),
  status                 ENUM('pending','awaiting_payment','paid','failed','refunded') DEFAULT 'pending',
  payment_url            TEXT,
  paid_at                DATETIME,
  created_at             DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Step 5 — Frontend Flow (React)

### Checkout Page — calls backend to create order, redirects to N-Genius
```jsx
const handlePay = async () => {
  setLoading(true);
  try {
    const res = await axios.post(`${API_BASE}/payment/create-order`, {
      amount: totalAmount,
      currency: 'INR',
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address1: formData.address,
      city: formData.city,
      countryCode: 'IN',
    });
    if (res.data.success) {
      // Store orderRef in localStorage for verification on return
      localStorage.setItem('pendingOrderRef', res.data.orderRef);
      // Redirect to N-Genius hosted payment page
      window.location.href = res.data.paymentUrl;
    }
  } catch (err) {
    toast({ title: 'Payment Error', description: err.response?.data?.message || 'Something went wrong' });
  } finally {
    setLoading(false);
  }
};
```

### PaymentSuccess Page — verifies payment after redirect back
```jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderRef = localStorage.getItem('pendingOrderRef') || searchParams.get('ref');
    if (!orderRef) { setStatus('error'); return; }

    axios.get(`${process.env.REACT_APP_API_BACKEND}/payment/verify/${orderRef}`)
      .then(res => {
        localStorage.removeItem('pendingOrderRef');
        setStatus(res.data.data.isSuccess ? 'success' : 'failed');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'verifying') return <p>Verifying your payment...</p>;
  if (status === 'success')   return <p>Payment successful! Thank you.</p>;
  return <p>Payment failed or cancelled. Please try again.</p>;
};

export default PaymentSuccess;
```

### App routing — add these routes
```jsx
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-cancel"  element={<PaymentCancel />} />
```

---

## Payment Flow Summary

```
User clicks Pay
    → Frontend calls POST /api/payment/create-order
    → Backend authenticates with N-Genius (client_credentials)
    → Backend creates order, receives paymentUrl
    → Frontend redirects: window.location.href = paymentUrl
    → User fills card on N-Genius hosted page
    → N-Genius redirects to redirectUrl or cancelUrl
    → PaymentSuccess page calls GET /api/payment/verify/:orderRef
    → Backend checks order state with N-Genius
    → Returns isSuccess / isFailed
    → Show result to user
```

---

## Environment States

| `NGENIUS_ENV` | Identity URL | Gateway URL |
|---|---|---|
| `sandbox` | identity-uat.ngenius-payments.com | api-gateway.sandbox.ngenius-payments.com |
| `production` | identity.ngenius-payments.com | api-gateway.ngenius-payments.com |

## Payment States from N-Genius

| State | Meaning |
|---|---|
| `STARTED` | Order created, user hasn't paid yet |
| `PURCHASED` | Payment successful (debit cards) |
| `CAPTURED` | Payment successful (credit cards) |
| `FAILED` | Payment failed |
| `DECLINED` | Card declined |
| `AUTHORISED` | Authorised but not captured |
| `REVERSED` | Payment reversed |

---

## Currency Notes

- **INR** (India): amount × 100 = paise (₹100 → 10000 paise)
- **AED** (UAE): amount × 100 = fils (100 AED → 10000 fils)
- **USD**: amount × 100 = cents

Always multiply by 100 before sending to N-Genius. Always divide by 100 when reading back.

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| 401 Unauthorized | Wrong/expired API key | Re-generate token, check NGENIUS_API_KEY is correct Base64 |
| 404 Not Found | Wrong outlet reference | Confirm NGENIUS_OUTLET_REF UUID from portal |
| `paymentUrl` is null | Order created but no payment link | Check outlet is active and currency is enabled |
| Payment stuck on STARTED | User didn't complete payment | Use sandbox test cards to test |

## Sandbox Test Cards (UAT only)

| Card Number | Type | Result |
|---|---|---|
| 4111 1111 1111 1111 | Visa | Success |
| 5500 0000 0000 0004 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Decline |

Use any future expiry date, any 3-digit CVV.
