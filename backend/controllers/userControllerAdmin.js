const User = require('../models/User');

const listUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};
const toggleBan = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isBanned = !user.isBanned;
  await user.save();
  res.json(user);
};
const makeAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json(user);
};
module.exports = { listUsers, deleteUser, toggleBan, makeAdmin };