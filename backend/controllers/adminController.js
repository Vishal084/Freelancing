const Service = require('../models/Service');
const Project = require('../models/Project');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  const servicesCount = await Service.countDocuments();
  const projectsCount = await Project.countDocuments();
  const ordersCount = await Order.countDocuments();
  const contactsCount = await Contact.countDocuments();
  const usersCount = await User.countDocuments();
  res.json({ servicesCount, projectsCount, ordersCount, contactsCount, usersCount });
};
module.exports = { getDashboard };