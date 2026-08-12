const express = require('express');
const { body } = require('express-validator');
const { createOrder, getUserOrders, cancelOrder } = require('../controllers/orderController'); // ← added cancelOrder
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('serviceId').notEmpty().withMessage('Service ID is required'),
    body('serviceName').notEmpty().withMessage('Service name is required'),
    body('details').trim().notEmpty().withMessage('Details are required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  validate,
  createOrder
);

router.get('/user/me', protect, getUserOrders);

// ✅ NEW: Cancel an order
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;