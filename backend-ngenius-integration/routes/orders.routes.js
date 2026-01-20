/**
 * Orders Routes
 * BeFree EdTech Platform
 */

const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

// Middleware for authentication (optional - adjust based on your auth setup)
const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    
    // TODO: Verify JWT token and attach user to request
    // This is a placeholder - implement your actual JWT verification
    try {
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // req.user = decoded;
      req.user = { id: null }; // Placeholder
    } catch (err) {
      // Token invalid but allow request to continue (order can be guest checkout)
      req.user = null;
    }
  } else {
    req.user = null;
  }
  
  next();
};

// Require authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order and initiate payment
 * @access  Public (with optional auth)
 */
router.post('/', authMiddleware, ordersController.createOrder);

/**
 * @route   GET /api/v1/orders/my-orders
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/my-orders', authMiddleware, requireAuth, ordersController.getMyOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Public (should add ownership check in production)
 */
router.get('/:id', ordersController.getOrder);

/**
 * @route   GET /api/v1/orders/:id/status
 * @desc    Get order status (syncs with N-Genius)
 * @access  Public
 */
router.get('/:id/status', ordersController.getOrderStatus);

/**
 * @route   POST /api/v1/orders/:id/refund
 * @desc    Process refund for an order
 * @access  Private (Admin only in production)
 */
router.post('/:id/refund', authMiddleware, requireAuth, ordersController.refundOrder);

/**
 * @route   POST /api/v1/orders/webhook
 * @desc    N-Genius webhook handler
 * @access  Public (verify signature in production)
 */
router.post('/webhook', express.json(), ordersController.handleWebhook);

module.exports = router;
