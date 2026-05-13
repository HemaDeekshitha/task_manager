const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

// Create task (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const task = await Task.create(req.body);

    // Automatically add the assigned user to the project members if they aren't already
    if (req.body.assignedTo && req.body.projectId) {
      const project = await Project.findByPk(req.body.projectId);
      const user = await User.findByPk(req.body.assignedTo);
      if (project && user) {
        await project.addMember(user);
      }
    }

    await Activity.create({
      action: `Created task: ${task.title}`,
      type: 'Task',
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks (Admin sees all, Member sees assigned)
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.findAll({
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
          { model: Project, as: 'project', attributes: ['id', 'name'] }
        ]
      });
    } else {
      tasks = await Task.findAll({
        where: { assignedTo: req.user.id },
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
          { model: Project, as: 'project', attributes: ['id', 'name'] }
        ]
      });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks for a specific project
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    let where = { projectId: req.params.projectId };
    if (req.user.role !== 'Admin') {
      where.assignedTo = req.user.id;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] }
      ]
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task status (Anyone assigned or Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is admin or assigned to the task
    if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    await task.update(req.body);

    if (req.body.status) {
      await Activity.create({
        action: `Updated task "${task.title}" to ${req.body.status}`,
        type: 'Task',
        userId: req.user.id
      });
    }

    const updatedTask = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] }
      ]
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
