const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Pending',
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
  },
}, {
  timestamps: true,
});

// Associations
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });
Project.hasMany(Task, { as: 'tasks', foreignKey: 'projectId' });

module.exports = Task;
