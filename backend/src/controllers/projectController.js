import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = Project.findAll(userId);

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = Project.findById(req.params.id, req.user.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      userId: req.user.id
    };

    if (!projectData.name || projectData.name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    const project = Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = Project.update(req.params.id, req.user.id, req.body);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = Project.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

export const archiveProject = async (req, res) => {
  try {
    const project = Project.archive(req.params.id, req.user.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project archived successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error archiving project',
      error: error.message
    });
  }
};
