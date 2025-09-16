const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression'); // Import compression
const helmet = require('helmet'); // Import helmet
const cron = require('node-cron'); // Import node-cron
const { generateDailyReport } = require('./utils/reportGenerator'); // Import report generator

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression()); // Enable compression for all responses

// Add security headers using helmet
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https://www.google-analytics.com"],
    connectSrc: ["'self'", "http://localhost:5000"], // Allow connections to backend API
    frameAncestors: ["'self'"], // Replaces X-Frame-Options
  },
}));
app.use(helmet.noSniff()); // Sets X-Content-Type-Options: nosniff
app.use(helmet.xssFilter()); // Sets X-XSS-Protection (though CSP is preferred)

// Serve static files from the frontend's build folder with caching headers
app.use(express.static(path.join(__dirname, '../frontend/build'), {
  maxAge: '1y', // Cache for 1 year
  immutable: true, // Mark as immutable
  setHeaders: function (res, path) {
    if (express.static.mime.lookup(path) === 'text/html') {
      // Do not cache HTML files
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/apply', require('./routes/apply'));
app.use('/api/config', require('./routes/config')); // New config route

// Catch-all to serve frontend's index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/karuppanasamy_finance')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    console.error(`Server error: ${error.message}`);
    process.exit(1);
  }
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.statusCode || 500).json({
    message: err.message || 'An unexpected error occurred',
    // In production, avoid sending detailed error stack to client
    // error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

module.exports = app;