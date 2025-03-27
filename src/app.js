const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const tmfRoutes = require('./routes/tmf.route');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');
const path = require('path');
// Load environment variables
dotenv.config();

// Import routes
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/tmf', tmfRoutes);


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling
app.use(errorHandler);

module.exports = app; 