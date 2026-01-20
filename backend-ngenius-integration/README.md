# N-Genius Payment Gateway Integration (Sequelize - No Webhook)

Complete backend integration for N-Genius payment gateway for the BeFree EdTech Platform.
Uses your existing Sequelize database connection and payment verification on redirect.

## Quick Start

### 1. Install Additional Dependencies

```bash
npm install axios uuid
```

### 2. Update Database Import Path

In `controllers/orders.controller.js`, update the import to match your database config path:

```javascript
const { sequelize } = require('../config/database'); // Adjust to your path
```

### 3. Environment Variables

Add these to your `.env` file:

```env
# N-Genius Configuration
NGENIUS_ENV=sandbox                          # 'sandbox' or 'production'
NGENIUS_API_KEY=your_base64_encoded_api_key  # From N-Genius portal
NGENIUS_OUTLET_REF=your-outlet-uuid          # From N-Genius portal
NGENIUS_REALM=ni                             # Usually 'ni'
NGENIUS_CURRENCY=AED                         # Default currency

# Redirect URLs
FRONTEND_URL=https://your-frontend-domain.com
```

### 4. Run Database Migration

Execute the SQL in `database/schema.sql`:

```bash
mysql -u root -p your_database < database/schema.sql
```

### 5. Integrate Routes

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
  "billing": "month",
  "quantity": 1,
  "contactInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+971501234567",
    "country": "United Arab Emirates",
    "address1": "123 Main Street",
    "city": "Dubai"
  },
  "paymentMethod": "card"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentUrl": "https://payment.ngenius-payments.com/...",
    "amount": 500,
    "currency": "AED"
  }
}
```

### Verify Payment (Call on redirect)

```
GET /api/v1/orders/:id/verify

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

### Get Order

```
GET /api/v1/orders/:id
```

### Get My Orders (Authenticated)

```
GET /api/v1/orders/my-orders
Authorization: Bearer <token>
```

### Process Refund

```
POST /api/v1/orders/:id/refund
Authorization: Bearer <token>

Request Body (optional for partial refund):
{
  "amount": 100
}
```

## Payment Flow (No Webhook)

1. Frontend calls `POST /api/v1/orders` with plan and contact info
2. Backend creates order in database using Sequelize transaction
3. Backend calls N-Genius API to create payment session
4. Backend returns `paymentUrl` to frontend
5. Frontend redirects user to N-Genius hosted payment page
6. User completes payment on N-Genius page
7. N-Genius redirects user back to `/payment-success?orderId=xxx`
8. Frontend calls `GET /api/v1/orders/:id/verify` to check payment status
9. Backend queries N-Genius API and updates order status
10. Frontend shows success/failure based on verified status

## Test Card Numbers (Sandbox)

| Card Number | Result |
|-------------|--------|
| 4012001037141112 | Successful payment |
| 5123450000000008 | 3DS Challenge |
| 4000300011112220 | Declined |

- **Expiry**: Any future date (e.g., 12/28)
- **CVV**: Any 3 digits (e.g., 123)

## N-Genius Portal Setup

1. **Get API Key**: Settings → Integrations → Service Accounts → Create new
2. **Get Outlet Reference**: Settings → Outlets → Copy UUID
3. Base64 encode your API key if not already encoded
