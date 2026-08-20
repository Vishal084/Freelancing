const express = require('express');
const router = express.Router();
const { getSiteSettings } = require('../controllers/SiteSettingsController');

// Public: anyone can fetch site settings
router.get('/', getSiteSettings);

module.exports = router;