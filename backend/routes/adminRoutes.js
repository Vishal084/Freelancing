const express = require('express');
const { body, query } = require('express-validator');
const validate = require('../middleware/validate');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Import all controllers
const { getDashboard } = require('../controllers/adminController');
const { createService, updateService, deleteService } = require('../controllers/serviceController');
const { createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { updateAbout } = require('../controllers/aboutController');
const { getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { getContacts, deleteContact } = require('../controllers/contactController');
const { listUsers, deleteUser, toggleBan, makeAdmin } = require('../controllers/userControllerAdmin');

console.log('toggleBan:', typeof toggleBan);   // should print 'function'
console.log('makeAdmin:', typeof makeAdmin);     // should print 'function'

const { createBlog, updateBlog, deleteBlog, getBlogs } = require('../controllers/blogControllerAdmin');
const { createTestimonial, updateTestimonial, deleteTestimonial, getTestimonials } = require('../controllers/testimonialControllerAdmin');
const { createFAQ, updateFAQ, deleteFAQ, getFAQs } = require('../controllers/faqControllerAdmin');
const { updateSiteSettings, getSiteSettings } = require('../controllers/SiteSettingsController');

// All routes protected and admin-only
router.use(protect, admin);

router.get('/dashboard', getDashboard);

// ── Blogs (admin CRUD) ──
router.get('/blogs', getBlogs);
router.post(
  '/blogs',
  [
    body('title').trim().notEmpty().isLength({ max: 200 }),
    body('content').trim().notEmpty(),
    body('image').optional().isURL(),
    body('status').optional().isIn(['draft', 'published']),
  ],
  validate,
  createBlog
);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// ── Services (added validation) ──
router.post(
  '/services',
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isNumeric().notEmpty(),
    body('icon').trim().notEmpty(),
  ],
  validate,
  createService
);
router.put(
  '/services/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('price').optional().isNumeric(),
    body('icon').optional().trim().notEmpty(),
  ],
  validate,
  updateService
);
router.delete('/services/:id', deleteService);

// ── Projects (added validation) ──
router.post(
  '/projects',
  [
    body('title').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('image').trim().notEmpty().isURL(),
  ],
  validate,
  createProject
);
router.put(
  '/projects/:id',
  [
    body('title').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('image').optional().trim().notEmpty().isURL(),
  ],
  validate,
  updateProject
);
router.delete('/projects/:id', deleteProject);

// ── About (validation added) ──
router.put('/about', [
  body('mission').optional().trim().isString(),
  body('vision').optional().trim().isString(),
  body('coreValues').optional().isArray(),
  body('coreValues.*.icon').optional().trim(),
  body('coreValues.*.title').optional().trim(),
  body('coreValues.*.description').optional().trim(),
  body('coreValues.*.color').optional().trim(),
  body('teamMembers').optional().isArray(),
  body('teamMembers.*.name').optional().trim(),
  body('teamMembers.*.role').optional().trim(),
  body('teamMembers.*.bio').optional().trim(),
  body('teamMembers.*.image').optional().isURL(),
  body('teamMembers.*.expertise').optional().isArray(),
  body('milestones').optional().isArray(),
  body('milestones.*.year').optional().trim(),
  body('milestones.*.event').optional().trim(),
  body('milestones.*.description').optional().trim(),
], validate, updateAbout);

// ── Orders ──
router.get('/orders', getAllOrders);
router.put(
  '/orders/:id/status',
  [
    body('status')
      .isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid order status'),
  ],
  validate,
  updateOrderStatus
);
router.delete('/orders/:id', deleteOrder);

// ── Contacts ──
router.get('/contacts', getContacts);
router.delete('/contacts/:id', deleteContact);

// ── Users ──
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', toggleBan);
router.put('/users/:id/admin', makeAdmin);

// ── Testimonials (validation was already present) ──
router.get('/testimonials', getTestimonials);
router.post(
  '/testimonials',
  [
    body('name').trim().notEmpty(),
    body('quote').trim().notEmpty(),
    body('role').optional().trim(),
    body('avatar').optional().isURL(),
  ],
  validate,
  createTestimonial
);
router.put(
  '/testimonials/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('quote').optional().trim().notEmpty(),
    body('role').optional().trim(),
    body('avatar').optional().isURL(),
  ],
  validate,
  updateTestimonial
);
router.delete('/testimonials/:id', deleteTestimonial);

// ── FAQs (validation added) ──
router.get('/faqs', getFAQs);
router.post('/faqs', [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
  body('order').optional().isNumeric(),
  body('status').optional().isIn(['pending', 'approved', 'rejected']),
], validate, createFAQ);
router.put('/faqs/:id', [
  body('question').optional().trim().notEmpty(),
  body('answer').optional().trim().notEmpty(),
  body('order').optional().isNumeric(),
  body('status').optional().isIn(['pending', 'approved', 'rejected']),
], validate, updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

// ── Site Settings ──
router.get('/site-settings', getSiteSettings);
router.put('/site-settings', updateSiteSettings);

module.exports = router;