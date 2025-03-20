const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));


// Routes
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling
app.use(errorHandler);

module.exports = app; 