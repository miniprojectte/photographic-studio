# Database Seeding Instructions

## Admin User Credentials
- **Email:** admin@admin.com
- **Password:** admin123
- **Role:** admin

## How to Seed the Database

1. **Navigate to the backend directory:**
   ```bash
   cd app/backend
   ```

2. **Run the seeder script:**
   ```bash
   npm run seed
   ```

   Or directly:
   ```bash
   node seed.js
   ```

## What the Seeder Does

1. Connects to your MongoDB database
2. Checks if an admin user already exists
3. If not found, creates a new admin user with:
   - Name: "Administrator"
   - Email: "admin@admin.com"
   - Password: "admin123" (hashed with bcrypt)
   - Role: "admin"

## Updated Backend Features

### User Model (`models/userModel.js`)
- ✅ Added `role` field with enum ['user', 'admin']
- ✅ Default role is 'user'

### Auth Routes (`routers/authRoutes.js`)
- ✅ Registration now accepts `userType` from frontend
- ✅ Login response includes user `role`
- ✅ Registration response includes user `role`

### Database Seeder (`seed.js`)
- ✅ Safe seeding (checks for existing admin)
- ✅ Proper password hashing
- ✅ Clear console output

## Frontend Integration Ready

The frontend login and register forms now send `userType` which maps to the `role` field in the database.

## Testing the Admin User

1. Run the seeder: `npm run seed`
2. Start the backend: `npm run dev`
3. Use the login form with:
   - Email: admin@admin.com
   - Password: admin123

The admin user will be created in the database with proper security (hashed password) and can be used immediately for testing admin functionality. The login form will automatically detect the user's role from the database.