const FAQ = require('../models/FAQadmin');

// @desc    Create a new FAQ (admin only)
// @route   POST /api/admin/faqs
// @access  Private/Admin
const createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    const saved = await faq.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all FAQs (admin or public – see routes)
// @route   GET /api/faqs or /api/admin/faqs
// @access  Public / Private/Admin
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a FAQ (admin only)
// @route   PUT /api/admin/faqs/:id
// @access  Private/Admin
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a FAQ (admin only)
// @route   DELETE /api/admin/faqs/:id
// @access  Private/Admin
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFAQ,
  getFAQs,
  updateFAQ,
  deleteFAQ,
};