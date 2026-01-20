/**
 * Orders Controller
 * BeFree EdTech Platform
 * 
 * Handles order creation and payment processing with N-Genius
 */

const { Pool } = require('pg');
const ngeniusService = require('../services/ngenius.service');
const { v4: uuidv4 } = require('uuid');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Create a new order and initiate payment
 * POST /api/v1/orders
 */
const createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      planId,
      billing,
      quantity,
      contactInfo,
      paymentMethod,
      cardInfo,
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
    const planResult = await client.query(
      'SELECT * FROM plans WHERE id = $1 OR name = $1',
      [planId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    const plan = planResult.rows[0];
    
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

    // Generate merchant order reference
    const merchantOrderRef = `BF-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create order in database
    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, plan_id, plan_name, billing_cycle, quantity,
        base_price, discount_amount, total_amount, currency,
        first_name, last_name, email, phone,
        country, address_line1, address_line2, city, state, postal_code,
        payment_method, merchant_order_reference, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `, [
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
    ]);

    const order = orderResult.rows[0];

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
      redirectUrl: `${process.env.FRONTEND_URL}/payment-success?orderId=${order.id}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${order.id}`
    });

    // Update order with N-Genius reference
    await client.query(`
      UPDATE orders 
      SET ngenius_order_ref = $1, payment_url = $2, status = 'awaiting_payment', updated_at = NOW()
      WHERE id = $3
    `, [ngeniusOrder.orderRef, ngeniusOrder.paymentUrl, order.id]);

    // Return success with payment URL
    res.status(201).json({
      success: true,
      data: {
        id: order.id,
        merchantOrderReference: merchantOrderRef,
        ngeniusOrderRef: ngeniusOrder.orderRef,
        paymentUrl: ngeniusOrder.paymentUrl,
        amount: totalAmount,
        currency: 'AED'
      }
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  } finally {
    client.release();
  }
};

/**
 * Get order by ID
 * GET /api/v1/orders/:id
 */
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
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
 * Get order status (checks with N-Genius)
 * GET /api/v1/orders/:id/status
 */
const getOrderStatus = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;

    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // If order has N-Genius reference, check status
    if (order.ngenius_order_ref) {
      try {
        const ngeniusStatus = await ngeniusService.getOrderStatus(order.ngenius_order_ref);
        
        // Map N-Genius state to our status
        let newStatus = order.status;
        if (ngeniusStatus.state === 'CAPTURED' || ngeniusStatus.payment?.state === 'CAPTURED') {
          newStatus = 'paid';
        } else if (ngeniusStatus.state === 'FAILED') {
          newStatus = 'failed';
        } else if (ngeniusStatus.state === 'STARTED') {
          newStatus = 'awaiting_payment';
        }

        // Update order if status changed
        if (newStatus !== order.status) {
          await client.query(`
            UPDATE orders 
            SET status = $1, 
                ngenius_payment_ref = $2,
                paid_at = $3,
                updated_at = NOW()
            WHERE id = $4
          `, [
            newStatus,
            ngeniusStatus.payment?.paymentRef || null,
            newStatus === 'paid' ? new Date() : null,
            id
          ]);

          // Log transaction
          if (ngeniusStatus.payment) {
            await client.query(`
              INSERT INTO payment_transactions (
                order_id, ngenius_payment_ref, ngenius_order_ref,
                transaction_type, amount, currency, status,
                auth_code, card_brand, card_last_four, raw_response
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
              ON CONFLICT DO NOTHING
            `, [
              id,
              ngeniusStatus.payment.paymentRef,
              order.ngenius_order_ref,
              'sale',
              ngeniusStatus.amount,
              ngeniusStatus.currency,
              ngeniusStatus.payment.state?.toLowerCase(),
              ngeniusStatus.payment.authCode,
              ngeniusStatus.payment.cardBrand,
              ngeniusStatus.payment.cardLastFour,
              JSON.stringify(ngeniusStatus.rawResponse)
            ]);
          }
        }

        res.json({
          success: true,
          data: {
            orderId: order.id,
            status: newStatus,
            paymentStatus: ngeniusStatus.payment?.state,
            amount: ngeniusStatus.amount,
            currency: ngeniusStatus.currency,
            cardBrand: ngeniusStatus.payment?.cardBrand,
            cardLastFour: ngeniusStatus.payment?.cardLastFour
          }
        });

      } catch (ngError) {
        console.error('N-Genius Status Check Error:', ngError);
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
    console.error('Get Order Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order status'
    });
  } finally {
    client.release();
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

    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
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
 * N-Genius Webhook Handler
 * POST /api/v1/orders/webhook
 */
const handleWebhook = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const payload = req.body;
    
    // Log webhook for debugging
    await client.query(`
      INSERT INTO webhook_logs (source, event_type, order_ref, payload)
      VALUES ($1, $2, $3, $4)
    `, [
      'ngenius',
      payload.eventName || 'unknown',
      payload.order?.reference,
      JSON.stringify(payload)
    ]);

    // Process payment notification
    if (payload.order?.reference) {
      const orderRef = payload.order.reference;
      const payment = payload.order._embedded?.payment?.[0];
      
      // Find order by N-Genius reference
      const orderResult = await client.query(
        'SELECT * FROM orders WHERE ngenius_order_ref = $1',
        [orderRef]
      );

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0];
        
        // Determine new status
        let newStatus = order.status;
        const paymentState = payment?.state;

        if (paymentState === 'CAPTURED') {
          newStatus = 'paid';
        } else if (paymentState === 'FAILED') {
          newStatus = 'failed';
        } else if (paymentState === 'AUTHORISED') {
          newStatus = 'processing';
        }

        // Update order
        await client.query(`
          UPDATE orders 
          SET status = $1, 
              ngenius_payment_ref = $2,
              paid_at = $3,
              updated_at = NOW()
          WHERE id = $4
        `, [
          newStatus,
          payment?.reference,
          newStatus === 'paid' ? new Date() : null,
          order.id
        ]);

        // Log transaction
        if (payment) {
          await client.query(`
            INSERT INTO payment_transactions (
              order_id, ngenius_payment_ref, ngenius_order_ref,
              transaction_type, amount, currency, status,
              response_code, response_message, auth_code,
              card_brand, card_last_four, raw_response
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          `, [
            order.id,
            payment.reference,
            orderRef,
            'sale',
            (payment.amount?.value || 0) / 100,
            payment.amount?.currencyCode || 'AED',
            paymentState?.toLowerCase(),
            payment._embedded?.cnpResponse?.resultCode,
            payment._embedded?.cnpResponse?.resultMessage,
            payment.authorizationCode,
            payment._embedded?.cnpResponse?.scheme,
            payment._embedded?.cnpResponse?.pan?.slice(-4),
            JSON.stringify(payload)
          ]);
        }

        // Mark webhook as processed
        await client.query(`
          UPDATE webhook_logs SET processed = true WHERE order_ref = $1
        `, [orderRef]);
      }
    }

    // Always return 200 to acknowledge webhook
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    // Still return 200 to prevent retries
    res.status(200).json({ received: true, error: error.message });
  } finally {
    client.release();
  }
};

/**
 * Process refund
 * POST /api/v1/orders/:id/refund
 */
const refundOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { amount } = req.body; // Optional partial refund amount

    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid orders can be refunded'
      });
    }

    if (!order.ngenius_order_ref || !order.ngenius_payment_ref) {
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
    await client.query(`
      UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1
    `, [id]);

    // Log refund transaction
    await client.query(`
      INSERT INTO payment_transactions (
        order_id, ngenius_payment_ref, ngenius_order_ref,
        transaction_type, amount, currency, status, raw_response
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      id,
      refundResult.refundRef,
      order.ngenius_order_ref,
      'refund',
      amount || order.total_amount,
      order.currency,
      refundResult.state?.toLowerCase(),
      JSON.stringify(refundResult.rawResponse)
    ]);

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
    console.error('Refund Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund'
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrderStatus,
  getMyOrders,
  handleWebhook,
  refundOrder
};
