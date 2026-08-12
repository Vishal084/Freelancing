const FAQ = require('../models/FAQadmin');

// ── Public: submit a question (status = pending) ──
const submitFAQ = async (req, res) => {
  try {
    const faq = new FAQ({
      question: req.body.question,
      answer: req.body.answer || '',   // ← ensure answer is never undefined
      status: 'pending'
    });
    const saved = await faq.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Public: get only approved FAQs (now with pagination) ──
const getPublicFAQs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [faqs, total] = await Promise.all([
      FAQ.find({ status: 'approved' })
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FAQ.countDocuments({ status: 'approved' }),
    ]);
    res.json({
      faqs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: get all FAQs (with pagination) ──
const getFAQs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [faqs, total] = await Promise.all([
      FAQ.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      FAQ.countDocuments(),
    ]);
    res.json({
      faqs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: create FAQ (can set any status) ──
const createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    const saved = await faq.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Admin: update FAQ ──
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Admin: delete FAQ ──
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFAQ,
  getPublicFAQs,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};