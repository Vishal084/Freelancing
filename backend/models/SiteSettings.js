const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    phone: { type: String, default: '+1 (555) 123-4567' },
    email: { type: String, default: 'hello@techagency.com' },
    address: { type: String, default: '123 Tech Street' },
    city: { type: String, default: 'San Francisco' },
    state: { type: String, default: 'CA' },
    zip: { type: String, default: '94107' },
    workingHours: { type: String, default: 'Mon-Fri 9am-6pm' },
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      instagram: { type: String, default: '' }
    }
  },
  {
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
  }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);