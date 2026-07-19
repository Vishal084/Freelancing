// const Service = require('../models/Service');

// const getServices = async (req, res) => {
//   try {
//     const services = await Service.find().sort({ createdAt: -1 });
//     res.json(services.map((s) => s.toJSON()));
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // this is for admin : -



// module.exports = { getServices };




const Service = require('../models/Service');

// @desc    Get all services (public)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new service (admin only)
// @route   POST /api/admin/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, description, price, icon } = req.body;

    if (!name || !description || price === undefined || !icon) {
      return res.status(400).json({ message: 'Please provide all fields: name, description, price, icon' });
    }

    const service = new Service({ name, description, price, icon });
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service (admin only)
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const { name, description, price, icon } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update fields only if provided
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    if (icon !== undefined) service.icon = icon;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service (admin only)
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};