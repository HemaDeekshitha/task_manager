const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root:HEMA2062004@localhost:3306/team_task_manager', {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 60000
  }
});

const connectDB = async () => {
  try {
    console.log('Connecting to database:', process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'No URL provided');
    await sequelize.authenticate();
    console.log('MySQL Connected');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
