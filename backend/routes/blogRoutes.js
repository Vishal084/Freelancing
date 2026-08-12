const express = require('express');
const router = express.Router();
const { getPublishedBlogs, getBlogBySlug } = require('../controllers/blogControllerAdmin');

// GET /api/blogs – list only published blog posts
router.get('/', getPublishedBlogs);

// ✅ NEW: GET /api/blogs/:slug – single published blog post by slug
router.get('/:slug', getBlogBySlug);

module.exports = router;