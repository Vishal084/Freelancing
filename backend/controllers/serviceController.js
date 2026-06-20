const Service = require('../models/Service');

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services.map((s) => s.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices };