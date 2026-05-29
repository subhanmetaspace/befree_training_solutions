/**
 * Example Integration (MySQL Version)
 * 
 * This shows how to integrate the N-Genius orders routes into your existing Express app.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://7125bce4-753c-4e16-b02e-d5bbd340eda3-00-2ojlk0ircnnqe.pike.replit.dev',
    'http://localhost:5000',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// Import routes
const ordersRoutes = require('./routes/orders.routes');

// Mount routes
app.use('/api/v1/orders', ordersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
