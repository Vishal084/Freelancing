const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
} = require('../controllers/paymentController');

const router = express.Router();

// 1. Create Razorpay order (Protected)
router.post(
  '/create-order',
  protect,
  [
    body('serviceId').notEmpty().withMessage('Service ID is required'),
  ],
  validate,
  createRazorpayOrder
);

// 2. Verify Razorpay Payment Signature (Protected)
router.post(
  '/verify',
  protect,
  [
    body('razorpay_order_id').notEmpty().withMessage('Razorpay Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Razorpay Payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Razorpay Signature is required'),
  ],
  validate,
  verifyPayment
);

// 3. Razorpay Webhook endpoint (Public)
router.post('/webhook', handleWebhook);

module.exports = router;
