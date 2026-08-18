const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const router = express.Router();
const { submitFAQ, getPublicFAQs } = require('../controllers/faqControllerAdmin');

// GET /api/faqs – only approved FAQs
router.get('/', getPublicFAQs);

// POST /api/faqs – user submission (no auth)
router.post(
  '/',
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').optional().trim().isString(),
  ],
  validate,
  submitFAQ
);

module.exports = router;