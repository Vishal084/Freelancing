const SiteSettings = require('../models/SiteSettings');

// Get current settings (create default if none exist)
const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings (admin only)
const updateSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      // create if not found
      const newSettings = new SiteSettings(req.body);
      await newSettings.save();
      return res.json(newSettings);
    }
    // Update only the provided fields
    Object.keys(req.body).forEach((key) => {
      if (key === 'socialLinks') {
        Object.assign(settings.socialLinks, req.body.socialLinks);
      } else {
        settings[key] = req.body[key];
      }
    });
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSiteSettings, updateSiteSettings };