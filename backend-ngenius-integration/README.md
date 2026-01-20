# N-Genius Payment Gateway Integration

Complete backend integration for N-Genius payment gateway for the BeFree EdTech Platform.

## Quick Start

### 1. Install Dependencies

```bash
npm install express pg axios uuid dotenv cors
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# N-Genius Configuration
NGENIUS_ENV=sandbox                          # 'sandbox' or 'production'
NGENIUS_API_KEY=your_base64_encoded_api_key  # From N-Genius portal
NGENIUS_OUTLET_REF=your-outlet-uuid          # From N-Genius portal
NGENIUS_REALM=ni                             # Usually 'ni'
NGENIUS_CURRENCY=AED                         # Default currency

# Redirect URLs
FRONTEND_URL=https://your-frontend-domain.com
NGENIUS_REDIRECT_URL=https://your-frontend-domain.com/payment-success
NGENIUS_CANCEL_URL=https://your-frontend-domain.com/payment-cancel

# JWT (for authentication)
JWT_SECRET=your-jwt-secret-key
```

### 3. Run Database Migration

Execute the SQL in `database/schema.sql` to create the required tables:

```bash
psql $DATABASE_URL -f database/schema.sql
```

### 4. Integrate Routes

Add to your main Express app:

```javascript
const ordersRoutes = require('./routes/orders.routes');
app.use('/api/v1/orders', ordersRoutes);
```

## API Endpoints

### Create Order (Initiate Payment)

```
POST /api/v1/orders
Authorization: Bearer <token> (optional)

Request Body:
{
  "planId": "Professional",
  "billing": "month",  // or "year"
  "quantity": 1,
  "contactInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+971501234567",
    "country": "United Arab Emirates",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "Dubai",
    "state": "Dubai",
    "zip": "00000"
  },
  "paymentMethod": "card",
  "billingAddress": { /* same structure as contactInfo */ }
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "merchantOrderReference": "BF-1234567890-ABCD1234",
    "ngeniusOrderRef": "urn:order:xxx",
    "paymentUrl": "https://payment.ngenius-payments.com/...",
    "amount": 500,
    "currency": "AED"
  }
}
```

### Get Order

```
GET /api/v1/orders/:id

Response:
{
  "success": true,
  "data": { /* order object */ }
}
```

### Check Order Status

```
GET /api/v1/orders/:id/status

Response:
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "paid",
    "paymentStatus": "CAPTURED",
    "amount": 500,
    "currency": "AED",
    "cardBrand": "VISA",
    "cardLastFour": "1112"
  }
}
```

### Get My Orders (Authenticated)

```
GET /api/v1/orders/my-orders
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [ /* array of orders */ ]
}
```

### Process Refund

```
POST /api/v1/orders/:id/refund
Authorization: Bearer <token>

Request Body (optional for partial refund):
{
  "amount": 100
}

Response:
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "refundRef": "urn:refund:xxx",
    "status": "refunded",
    "amount": 500
  }
}
```

### Webhook Handler

```
POST /api/v1/orders/webhook
Content-Type: application/json

(Payload sent by N-Genius)
```

## N-Genius Portal Setup

1. **Get API Key**: Settings → Integrations → Service Accounts → Create new
2. **Get Outlet Reference**: Settings → Outlets → Copy UUID
3. **Set Webhook URL**: Settings → Webhooks → Add `https://your-backend.com/api/v1/orders/webhook`

## Test Card Numbers (Sandbox)

| Card Number | Description |
|-------------|-------------|
| 4012001037141112 | Successful payment |
| 5123450000000008 | 3DS Challenge |
| 4000300011112220 | Declined |

- **Expiry**: Any future date (e.g., 12/28)
- **CVV**: Any 3 digits (e.g., 123)

## Payment Flow

1. Frontend calls `POST /api/v1/orders` with plan and contact info
2. Backend creates order in database
3. Backend calls N-Genius API to create payment session
4. Backend returns `paymentUrl` to frontend
5. Frontend redirects user to N-Genius hosted payment page
6. User completes payment on N-Genius page
7. N-Genius redirects user back to `redirectUrl` with result
8. N-Genius sends webhook to `/api/v1/orders/webhook`
9. Backend updates order status
10. Frontend shows success/failure based on order status

## Security Notes

- Never log or store raw card numbers
- Validate webhook signatures in production
- Use HTTPS for all API calls
- Store N-Genius API key securely (environment variable)
- Implement rate limiting for payment endpoints
