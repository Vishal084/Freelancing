const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  mission: String,
  vision: String,
  coreValues: [{ icon: String, title: String, description: String, color: String }],
  teamMembers: [{ name: String, role: String, bio: String, image: String, expertise: [String] }],
  milestones: [{ year: String, event: String, description: String }],
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } }
});

module.exports = mongoose.model('About', aboutSchema);