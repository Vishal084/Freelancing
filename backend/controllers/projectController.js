// const Project = require('../models/Project');

// const getProjects = async (req, res) => {
//   try {
//     const projects = await Project.find().sort({ createdAt: -1 });
//     res.json(projects.map((p) => p.toJSON()));
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getProjects };



const Project = require('../models/Project');

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project (admin only)
// @route   POST /api/admin/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { title, category, description, image } = req.body;

    if (!title || !category || !description || !image) {
      return res.status(400).json({
        message: 'Please provide all fields: title, category, description, image',
      });
    }

    const project = new Project({ title, category, description, image });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project (admin only)
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { title, category, description, image } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title !== undefined) project.title = title;
    if (category !== undefined) project.category = category;
    if (description !== undefined) project.description = description;
    if (image !== undefined) project.image = image;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project (admin only)
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};