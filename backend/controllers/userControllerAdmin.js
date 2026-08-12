const User = require('../models/User');
const Order = require('../models/Order');

const listUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    res.json({ users, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Prevent deleting the only remaining admin
    if (user.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin. Appoint another admin first.' });
      }
    }

    // Delete all orders belonging to this user
    await Order.deleteMany({ userId: req.params.id });

    await user.deleteOne();
    res.json({ message: 'User and their orders deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listUsers, deleteUser, toggleBan, makeAdmin };