const About = require('../models/About');

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne(); // Single document
    if (!about) return res.status(404).json({ message: 'About data not found' });
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// this is for admin : -

const updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAbout, updateAbout };