const express = require('express');
const router = express.Router();
const { getBlogs } = require('../controllers/blogControllerAdmin');   // ← fixed

// GET /api/blogs – list all blog posts
router.get('/', getBlogs);

module.exports = router;