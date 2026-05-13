const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.ENUM('Login', 'Project', 'Task', 'Member'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

Activity.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = Activity;
