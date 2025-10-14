# Development Guide

This guide provides comprehensive instructions for setting up, developing, and deploying the Photography Studio Management System.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **MongoDB**: Version 5.0 or higher (local or cloud)
- **Git**: For version control

### Recommended Tools
- **VS Code**: Code editor with extensions
- **MongoDB Compass**: GUI for MongoDB
- **Postman**: API testing tool
- **Chrome DevTools**: Frontend debugging

## Initial Setup

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/miniprojectte/photographic-studio.git
cd photographic-studio

# Check Node.js version
node --version  # Should be 18.0.0+
npm --version   # Should be 8.0.0+
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Dependencies:**
- next: 15.4.6
- react: 19.1.0
- framer-motion: 12.23.12
- tailwindcss: Latest
- lucide-react: Latest

### 3. Backend Setup
```bash
# Navigate to backend directory
cd app/backend

# Install backend dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Dependencies:**
- express: 5.1.0
- mongoose: 8.17.1
- bcrypt: 6.0.0
- jsonwebtoken: 9.0.2
- cors: 2.8.5

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Server
# macOS (with Homebrew)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh --eval "db.version()"
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Get connection string
4. Update environment variables

### 5. Environment Configuration

Create environment file for backend:
```bash
# In app/backend/ directory
touch .env

# Add the following content to .env
cat > .env << EOF
# Database Configuration
MONGO_URI=mongodb://localhost:27017/photography-studio
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/photography-studio

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (optional, for future features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF
```

**Security Note:** Generate a strong JWT secret:
```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Development Workflow

### Daily Development Routine

#### 1. Start Development Servers
```bash
# Terminal 1: Start Backend Server
cd app/backend
npm run dev

# Terminal 2: Start Frontend Server (from project root)
cd ../..
npm run dev
```

#### 2. Verify Services Running
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: mongodb://localhost:27017

### 3. Development Commands

#### Frontend Commands
```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Lint and fix
npm run lint -- --fix
```

#### Backend Commands
```bash
# Development server with nodemon
npm run dev

# Production server
npm start

# Database seeding (if seed script exists)
npm run seed
```

## Code Structure Guidelines

### Frontend Code Organization

#### Component Structure
```javascript
// Component file template
'use client';  // If using client-side features
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

export default function ComponentName() {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component-classes"
    >
      {/* Component JSX */}
    </motion.div>
  );
}
```

#### API Integration Pattern
```javascript
// Use centralized API utility
import { authAPI, bookingsAPI } from '../utils/api';

// In component
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await bookingsAPI.getUserBookings();
      setData(result.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Backend Code Organization

#### Controller Pattern
```javascript
// Controller method template
exports.methodName = async (req, res) => {
  try {
    // Business logic
    const result = await Model.operation(req.body);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Operation successful'
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    // Handle other errors
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
```

#### Router Pattern
```javascript
// Router file template
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  controllerMethod1,
  controllerMethod2
} = require('../controllers/controllerName');

// Public routes
router.post('/public-endpoint', controllerMethod1);

// Protected routes
router.get('/protected-endpoint', protect, controllerMethod2);

// Admin-only routes
router.delete('/admin-endpoint/:id', protect, adminOnly, controllerMethod3);

module.exports = router;
```

## Testing Guidelines

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with valid data
- [ ] User registration with invalid data (validation)
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] Token persistence across browser refresh
- [ ] Logout functionality
- [ ] Protected route access without token

#### Booking System
- [ ] Create booking with valid data
- [ ] Create booking with invalid data
- [ ] View user bookings
- [ ] Admin booking management
- [ ] Booking status updates

#### API Testing with Postman

##### Environment Setup
Create Postman environment with variables:
```
base_url: http://localhost:5000/api
token: {{auth_token}}
```

##### Test Sequence
1. **Register User**
   ```
   POST {{base_url}}/auth/register
   Body: {
     "username": "Test User",
     "email": "test@example.com", 
     "password": "password123"
   }
   ```

2. **Login User**
   ```
   POST {{base_url}}/auth/login
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   
   # Save token from response to environment
   ```

3. **Create Booking**
   ```
   POST {{base_url}}/bookings
   Headers: Authorization: Bearer {{token}}
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "+1234567890",
     "sessionType": "portrait",
     "date": "2025-12-01T14:00:00Z",
     "message": "Looking forward to the session!"
   }
   ```

### Automated Testing Setup (Future)

#### Frontend Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Create test file
// components/Button.test.js
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});
```

#### Backend Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create test file
// tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/register', () => {
  test('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

## Debugging Guide

### Frontend Debugging

#### React DevTools
1. Install React Developer Tools browser extension
2. Open browser DevTools
3. Use "Components" and "Profiler" tabs

#### Console Debugging
```javascript
// Add debug logs
console.log('State:', state);
console.error('Error occurred:', error);

// Network debugging in DevTools
// Check Network tab for API calls
// Verify request/response data
```

#### Common Frontend Issues
- **White screen**: Check console for JavaScript errors
- **API calls failing**: Verify backend is running, check CORS
- **Authentication issues**: Check localStorage tokens
- **Styling issues**: Verify Tailwind classes, check CSS conflicts

### Backend Debugging

#### Console Logging
```javascript
// Add debug logs in controllers
console.log('Request body:', req.body);
console.log('User from token:', req.user);
console.error('Database error:', error);
```

#### Database Debugging
```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use photography-studio

# Check collections
show collections

# Query data
db.users.find().pretty()
db.bookings.find().pretty()
```

#### Common Backend Issues
- **Database connection failed**: Check MongoDB running, connection string
- **JWT errors**: Verify JWT_SECRET in environment
- **CORS errors**: Check CORS configuration in server.js
- **Validation errors**: Check Mongoose schema validation

## Performance Optimization

### Frontend Performance

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build

# Check build output for bundle sizes
# Large bundles indicate optimization needed
```

#### Image Optimization
```javascript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-fold images
/>
```

#### Code Splitting
```javascript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Backend Performance

#### Database Optimization
```javascript
// Add indexes for frequently queried fields
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // Creates index automatically
    index: true    // Explicit index
  }
});

// Compound indexes
userSchema.index({ email: 1, createdAt: -1 });
```

#### Query Optimization
```javascript
// Use projection to limit returned fields
const users = await User.find({}, 'name email').limit(10);

// Use population carefully
const bookings = await Booking.find()
  .populate('client', 'name email')
  .limit(50);
```

## Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] Build processes working
- [ ] Security review complete

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Configure environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Backend Deployment (Railway/Heroku)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd app/backend
railway login
railway init
railway up

# Set environment variables
railway variables:set MONGO_URI=your-production-mongo-uri
railway variables:set JWT_SECRET=your-production-jwt-secret
```

### Database Deployment (MongoDB Atlas)
1. Create production cluster
2. Configure network access (IP whitelist)
3. Create database user
4. Update connection string in production environment

## Security Checklist

### Development Security
- [ ] Environment variables not committed to git
- [ ] Strong JWT secret (64+ characters)
- [ ] Input validation on all endpoints
- [ ] Password hashing with bcrypt
- [ ] CORS configured properly

### Production Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] Database authentication enabled
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Regular dependency updates

## Troubleshooting

### Common Issues and Solutions

#### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if stopped
brew services start mongodb-community

# Check connection string in .env
```

#### "CORS error in browser"
```javascript
// Check CORS configuration in server.js
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));
```

#### "JWT token invalid"
```bash
# Check JWT_SECRET is set
echo $JWT_SECRET

# Verify token format in Authorization header
# Should be: "Bearer your.jwt.token.here"
```

#### "Module not found"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

#### Documentation Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [MongoDB Manual](https://docs.mongodb.com/manual)

#### Community Support
- Stack Overflow for specific technical questions
- GitHub Issues for project-specific problems
- Discord/Slack communities for real-time help

#### Code Review Process
1. Create feature branch from main
2. Make changes and commit with clear messages
3. Push branch and create pull request
4. Request review from team members
5. Address feedback and merge when approved

## Maintenance

### Regular Maintenance Tasks
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Database performance monitoring
- [ ] Log file cleanup
- [ ] Security audit review

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Monitoring and Logging
```javascript
// Production logging setup (future)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

This development guide provides a comprehensive foundation for working with the Photography Studio Management System. Follow these guidelines to maintain code quality, ensure security, and streamline the development process.