const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects.map((p) => p.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects };