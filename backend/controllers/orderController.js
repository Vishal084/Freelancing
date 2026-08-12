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

// Admin: paginated list
const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [orders, total] = await Promise.all([
      Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(),
    ]);
    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order deleted' });
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to cancel this order' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // ✅ Only allow cancellation for orders that are still pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    res.json(updatedOrder.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus, deleteOrder };