const express = require('express');
const router = express.Router();
const { submitFAQ, getPublicFAQs } = require('../controllers/faqControllerAdmin');

// GET /api/faqs – only approved FAQs
router.get('/', getPublicFAQs);

// POST /api/faqs – user submission (no auth)
router.post('/', submitFAQ);

module.exports = router;