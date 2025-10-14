# API Documentation

This document provides comprehensive documentation for the Photography Studio Management System API.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

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
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```javascript
{
  "username": "string",    // User's display name
  "email": "string",       // Valid email address (unique)
  "password": "string"     // Minimum 6 characters
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "ObjectId",
    "name": "string",
    "email": "string"
  }
}
```

**Error Codes:**
- `400` - User already exists
- `500` - Server error during registration

---

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request Body:**
```javascript
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "ObjectId",
    "name": "string",
    "email": "string"
  },
  "token": "JWT_TOKEN_STRING"
}
```

**Error Codes:**
- `400` - Invalid credentials
- `401` - User not found or incorrect password
- `500` - Server error

---

### GET /api/auth/users

Get all users (Admin access required).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "users": [
    {
      "id": "ObjectId",
      "name": "string",
      "email": "string",
      "createdAt": "ISO_DATE",
      "updatedAt": "ISO_DATE"
    }
  ]
}
```

## Profile Endpoints

### GET /api/profile/me

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "user": {
    "id": "ObjectId",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "createdAt": "ISO_DATE"
  }
}
```

---

### PUT /api/profile/update

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```javascript
{
  "name": "string",     // Optional
  "email": "string",    // Optional
  "phone": "string",    // Optional
  "address": "string"   // Optional
}
```

**Response:**
```javascript
{
  "success": true,
  "user": {
    "id": "ObjectId",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  }
}
```

## Booking Endpoints

### POST /api/bookings

Create a new booking (public endpoint).

**Request Body:**
```javascript
{
  "name": "string",                    // Client name
  "email": "string",                   // Client email
  "phone": "string",                   // Client phone
  "sessionType": "string",             // Enum: 'portrait', 'wedding', 'family', 'event', 'commercial'
  "date": "ISO_DATE",                  // Future date only
  "message": "string"                  // Optional message
}
```

**Response:**
```javascript
{
  "success": true,
  "booking": {
    "id": "ObjectId",
    "name": "string",
    "email": "string",
    "phone": "string",
    "sessionType": "string",
    "date": "ISO_DATE",
    "status": "pending",
    "message": "string",
    "createdAt": "ISO_DATE"
  }
}
```

**Validation Rules:**
- `sessionType` must be one of: 'portrait', 'wedding', 'family', 'event', 'commercial'
- `date` must be in the future
- `email` must be valid email format

---

### GET /api/bookings/user

Get bookings for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "bookings": [
    {
      "id": "ObjectId",
      "sessionType": "string",
      "date": "ISO_DATE",
      "status": "string",
      "message": "string",
      "createdAt": "ISO_DATE"
    }
  ]
}
```

---

### GET /api/bookings/stats

Get booking statistics (Admin access).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "stats": {
    "totalBookings": 0,
    "pendingBookings": 0,
    "confirmedBookings": 0,
    "completedBookings": 0,
    "monthlyBookings": 0
  }
}
```

---

### PUT /api/bookings/:id/status

Update booking status (Admin access).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```javascript
{
  "status": "string"  // Enum: 'pending', 'confirmed', 'completed', 'cancelled'
}
```

**Response:**
```javascript
{
  "success": true,
  "booking": {
    "id": "ObjectId",
    "status": "string",
    "updatedAt": "ISO_DATE"
  }
}
```

## Session Endpoints

### GET /api/sessions/user

Get sessions for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "sessions": [
    {
      "id": "ObjectId",
      "sessionType": "string",
      "date": "ISO_DATE",
      "location": "string",
      "status": "string",
      "notes": "string",
      "createdAt": "ISO_DATE"
    }
  ]
}
```

---

### GET /api/sessions/admin/stats

Get session statistics (Admin access).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "stats": {
    "totalSessions": 0,
    "scheduledSessions": 0,
    "completedSessions": 0,
    "cancelledSessions": 0,
    "todaySessions": 0
  }
}
```

---

### GET /api/sessions/admin/all

Get all sessions with pagination (Admin access).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` - Number of results per page (default: 10)
- `page` - Page number (default: 1)
- `status` - Filter by status

**Response:**
```javascript
{
  "success": true,
  "sessions": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalSessions": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Photo Endpoints

### GET /api/photos

Get photos for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "photos": [
    {
      "id": "ObjectId",
      "session": {
        "sessionType": "string",
        "date": "ISO_DATE"
      },
      "url": "string",
      "isFavorite": false,
      "comments": [
        {
          "user": "ObjectId",
          "text": "string",
          "createdAt": "ISO_DATE"
        }
      ],
      "createdAt": "ISO_DATE"
    }
  ]
}
```

---

### POST /api/photos/:id/favorite

Toggle favorite status for a photo.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  "success": true,
  "photo": {
    "id": "ObjectId",
    "isFavorite": true
  }
}
```

---

### POST /api/photos/:id/comments

Add a comment to a photo.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```javascript
{
  "text": "string"  // Comment text
}
```

**Response:**
```javascript
{
  "success": true,
  "comment": {
    "user": "ObjectId",
    "text": "string",
    "createdAt": "ISO_DATE"
  }
}
```

## Error Handling

### Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Internal Server Error

### Error Response Examples

**Validation Error:**
```javascript
{
  "success": false,
  "error": ["Email is required", "Password must be at least 6 characters"]
}
```

**Authentication Error:**
```javascript
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**Not Found Error:**
```javascript
{
  "success": false,
  "message": "Resource not found"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:

- Authentication endpoints: 5 requests per minute per IP
- General API: 100 requests per minute per user
- File upload: 10 requests per minute per user

## CORS Configuration

The API accepts requests from:
- `http://localhost:3000` (Frontend development server)
- `http://localhost:3001` (Alternative frontend port)

Credentials are included in CORS for authentication.

## Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  phone: String (optional),
  address: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Schema
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  sessionType: Enum (required),
  date: Date (required, future),
  status: Enum (default: 'pending'),
  message: String (optional),
  client: ObjectId (User, optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Session Schema
```javascript
{
  client: ObjectId (User, required),
  sessionType: Enum (required),
  date: Date (required),
  location: String (optional),
  status: Enum (default: 'scheduled'),
  notes: String (optional),
  booking: ObjectId (Booking, optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Photo Schema
```javascript
{
  session: ObjectId (Session, required),
  client: ObjectId (User, required),
  url: String (required),
  isFavorite: Boolean (default: false),
  comments: [{
    user: ObjectId (User),
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

## Testing

Use tools like Postman or curl to test endpoints:

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get profile (with token)
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Considerations

1. **Environment Variables**: Set secure JWT_SECRET and MONGO_URI
2. **HTTPS**: Use SSL certificates in production
3. **Rate Limiting**: Implement request rate limiting
4. **Validation**: Add comprehensive input validation
5. **Logging**: Implement structured logging
6. **Monitoring**: Add health checks and monitoring
7. **Backup**: Regular database backups
8. **Security**: Implement additional security headers