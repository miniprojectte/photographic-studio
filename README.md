# Photography Studio Management System

A comprehensive full-stack web application for managing a photography studio, built with Next.js 15, React 19, and Express.js with MongoDB.

## 🏗️ Architecture Overview

This project uses a **hybrid architecture** with separate frontend and backend codebases:

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Port**: 3000

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Middleware**: CORS, Morgan logging
- **Port**: 5000

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/miniprojectte/photographic-studio.git
   cd photographic-studio
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd app/backend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in `/app/backend/`:
   ```env
   MONGO_URI=mongodb://localhost:27017/photography-studio
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   PORT=5000
   ```

5. **Start Development Servers**
   
   **Terminal 1 - Backend** (from `/app/backend/`):
   ```bash
   npm run dev
   ```
   
   **Terminal 2 - Frontend** (from project root):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
photographic-studio/
├── app/                          # Next.js App Router directory
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.js               # Root layout component
│   ├── page.js                 # Homepage (landing page)
│   │
│   ├── login/                  # Authentication pages
│   │   └── page.js            # Login form with JWT authentication
│   ├── register/               
│   │   └── page.js            # User registration form
│   │
│   ├── dashboard/              # Protected client area
│   │   ├── page.js            # Main dashboard with stats/overview
│   │   ├── profile/           # Profile management
│   │   ├── sessions/          # Session management
│   │   └── gallery/           # Photo gallery
│   │
│   ├── components/             # Reusable UI components
│   │   ├── BookingForm.js     # Booking creation form
│   │   └── ui/                # Shared UI components
│   │
│   ├── utils/                  # Utility functions
│   │   └── api.js             # Centralized API client
│   │
│   └── backend/                # Express.js API server
│       ├── server.js          # Main server file
│       ├── config/            # Configuration files
│       │   └── db.js         # MongoDB connection
│       ├── controllers/       # Business logic
│       ├── middleware/        # Custom middleware
│       ├── models/           # Mongoose schemas
│       └── routers/          # API route definitions
│
├── package.json              # Frontend dependencies
├── next.config.mjs          # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── jsconfig.json           # JavaScript configuration
```

## 🔐 Authentication System

### JWT-Based Authentication
- **Registration**: `/api/auth/register` - Creates new user account
- **Login**: `/api/auth/login` - Returns JWT token + user data
- **Token Storage**: localStorage on client-side
- **Protection**: Middleware validates Bearer tokens on protected routes

### User Roles & Access Control
- **Client**: Standard user with booking/session access
- **Admin**: Full system access for management

### Protected Routes
- All `/dashboard/*` pages require authentication
- API endpoints use `authMiddleware.js` for protection

## 🌐 API Architecture

### Centralized API Client (`/app/utils/api.js`)
```javascript
// Example usage
import { authAPI, bookingsAPI, sessionsAPI } from '../utils/api';

// Login
const user = await authAPI.login({ email, password });

// Create booking
const booking = await bookingsAPI.createBooking(bookingData);
```

## 📊 Key Features

### For Clients
- ✅ User registration and authentication
- ✅ Session booking with type selection
- ✅ Dashboard with session overview
- ✅ Profile management
- ✅ Photo gallery access

### For Studio (Admin)
- 🚧 User management dashboard
- 🚧 Booking administration
- 🚧 Session scheduling and management

## 🛠️ Development Workflow

### Running the Application
```bash
# Start backend (Terminal 1)
cd app/backend && npm run dev

# Start frontend (Terminal 2) 
npm run dev
```

## 📄 Documentation

For detailed documentation, see:
- [API Documentation](./docs/API.md)
- [Frontend Components](./docs/FRONTEND.md)
- [Backend Architecture](./docs/BACKEND.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 👥 Authors

- **Shridhar Kokitkar** - Backend Development
- **Project Team** - Frontend Development

---

**Built with ❤️ for photographers and their clients**
