# Backend Documentation

This document provides comprehensive documentation for the Photography Studio backend API built with Express.js, MongoDB, and modern Node.js practices.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM 8.17.1
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **Password Hashing**: bcrypt 6.0.0

### Middleware & Utilities
- **CORS**: Cross-Origin Resource Sharing support
- **Morgan**: HTTP request logging
- **dotenv**: Environment variable management

## Architecture Pattern

The backend follows the **MVC (Model-View-Controller)** pattern with additional middleware layer:

```
Request → Middleware → Router → Controller → Model → Database
                  ↓
Response ← Middleware ← Router ← Controller ← Model ← Database
```

## Project Structure

```
app/backend/
├── server.js                     # Main application entry point
├── package.json                  # Dependencies and scripts
├── .env                         # Environment variables
│
├── config/                      # Configuration files
│   └── db.js                   # MongoDB connection setup
│
├── middleware/                  # Custom middleware functions
│   └── authMiddleware.js       # JWT authentication middleware
│
├── models/                     # Mongoose data models
│   ├── userModel.js           # User schema and model
│   ├── bookingModel.js        # Booking schema and model
│   ├── sessionModel.js        # Session schema and model
│   ├── photoModel.js          # Photo schema and model
│   └── invoiceModel.js        # Invoice schema and model
│
├── controllers/               # Business logic controllers
│   └── bookingController.js  # Booking-related business logic
│
└── routers/                  # API route definitions
    ├── authRoutes.js        # Authentication routes
    ├── bookingRoutes.js     # Booking management routes
    ├── sessionRoutes.js     # Session management routes
    ├── photoRoutes.js       # Photo management routes
    └── profileRoutes.js     # User profile routes
```

## Database Models

### User Model (`models/userModel.js`)

**Purpose**: Store user account information and authentication data.

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    validate: [validator.isMobilePhone, 'Invalid phone number']
  },
  address: String,
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  }
}, {
  timestamps: true
});
```

**Security Features**:
- Password hashing with bcrypt (10 salt rounds)
- Email uniqueness enforcement
- Input validation with custom validators
- Automatic timestamp tracking

### Booking Model (`models/bookingModel.js`)

**Purpose**: Handle session booking requests from clients.

```javascript
const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [validator.isEmail, 'Invalid email format']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  sessionType: {
    type: String,
    required: [true, 'Session type is required'],
    enum: {
      values: ['portrait', 'wedding', 'family', 'event', 'commercial'],
      message: 'Invalid session type'
    }
  },
  date: {
    type: Date,
    required: [true, 'Session date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Session date must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});
```

**Business Rules**:
- Session types limited to predefined options
- Future date validation for bookings
- Status workflow: pending → confirmed → completed
- Optional client association for registered users

### Session Model (`models/sessionModel.js`)

**Purpose**: Manage confirmed photography sessions.

```javascript
const sessionSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['portrait', 'wedding', 'family', 'event', 'commercial']
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in hours
    default: 2
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: String,
  equipment: [String],
  pricing: {
    basePrice: Number,
    additionalCharges: [{
      description: String,
      amount: Number
    }],
    totalAmount: Number
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
}, {
  timestamps: true
});
```

### Photo Model (`models/photoModel.js`)

**Purpose**: Store and manage delivered photos from sessions.

```javascript
const photoSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  metadata: {
    size: Number,
    width: Number,
    height: Number,
    format: String,
    colorSpace: String
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [String],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
```

### Invoice Model (`models/invoiceModel.js`)

**Purpose**: Handle billing and payment tracking.

```javascript
const invoiceSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    rate: Number,
    amount: Number
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  dueDate: Date,
  paidDate: Date,
  paymentMethod: String,
  notes: String
}, {
  timestamps: true
});
```

## Controllers

### Booking Controller (`controllers/bookingController.js`)

**Purpose**: Handle booking-related business logic and database operations.

#### Key Methods:

**Create Booking**
```javascript
exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // Send confirmation email (future feature)
    // await sendBookingConfirmation(booking);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
```

**Get User Bookings**
```javascript
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
```

**Update Booking Status** (Admin only)
```javascript
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Trigger status-based workflows
    if (status === 'confirmed') {
      // Create session from booking
      await createSessionFromBooking(booking);
    }
    
    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
```

## Middleware

### Authentication Middleware (`middleware/authMiddleware.js`)

**Purpose**: Protect routes and validate JWT tokens.

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Admin role check middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

module.exports = { protect, adminOnly };
```

**Features**:
- Bearer token extraction and validation
- User data attachment to request object
- Role-based access control
- Comprehensive error handling

## Routers

### Authentication Routes (`routers/authRoutes.js`)

**Purpose**: Handle user authentication and registration.

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// JWT token generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name: username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
```

### Booking Routes (`routers/bookingRoutes.js`)

**Purpose**: Define booking-related API endpoints.

```javascript
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  updateBookingStatus,
  getBookingStats
} = require('../controllers/bookingController');

// Public routes
router.post('/', createBooking);

// Protected routes
router.get('/user', protect, getUserBookings);
router.get('/stats', protect, adminOnly, getBookingStats);

// Admin routes
router.get('/all', protect, adminOnly, getBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.delete('/:id', protect, adminOnly, deleteBooking);

// Individual booking routes
router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking);

module.exports = router;
```

## Configuration

### Database Configuration (`config/db.js`)

**Purpose**: Establish MongoDB connection with error handling and retry logic.

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;
```

### Server Configuration (`server.js`)

**Purpose**: Main application setup and middleware configuration.

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-frontend-domain.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined')); // Detailed logging

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Photography Studio API',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routers/authRoutes'));
app.use('/api/profile', require('./routers/profileRoutes'));
app.use('/api/sessions', require('./routers/sessionRoutes'));
app.use('/api/photos', require('./routers/photoRoutes'));
app.use('/api/bookings', require('./routers/bookingRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Security Implementation

### Password Security
- **bcrypt Hashing**: 10 salt rounds for password protection
- **No Plain Text**: Passwords never stored in plain text
- **Password Validation**: Minimum length requirements

### JWT Security
- **Secure Secret**: Strong JWT secret from environment variables
- **Token Expiration**: 30-day expiration for user tokens
- **Bearer Token**: Standard Authorization header format

### Input Validation
- **Mongoose Validation**: Schema-level validation rules
- **Custom Validators**: Email format, phone number validation
- **Sanitization**: Trim whitespace, lowercase emails

### CORS Protection
- **Allowed Origins**: Specific frontend domains only
- **Credentials**: Secure cookie handling
- **Preflight**: Proper OPTIONS request handling

## Error Handling

### Consistent Error Format
```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message" | ["Array", "of", "errors"],
  "message": "Detailed description"
}
```

### Error Types
1. **Validation Errors**: Mongoose schema validation failures
2. **Authentication Errors**: JWT verification failures
3. **Authorization Errors**: Insufficient permissions
4. **Database Errors**: MongoDB connection/operation failures
5. **Server Errors**: Unexpected application errors

### Logging Strategy
- **Morgan Middleware**: HTTP request logging
- **Console Logging**: Error details in development
- **Error Tracking**: Structured error logging for production

## Performance Considerations

### Database Optimization
- **Indexing**: Proper indexes on frequently queried fields
- **Population**: Efficient population of referenced documents
- **Pagination**: Limit and skip for large datasets
- **Aggregation**: MongoDB aggregation pipeline for complex queries

### Caching Strategy
- **Future Implementation**: Redis for session management
- **Static Assets**: CDN for photo delivery
- **API Responses**: Cache frequently requested data

### Connection Pooling
- **Mongoose**: Built-in connection pooling
- **Connection Limits**: Configure max pool size for production

## Development Workflow

### Environment Setup
```bash
# Install dependencies
npm install

# Environment variables (.env)
MONGO_URI=mongodb://localhost:27017/photography-studio
JWT_SECRET=your-super-secure-secret-key
PORT=5000
NODE_ENV=development

# Start development server
npm run dev
```

### Testing Strategy
- **Manual Testing**: API endpoint testing with Postman
- **Unit Tests**: Jest for model and controller testing (future)
- **Integration Tests**: Full API workflow testing (future)

### Code Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting consistency
- **Error Handling**: Comprehensive try-catch blocks

## Deployment

### Production Configuration
```javascript
// Production environment variables
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/photography-studio
JWT_SECRET=super-secure-production-secret
NODE_ENV=production
PORT=5000
```

### Security Hardening
- **Environment Variables**: All secrets in environment variables
- **HTTPS**: SSL certificate configuration
- **Rate Limiting**: API rate limiting implementation
- **Helmet**: Security headers middleware

### Monitoring
- **Health Checks**: Application health monitoring
- **Log Aggregation**: Centralized logging system
- **Performance Monitoring**: Response time tracking
- **Error Tracking**: Real-time error reporting

## API Versioning

### Current Version: v1
- **Base Path**: `/api/`
- **Future Versioning**: `/api/v2/` for breaking changes

### Backward Compatibility
- **Deprecation Warnings**: Headers for deprecated endpoints
- **Migration Guides**: Documentation for version upgrades

## Future Enhancements

### Planned Features
- [ ] File upload handling for photos
- [ ] Email notification system
- [ ] Payment gateway integration
- [ ] Real-time notifications with WebSocket
- [ ] Advanced search and filtering
- [ ] Audit logging for admin actions
- [ ] API rate limiting
- [ ] Comprehensive test suite

### Scalability Improvements
- [ ] Redis session store
- [ ] Database sharding strategy
- [ ] Microservices architecture consideration
- [ ] Container deployment with Docker
- [ ] Load balancing configuration