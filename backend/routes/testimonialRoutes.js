const express = require('express');
const router = express.Router();
const { getTestimonials } = require('../controllers/testimonialControllerAdmin');   // ← fixed

// GET /api/testimonials – list all testimonials
router.get('/', getTestimonials);

module.exports = router;