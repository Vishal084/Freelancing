const express = require('express');
const router = express.Router();
const { getSiteSettings } = require('../controllers/siteSettingsController');

// Public: anyone can fetch site settings
router.get('/', getSiteSettings);

module.exports = router;