const express = require('express');

const router = express.Router();

const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const projectRoutes = require('./projectRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const contactRoutes = require('./contactRoutes');
const aboutRoutes = require('./aboutRoutes');
const adminRoutes = require('./adminRoutes');
const blogRoutes = require('./blogRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const faqRoutes = require('./faqRoutes');
const siteSettingsRoutes = require('./siteSettingsRoutes'); // ✅ added

// Mount all sub‑routers
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/projects', projectRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/contact', contactRoutes);
router.use('/about', aboutRoutes);
router.use('/admin', adminRoutes);
router.use('/blogs', blogRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/faqs', faqRoutes);
router.use('/site-settings', siteSettingsRoutes); // ✅ added

module.exports = router;