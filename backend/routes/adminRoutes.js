const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const { getDashboard } = require('../controllers/adminController');
const { createService, updateService, deleteService } = require('../controllers/serviceController');
const { createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { updateAbout } = require('../controllers/aboutController');
const { getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { getContacts, deleteContact } = require('../controllers/contactController');
const { listUsers, deleteUser, toggleBan, makeAdmin } = require('../controllers/userControllerAdmin');     // ← fixed
const { createBlog, updateBlog, deleteBlog, getBlogs } = require('../controllers/blogControllerAdmin');   // ← fixed
const { createTestimonial, updateTestimonial, deleteTestimonial, getTestimonials } = require('../controllers/testimonialControllerAdmin'); // ← fixed
const { createFAQ, updateFAQ, deleteFAQ, getFAQs } = require('../controllers/faqControllerAdmin');       // ← fixed

// All routes protected and admin-only
router.use(protect, admin);

router.get('/dashboard', getDashboard);

router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.put('/about', updateAbout);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

router.get('/contacts', getContacts);
router.delete('/contacts/:id', deleteContact);

router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', toggleBan);
router.put('/users/:id/admin', makeAdmin);

router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/testimonials', getTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

router.get('/faqs', getFAQs);
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

module.exports = router;