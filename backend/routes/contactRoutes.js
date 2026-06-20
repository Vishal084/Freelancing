const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('phone').optional().trim(),
    body('service').optional().trim(),
  ],
  validate,
  submitContact
);

module.exports = router;