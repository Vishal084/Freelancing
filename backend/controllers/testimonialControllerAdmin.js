const Testimonial = require('../models/TestimonialAdmin');

// ── Public: submit a testimonial (user frontend) ──
const submitTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial({
      ...req.body,
      status: 'pending'
    });
    const saved = await testimonial.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Public: get only approved testimonials (now with pagination) ──
const getApprovedTestimonials = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [testimonials, total] = await Promise.all([
      Testimonial.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Testimonial.countDocuments({ status: 'approved' }),
    ]);
    res.json({
      testimonials,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: get all testimonials (with pagination) ──
const getTestimonials = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [testimonials, total] = await Promise.all([
      Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(),
    ]);
    res.json({
      testimonials,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin: create (auto‑approved unless status is explicitly set) ──
const createTestimonial = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.status) data.status = 'approved';
    const testimonial = new Testimonial(data);
    const saved = await testimonial.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitTestimonial,
  getApprovedTestimonials,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};