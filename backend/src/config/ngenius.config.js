/**
 * N-Genius Payment Gateway Configuration
 * BeFree EdTech Platform
 */

const config = {
  // Environment: 'sandbox' or 'production'
  environment: process.env.NGENIUS_ENV || 'sandbox',
  
  // API Key (Base64 encoded)
  apiKey: process.env.NGENIUS_API_KEY,
  
  // Outlet Reference (UUID from N-Genius portal)
  outletRef: process.env.NGENIUS_OUTLET_REF,
  
  // Realm (usually 'ni')
  realm: process.env.NGENIUS_REALM || 'ni',
  
  // Currency
  currency: process.env.NGENIUS_CURRENCY || 'AED',
  
  // URLs based on environment
  get identityUrl() {
    return this.environment === 'production'
      ? "https://api-gateway.ngenius-payments.com/identity/auth/access-token"
      : 'https://identity-uat.ngenius-payments.com/auth/realms/ni/protocol/openid-connect/token';
  },
  
  get gatewayUrl() {
    const baseUrl = this.environment === 'production'
      ? "https://api-gateway.ngenius-payments.com/transactions/outlets/4c731209-d54d-4d7a-b965-9a0f0a655616/orders"
      : 'https://api-gateway.sandbox.ngenius-payments.com';
    return `${baseUrl}`;
  },
  
  // Redirect URLs (update with your actual domain)
  redirectUrl: process.env.NGENIUS_REDIRECT_URL || 'https://your-frontend-domain.com/payment-success',
  cancelUrl: process.env.NGENIUS_CANCEL_URL || 'https://your-frontend-domain.com/payment-cancel',
  
  // Webhook secret for verification (optional)
  webhookSecret: process.env.NGENIUS_WEBHOOK_SECRET,
};

// Validation
if (!config.apiKey) {
  console.warn('Warning: NGENIUS_API_KEY is not set');
}
if (!config.outletRef) {
  console.warn('Warning: NGENIUS_OUTLET_REF is not set');
}

module.exports = config;
