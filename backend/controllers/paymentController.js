const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const Service = require('../models/Service');

/**
 * @desc    Create Razorpay Order securely using DB prices
 * @route   POST /api/payment/create-order
 * @access  Private
 */
const createRazorpayOrder = async (req, res) => {
  try {
    const { serviceId, details } = req.body;

    // 1. SECURITY: Fetch service price directly from the Database
    // NEVER accept or trust 'price' or 'amount' from client request body
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const priceInINR = service.price;
    // Razorpay accepts amount in paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(priceInINR * 100);

    // 2. Create Order in Razorpay
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: {
        userId: req.user._id.toString(),
        serviceId: service._id.toString(),
        serviceName: service.name,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. Save order record in local Database with paymentStatus 'pending'
    const newOrder = new Order({
      userId: req.user._id,
      serviceId: service._id.toString(),
      serviceName: service.name,
      details: details || `Order for ${service.name}`,
      price: priceInINR,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order: newOrder.toJSON(),
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment order' });
  }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required Razorpay payment verification fields' });
    }

    // Generate HMAC-SHA256 signature using key_secret
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        return res.status(404).json({ message: 'Associated order not found in database' });
      }

      // SECURITY: Cross-check the amount actually captured by Razorpay against
      // the DB-derived price on the order. Never trust an amount from the client.
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      const expectedAmountInPaise = Math.round(order.price * 100);

      if (payment.order_id !== razorpay_order_id || Number(payment.amount) !== expectedAmountInPaise) {
        order.paymentStatus = 'failed';
        await order.save();

        return res.status(400).json({
          success: false,
          message: `Amount mismatch: expected ₹${order.price} but payment was for ₹${(Number(payment.amount) / 100).toFixed(2)}.`,
        });
      }

      // Payment verified successfully
      order.paymentStatus = 'paid';
      order.status = 'completed';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        order: order.toJSON(),
      });
    } else {
      // Signature mismatch - potential tampering
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
};

/**
 * @desc    Razorpay Webhook listener for payment events
 * @route   POST /api/payment/webhook
 * @access  Public (Validated with Webhook Secret HMAC)
 */
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature if secret is provided
    if (webhookSecret) {
      // Use rawBody buffer attached in server.js
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(req.rawBody || JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== signature) {
        console.error('Webhook signature validation failed');
        return res.status(400).json({ status: 'failure', message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`Razorpay Webhook received event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== 'paid') {
          // SECURITY: Confirm the captured amount matches the DB-derived price
          // before marking the order paid.
          const expectedAmountInPaise = Math.round(order.price * 100);
          if (Number(paymentEntity.amount) !== expectedAmountInPaise) {
            order.paymentStatus = 'failed';
            await order.save();
            console.error(
              `Order ${order._id} amount mismatch via Webhook: expected ${expectedAmountInPaise}, got ${paymentEntity.amount}`
            );
          } else {
            order.paymentStatus = 'paid';
            order.status = 'completed';
            order.razorpayPaymentId = razorpayPaymentId;
            await order.save();
            console.log(`Order ${order._id} updated to PAID via Webhook`);
          }
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId });
        if (order) {
          order.paymentStatus = 'failed';
          await order.save();
          console.log(`Order ${order._id} marked as FAILED via Webhook`);
        }
      }
    }

    // Acknowledge receipt to Razorpay
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
};
