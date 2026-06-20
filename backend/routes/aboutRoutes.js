const express = require('express');
const { getAbout } = require('../controllers/aboutController');
const router = express.Router();

router.get('/', getAbout);

module.exports = router;