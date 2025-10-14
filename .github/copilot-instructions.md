# Photography Studio Copilot Instructions

## Architecture Overview

This is a **hybrid Next.js + Express.js** application with two separate codebases:
- **Frontend**: Next.js 15 with App Router in `/app/` (React 19, TailwindCSS 4, Framer Motion)
- **Backend**: Express.js API in `/app/backend/` (Node.js, MongoDB via Mongoose, JWT auth)

## Critical Development Workflows

### Running the Application
```bash
# Frontend (port 3000)
npm run dev

# Backend (port 5000) 
cd app/backend && npm run dev
```

Both servers must run simultaneously. Frontend uses `--turbopack` for faster builds.

### Project Structure Patterns

**Backend follows MVC pattern**:
- `/models/` - Mongoose schemas with validation (userModel, bookingModel, etc.)
- `/controllers/` - Business logic with consistent error handling format
- `/routers/` - Route definitions mounted at `/api/*` endpoints  
- `/middleware/authMiddleware.js` - JWT Bearer token protection

**Frontend uses App Router**:
- `/app/page.js` - Root landing page
- `/app/dashboard/` - Protected area requiring localStorage token
- Client components use `'use client'` directive for state/effects

## Authentication Flow

1. **Login/Register**: POST to `/api/auth/login|register` returns JWT + user object
2. **Storage**: Frontend stores both `token` and `user` in localStorage
3. **Protection**: Dashboard pages check localStorage, redirect to `/login` if missing
4. **API Calls**: Use `Authorization: Bearer <token>` header for protected endpoints

## Data Models & Validation

**Booking Model** (`/models/bookingModel.js`):
- Uses Mongoose validation with custom error messages
- Enum validation for `sessionType`: `['portrait', 'wedding', 'family', 'event', 'commercial']`
- Date validation ensures future bookings only

**Error Response Format**:
```javascript
{
  success: false,
  error: "Error message" | ["Array", "of", "messages"]
}
```

## Key Conventions

- **Controllers**: Always wrap in try/catch, return `{success: boolean, data/error}` format
- **Routes**: Use controller methods, not inline handlers
- **Frontend State**: Framer Motion for animations, Lucide React for icons
- **Environment**: Backend requires `MONGO_URI`, `JWT_SECRET` in `.env`

## Integration Points

- **CORS**: Backend enables all origins for development
- **Database**: MongoDB connection via `config/db.js` with auto-retry on failure  
- **Authentication**: JWT tokens expire in 30 days, stored client-side
- **API Communication**: Frontend assumes backend on port 5000 (configure for production)

## Common Patterns

- Dashboard components check auth state in `useEffect` hook
- Controllers use Mongoose validation, return formatted error arrays
- Routes grouped by feature (`authRoutes`, `bookingRoutes`, etc.) under `/api` prefix