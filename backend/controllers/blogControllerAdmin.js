const Blog = require('../models/BlogAdmin'); // assuming file is BlogAdmin.js

// Admin: get all blogs (with pagination)
const getBlogs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [blogs, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(),
    ]);
    res.json({ blogs, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: get only published blogs (now with pagination)
const getPublishedBlogs = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [blogs, total] = await Promise.all([
      Blog.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments({ status: 'published' }),
    ]);
    res.json({
      blogs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists. Please use a unique slug.' });
    }
    res.status(400).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Blog deleted' });
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: 'published',
    });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBlog, getBlogs, getPublishedBlogs, getBlogBySlug, updateBlog, deleteBlog };