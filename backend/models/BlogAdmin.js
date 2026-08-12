const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Pre-save hook: generate slug from title if missing
blogSchema.pre('save', async function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Ensure status is always lowercase
  if (this.status) {
    this.status = this.status.toLowerCase();
  }
});

module.exports = mongoose.model('Blog', blogSchema);