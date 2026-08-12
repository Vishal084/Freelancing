const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  quote: { type: String, required: true },
  avatar: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      // _id kept
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);