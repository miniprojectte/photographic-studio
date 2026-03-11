require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3003'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// JSON body parser - but not for upload routes (multer handles those)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/upload')) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(morgan('dev')); // HTTP request logger

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Photography Studio API',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/profile', require('./routers/profileRoutes'));
app.use('/api/sessions', require('./routers/sessionRoutes'));
app.use('/api/photos', require('./routers/photoRoutes'));
app.use('/api/bookings', require('./routers/bookingRoutes'));
app.use('/api/messages', require('./routers/messageRoutes'));
app.use('/api/upload', require('./routers/uploadRoutes'));
app.use('/api/reports', require('./routers/reportRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
