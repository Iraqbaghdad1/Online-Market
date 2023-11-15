const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = require('./config/db');
// Connect to the database
connectDB();

// Define a route for the root URL
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Online Market Web-App" });
});

// Routes
app.use('/api/users', userRoutes);
// Auth routes
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
