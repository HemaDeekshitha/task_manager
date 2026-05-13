const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const protect = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/stats', protect, async (req, res) => {
  try {
    let where = {};
    if (req.user.role !== 'Admin') {
      where = { assignedTo: req.user.id };
    }

    const tasks = await Task.findAll({ where });

    const totalTasks = tasks.length;
    const tasksByStatus = {
      'Pending': tasks.filter(t => t.status === 'Pending').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Completed': tasks.filter(t => t.status === 'Completed').length,
    };

    const overdueTasks = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      t.status !== 'Completed'
    ).length;

    let tasksPerUser = [];
    if (req.user.role === 'Admin') {
      const users = await User.findAll({ where: { role: 'Member' } });
      tasksPerUser = await Promise.all(users.map(async (user) => {
        const count = await Task.count({ where: { assignedTo: user.id } });
        return { name: user.name, count };
      }));
    }

    const activities = await Activity.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    res.json({
      totalTasks,
      tasksByStatus,
      overdueTasks,
      tasksPerUser,
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
