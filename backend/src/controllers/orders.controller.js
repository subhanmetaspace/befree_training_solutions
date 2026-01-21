/**
 * Orders Controller (Sequelize Version - No Webhook)
 * BeFree EdTech Platform
 * 
 * Payment is verified when user returns to success/cancel page
 */

const { sequelize } = require('../config/db'); // Adjust path to your database config
const { QueryTypes } = require('sequelize');
const ngeniusService = require('../services/ngenius.service');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new order and initiate payment
 * POST /api/v1/orders
 */
const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      planId,
      billing,
      quantity,
      contactInfo,
      paymentMethod,
      billingAddress
    } = req.body;

    // Get user ID from auth token (optional)
    const userId = req.user?.id || null;

    // Validate required fields
    if (!planId || !billing || !contactInfo?.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: planId, billing, and email are required'
      });
    }

    // Fetch plan details from database
    const plans = await sequelize.query(
      'SELECT * FROM plans WHERE id = ? OR name = ?',
      {
        replacements: [planId, planId],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (plans.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    const plan = plans[0];
    
    // Calculate pricing
    const basePrice = parseFloat(plan.price) || 0;
    const qty = parseInt(quantity) || 1;
    let totalAmount;
    let discountAmount = 0;

    if (billing === 'year') {
      // Yearly billing with 20% discount
      const yearlyTotal = basePrice * 12 * qty;
      discountAmount = Math.round(yearlyTotal * 0.2 * 100) / 100;
      totalAmount = yearlyTotal - discountAmount;
    } else {
      // Monthly billing
      totalAmount = basePrice * qty;
    }

    // Generate IDs
    const orderId = uuidv4();
    const merchantOrderRef = `BF-${Date.now()}-${orderId.slice(0, 8).toUpperCase()}`;

    // Create order in database
    await sequelize.query(`
      INSERT INTO orders (
        id, user_id, plan_id, plan_name, billing_cycle, quantity,
        base_price, discount_amount, total_amount, currency,
        first_name, last_name, email, phone,
        country, address_line1, address_line2, city, state, postal_code,
        payment_method, merchant_order_reference, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        orderId,
        userId,
        plan.id || plan.name,
        plan.name,
        billing,
        qty,
        basePrice,
        discountAmount,
        totalAmount,
        'AED',
        contactInfo.firstName,
        contactInfo.lastName,
        contactInfo.email,
        contactInfo.phone || null,
        billingAddress?.country || contactInfo.country,
        billingAddress?.address1 || contactInfo.address1,
        billingAddress?.address2 || contactInfo.address2 || null,
        billingAddress?.city || contactInfo.city,
        billingAddress?.state || contactInfo.state || null,
        billingAddress?.zip || contactInfo.zip || null,
        paymentMethod,
        merchantOrderRef,
        'pending'
      ],
      type: QueryTypes.INSERT,
      transaction
    });

    // Create N-Genius payment order
    const ngeniusOrder = await ngeniusService.createOrder({
      amount: totalAmount,
      currency: 'AED',
      merchantOrderReference: merchantOrderRef,
      email: contactInfo.email,
      firstName: contactInfo.firstName,
      lastName: contactInfo.lastName,
      phone: contactInfo.phone,
      country: billingAddress?.country || contactInfo.country,
      address1: billingAddress?.address1 || contactInfo.address1,
      address2: billingAddress?.address2 || contactInfo.address2,
      city: billingAddress?.city || contactInfo.city,
      state: billingAddress?.state || contactInfo.state,
      postalCode: billingAddress?.zip || contactInfo.zip,
      redirectUrl: `${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${orderId}`
    });

    // Update order with N-Genius reference
    await sequelize.query(`
      UPDATE orders 
      SET ngenius_order_ref = ?, payment_url = ?, status = 'awaiting_payment'
      WHERE id = ?
    `, {
      replacements: [ngeniusOrder.orderRef, ngeniusOrder.paymentUrl, orderId],
      type: QueryTypes.UPDATE,
      transaction
    });

    await transaction.commit();

    // Return success with payment URL
    res.status(201).json({
      success: true,
      data: {
        id: orderId,
        merchantOrderReference: merchantOrderRef,
        ngeniusOrderRef: ngeniusOrder.orderRef,
        paymentUrl: ngeniusOrder.paymentUrl,
        amount: totalAmount,
        currency: 'AED'
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

/**
 * Get order by ID
 * GET /api/v1/orders/:id
 */
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await sequelize.query(
      'SELECT * FROM orders WHERE id = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT
      }
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: orders[0]
    });

  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order'
    });
  }
};

/**
 * Verify payment status (called when user returns from payment page)
 * GET /api/v1/orders/:id/verify
 */
const verifyPayment = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const orders = await sequelize.query(
      'SELECT * FROM orders WHERE id = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (orders.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // If already paid, return cached status
    if (order.status === 'paid') {
      await transaction.commit();
      return res.json({
        success: true,
        data: {
          orderId: order.id,
          status: 'paid',
          amount: parseFloat(order.total_amount),
          currency: order.currency
        }
      });
    }

    // If order has N-Genius reference, check status with N-Genius
    if (order.ngenius_order_ref) {
      try {
        const ngeniusStatus = await ngeniusService.getOrderStatus(order.ngenius_order_ref);
        
        // Map N-Genius state to our status
        let newStatus = order.status;
        const paymentState = ngeniusStatus.payment?.state || ngeniusStatus.state;

        if (paymentState === 'CAPTURED' || paymentState === 'PURCHASED') {
          newStatus = 'paid';
        } else if (paymentState === 'FAILED' || paymentState === 'DECLINED') {
          newStatus = 'failed';
        } else if (paymentState === 'STARTED' || paymentState === 'PENDING') {
          newStatus = 'awaiting_payment';
        } else if (paymentState === 'AUTHORISED') {
          newStatus = 'processing';
        }

        // Update order if status changed
        if (newStatus !== order.status) {
          const paidAt = newStatus === 'paid' ? new Date() : null;
          
          await sequelize.query(`
            UPDATE orders 
            SET status = ?, 
                ngenius_payment_ref = ?,
                paid_at = ?
            WHERE id = ?
          `, {
            replacements: [
              newStatus,
              ngeniusStatus.payment?.paymentRef || null,
              paidAt,
              id
            ],
            type: QueryTypes.UPDATE,
            transaction
          });

          // Log transaction
          if (ngeniusStatus.payment) {
            const transactionId = uuidv4();
            await sequelize.query(`
              INSERT INTO payment_transactions (
                id, order_id, ngenius_payment_ref, ngenius_order_ref,
                transaction_type, amount, currency, status,
                auth_code, card_brand, card_last_four, raw_response
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, {
              replacements: [
                transactionId,
                id,
                ngeniusStatus.payment.paymentRef,
                order.ngenius_order_ref,
                'sale',
                ngeniusStatus.amount,
                ngeniusStatus.currency || 'AED',
                newStatus,
                ngeniusStatus.payment.authCode,
                ngeniusStatus.payment.cardBrand,
                ngeniusStatus.payment.cardLastFour,
                JSON.stringify(ngeniusStatus.rawResponse)
              ],
              type: QueryTypes.INSERT,
              transaction
            });
          }
        }

        await transaction.commit();

        res.json({
          success: true,
          data: {
            orderId: order.id,
            status: newStatus,
            paymentStatus: paymentState,
            amount: ngeniusStatus.amount || parseFloat(order.total_amount),
            currency: ngeniusStatus.currency || order.currency,
            cardBrand: ngeniusStatus.payment?.cardBrand,
            cardLastFour: ngeniusStatus.payment?.cardLastFour
          }
        });

      } catch (ngError) {
        console.error('N-Genius Status Check Error:', ngError);
        await transaction.commit();
        // Return cached status if N-Genius check fails
        res.json({
          success: true,
          data: {
            orderId: order.id,
            status: order.status,
            amount: parseFloat(order.total_amount),
            currency: order.currency
          }
        });
      }
    } else {
      await transaction.commit();
      res.json({
        success: true,
        data: {
          orderId: order.id,
          status: order.status,
          amount: parseFloat(order.total_amount),
          currency: order.currency
        }
      });
    }

  } catch (error) {
    await transaction.rollback();
    console.error('Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};

/**
 * Get user's orders
 * GET /api/v1/orders/my-orders
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const orders = await sequelize.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      {
        replacements: [userId],
        type: QueryTypes.SELECT
      }
    );

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
};

/**
 * Process refund
 * POST /api/v1/orders/:id/refund
 */
const refundOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const orders = await sequelize.query(
      'SELECT * FROM orders WHERE id = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
        transaction
      }
    );

    if (orders.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    if (order.status !== 'paid') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Only paid orders can be refunded'
      });
    }

    if (!order.ngenius_order_ref || !order.ngenius_payment_ref) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Payment reference not found'
      });
    }

    // Process refund with N-Genius
    const refundResult = await ngeniusService.refundPayment(
      order.ngenius_order_ref,
      order.ngenius_payment_ref,
      amount
    );

    // Update order status
    await sequelize.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      {
        replacements: ['refunded', id],
        type: QueryTypes.UPDATE,
        transaction
      }
    );

    // Log refund transaction
    const transactionId = uuidv4();
    await sequelize.query(`
      INSERT INTO payment_transactions (
        id, order_id, ngenius_payment_ref, ngenius_order_ref,
        transaction_type, amount, currency, status, raw_response
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        transactionId,
        id,
        refundResult.refundRef,
        order.ngenius_order_ref,
        'refund',
        amount || order.total_amount,
        order.currency,
        'refunded',
        JSON.stringify(refundResult.rawResponse)
      ],
      type: QueryTypes.INSERT,
      transaction
    });

    await transaction.commit();

    res.json({
      success: true,
      data: {
        orderId: order.id,
        refundRef: refundResult.refundRef,
        status: 'refunded',
        amount: amount || parseFloat(order.total_amount)
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Refund Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund'
    });
  }
};

module.exports = {
  createOrder,
  getOrder,
  verifyPayment,
  getMyOrders,
  refundOrder
};
