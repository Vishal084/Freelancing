const express = require('express');
const router = express.Router();
const { getFAQs } = require('../controllers/faqControllerAdmin');   // ← fixed

// GET /api/faqs – list all FAQs (sorted by order)
router.get('/', getFAQs);

module.exports = router;