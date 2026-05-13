const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

// Associations
Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Project.belongsToMany(User, { as: 'members', through: 'ProjectMembers' });
User.belongsToMany(Project, { as: 'projects', through: 'ProjectMembers' });

module.exports = Project;
