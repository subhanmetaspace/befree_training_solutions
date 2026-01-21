/**
 * Orders Routes (No Webhook Version)
 * BeFree EdTech Platform
 */

const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

// Middleware for authentication (optional - adjust based on your auth setup)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    
    // TODO: Verify JWT token and attach user to request
    // Example:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    req.user = { id: null }; // Placeholder
  } else {
    req.user = null;
  }
  
  next();
};

// Require authentication
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
router.post('/', ordersController.createOrder);

/**
 * @route   GET /api/v1/orders/my-orders
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/my-orders', requireAuth, ordersController.getMyOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Public
 */
router.get('/:id', ordersController.getOrder);

/**
 * @route   GET /api/v1/orders/:id/verify
 * @desc    Verify payment status (call this when user returns from payment)
 * @access  Public
 */
router.get('/:id/verify', ordersController.verifyPayment);

/**
 * @route   POST /api/v1/orders/:id/refund
 * @desc    Process refund for an order
 * @access  Private (Admin only)
 */
router.post('/:id/refund', requireAuth, ordersController.refundOrder);

module.exports = router;
