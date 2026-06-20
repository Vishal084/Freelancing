const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { serviceId, serviceName, details, price } = req.body;

    const order = new Order({
      userId: req.user._id,
      serviceId,
      serviceName,
      details,
      price,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders.map((order) => order.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders };