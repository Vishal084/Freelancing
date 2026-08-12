const express = require('express');
const router = express.Router();
const {
  getApprovedTestimonials,   // only approved
  submitTestimonial           // user submission (pending)
} = require('../controllers/testimonialControllerAdmin');

// GET /api/testimonials – only approved testimonials
router.get('/', getApprovedTestimonials);

// POST /api/testimonials – user submission (no auth required)
router.post('/', submitTestimonial);

module.exports = router;