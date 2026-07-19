const Blog = require('../models/BlogAdmin');
const createBlog = async (req, res) => {
  const blog = new Blog(req.body);
  const saved = await blog.save();
  res.status(201).json(saved);
};
const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};
const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!blog) return res.status(404).json({ message: 'Not found' });
  res.json(blog);
};
const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Blog deleted' });
};
module.exports = { createBlog, getBlogs, updateBlog, deleteBlog };