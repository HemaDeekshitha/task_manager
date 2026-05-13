const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

// Create project (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id,
    });
    
    // Add creator as member
    const user = await User.findByPk(req.user.id);
    await project.addMember(user);

    await Activity.create({
      action: `Created project: ${project.name}`,
      type: 'Project',
      userId: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects for the user (Admin sees all, Member sees assigned)
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] },
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
        ]
      });
    } else {
      const user = await User.findByPk(req.user.id);
      projects = await user.getProjects({
        include: [
          { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] },
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
        ]
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member or admin
    const isMember = await project.hasMember(req.user.id);
    if (req.user.role !== 'Admin' && !isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to project (Admin only)
router.post('/:id/members', protect, admin, async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await project.addMember(user);

    await Activity.create({
      action: `Added ${user.name} to project ${project.name}`,
      type: 'Member',
      userId: req.user.id
    });

    res.json({ message: 'Member added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove member from project (Admin only)
router.delete('/:id/members/:userId', protect, admin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await project.removeMember(user);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
