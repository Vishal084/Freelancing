const mongoose = require('mongoose');
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  quote: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true, toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } } });
module.exports = mongoose.model('Testimonial', testimonialSchema);