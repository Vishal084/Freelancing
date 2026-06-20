const express = require('express');
const { body } = require('express-validator');
const { createOrder, getUserOrders } = require('../controllers/orderController');
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

module.exports = router;