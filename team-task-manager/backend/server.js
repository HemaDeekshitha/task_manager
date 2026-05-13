const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load models before DB sync
require('./models/User');
require('./models/Project');
require('./models/Task');
require('./models/Activity');

const { connectDB } = require('./config/db');

dotenv.config();
connectDB();

const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
