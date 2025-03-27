require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/database');
// Connect to MongoDB
connectDatabase();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

}); 
