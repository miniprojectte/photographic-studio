# Frontend Documentation

This document provides comprehensive documentation for the Photography Studio frontend built with Next.js 15, React 19, and modern web technologies.

## Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router
- **React 19**: Component library with modern hooks
- **JavaScript**: ES6+ with JSConfig for module resolution

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Modern icon library
- **Custom UI Components**: Reusable component library

### Development Tools
- **Turbopack**: Fast bundler for development
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing

## Project Structure

```
app/
├── globals.css                    # Global styles and Tailwind imports
├── layout.js                     # Root layout with metadata
├── page.js                       # Landing page component
│
├── (auth)/                       # Authentication routes
│   ├── login/page.js             # Login form component
│   └── register/page.js          # Registration form component
│
├── dashboard/                    # Protected client dashboard
│   ├── page.js                   # Main dashboard overview
│   ├── profile/page.js           # User profile management
│   ├── sessions/page.js          # Session management
│   └── gallery/page.js           # Photo gallery
│
├── admin/                        # Admin dashboard (future)
│   ├── users/page.js             # User management
│   ├── bookings/page.js          # Booking administration
│   └── sessions/page.js          # Session administration
│
├── components/                   # Reusable components
│   ├── BookingForm.js            # Booking creation form
│   └── ui/                       # Shared UI components
│       ├── button.js             # Button component
│       └── input.js              # Input component
│
└── utils/                        # Utility functions
    └── api.js                    # Centralized API client
```

## Routing System

### App Router (Next.js 15)
The application uses Next.js App Router with file-based routing:

#### Public Routes
- `/` - Landing page with hero section and booking CTA
- `/login` - User authentication form
- `/register` - User registration form

#### Protected Routes
- `/dashboard` - Main user dashboard (requires authentication)
- `/dashboard/profile` - User profile management
- `/dashboard/sessions` - User session management
- `/dashboard/gallery` - Photo gallery access

#### Admin Routes (Future)
- `/admin/*` - Admin dashboard pages (requires admin role)

### Route Protection
```javascript
// Authentication check in dashboard pages
useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    router.push('/login');
    return;
  }
  
  setUser(JSON.parse(userData));
}, [router]);
```

## Component Architecture

### Layout System

#### Root Layout (`app/layout.js`)
```javascript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

Features:
- Global HTML structure
- Font loading (Inter)
- Metadata configuration
- Global CSS imports

### Page Components

#### Landing Page (`app/page.js`)

**Features:**
- Hero section with professional portrait background
- Dark navy theme (#1B263B)
- Framer Motion animations
- Responsive grid layout
- Call-to-action sections

**Key Sections:**
```javascript
// Hero Section
<section className="relative h-screen bg-[#1B263B]">
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {/* Content */}
  </motion.div>
</section>
```

#### Authentication Pages

**Login Component (`app/login/page.js`)**

Features:
- Form validation with state management
- JWT authentication with API integration
- Role-based routing after login
- Error handling and loading states

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const data = await authAPI.login(formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    router.push('/dashboard');
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Register Component (`app/register/page.js`)**

Features:
- Multi-field registration form
- Password confirmation validation
- Success messaging and redirect
- Consistent styling with login

#### Dashboard Components

**Main Dashboard (`app/dashboard/page.js`)**

Features:
- User statistics overview
- Quick action buttons
- Upcoming sessions display
- Recent activity feed
- Communication center

```javascript
// Stats calculation from API data
const totalSessions = sessions.length + bookings.length;
const upcomingSessions = sessions.filter(s => 
  s.status === 'scheduled' && new Date(s.sessionDate) > new Date()
).length;
```

**Profile Management (`app/dashboard/profile/page.js`)**

Features:
- Editable user profile form
- Real-time validation
- Success/error messaging
- Profile data persistence

### Reusable Components

#### BookingForm Component (`app/components/BookingForm.js`)

**Purpose:** Public booking form for session requests

**Features:**
- Multi-step form validation
- Session type selection
- Date picker integration
- Client information collection
- API integration for booking submission

**Session Types:**
```javascript
const sessionTypes = [
  { value: 'portrait', label: 'Portrait Session' },
  { value: 'wedding', label: 'Wedding Photography' },
  { value: 'family', label: 'Family Photos' },
  { value: 'event', label: 'Event Photography' },
  { value: 'commercial', label: 'Commercial Shoot' }
];
```

**Validation Rules:**
```javascript
// Form validation logic
const validateForm = () => {
  const errors = {};
  
  if (!formData.name.trim()) errors.name = 'Name is required';
  if (!formData.email.trim()) errors.email = 'Email is required';
  if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';
  if (!formData.sessionType) errors.sessionType = 'Please select a session type';
  if (!formData.date) errors.date = 'Please select a date';
  
  return errors;
};
```

## State Management

### Authentication State
- **Token Storage:** localStorage for JWT persistence
- **User Data:** localStorage for user information
- **State Sync:** useEffect hooks for authentication checks

### Form State
- **Controlled Components:** useState for form inputs
- **Validation:** Real-time validation with error states
- **Loading States:** UI feedback during API calls

### API State
```javascript
// Centralized API state management
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

## Styling System

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B263B',    // Dark navy
        secondary: '#415A77',  // Medium blue
        accent: '#778DA9',     // Light blue
      }
    },
  },
  plugins: [],
}
```

### Design System

#### Color Palette
- **Primary:** #1B263B (Dark Navy) - Headers, navigation, primary buttons
- **Secondary:** #415A77 (Medium Blue) - Secondary elements, hover states
- **Accent:** #778DA9 (Light Blue) - Highlights, links, active states
- **Neutral:** Gray scale for text and backgrounds

#### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** Font weights 600-700
- **Body Text:** Font weight 400
- **Small Text:** Font weight 300

#### Spacing System
- **Padding:** Consistent spacing using Tailwind's spacing scale
- **Margins:** Vertical rhythm with mb-4, mb-6, mb-8
- **Grid Systems:** CSS Grid and Flexbox for layouts

## Animation System

### Framer Motion Integration

#### Page Transitions
```javascript
// Consistent page animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Page content */}
</motion.div>
```

#### Interactive Elements
```javascript
// Button hover animations
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

#### Card Animations
```javascript
// Card hover effects
<motion.div
  whileHover={{ scale: 1.02, y: -5 }}
  transition={{ duration: 0.2 }}
  className="bg-white p-6 rounded-lg shadow-md"
>
  {/* Card content */}
</motion.div>
```

## API Integration

### Centralized API Client (`app/utils/api.js`)

#### Base Configuration
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  
  // Auto-include JWT token
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  return await response.json();
};
```

#### API Modules
```javascript
// Authentication API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (data) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getUserBookings: () => apiRequest('/bookings/user'),
};
```

## Performance Optimization

### Next.js Features
- **Automatic Code Splitting:** Pages are automatically split
- **Image Optimization:** Next.js Image component for optimized loading
- **Font Optimization:** Automatic Google Fonts optimization

### Loading States
```javascript
// Loading component pattern
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

### Error Boundaries
```javascript
// Error handling pattern
const [error, setError] = useState(null);

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Reload Page
        </button>
      </div>
    </div>
  );
}
```

## Responsive Design

### Breakpoint System
- **Mobile First:** Base styles for mobile devices
- **Tablet:** `md:` prefix for tablet and up
- **Desktop:** `lg:` and `xl:` for larger screens

### Grid Layouts
```javascript
// Responsive grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Navigation
```javascript
// Responsive navigation
<nav className="hidden md:flex space-x-8">
  {/* Desktop navigation */}
</nav>
<button className="md:hidden">
  {/* Mobile menu button */}
</button>
```

## Form Handling

### Controlled Components
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

### Validation
```javascript
const [errors, setErrors] = useState({});

const validateField = (name, value) => {
  switch (name) {
    case 'email':
      return /\S+@\S+\.\S+/.test(value) ? '' : 'Invalid email format';
    case 'name':
      return value.trim().length > 0 ? '' : 'Name is required';
    default:
      return '';
  }
};
```

## Security Considerations

### Client-Side Security
- **Token Storage:** localStorage (consider httpOnly cookies for production)
- **Route Protection:** Authentication checks on protected pages
- **Input Validation:** Client-side validation (server-side validation required)

### XSS Prevention
- **React's Built-in Protection:** JSX automatically escapes values
- **Sanitization:** For any innerHTML usage (avoided in this project)

## Testing Strategy

### Manual Testing Checklist
- [ ] Authentication flow (login/register/logout)
- [ ] Dashboard navigation and data loading
- [ ] Form validation and submission
- [ ] Responsive design across devices
- [ ] Animation performance
- [ ] Error handling scenarios

### Future Testing Implementation
- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** API integration testing
- **E2E Tests:** Playwright or Cypress

## Deployment

### Build Process
```bash
# Production build
npm run build

# Start production server
npm start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Performance Checklist
- [ ] Image optimization enabled
- [ ] Font loading optimization
- [ ] Code splitting working
- [ ] Bundle size analysis
- [ ] Lighthouse score > 90

## Browser Support

### Target Browsers
- **Chrome:** Latest 2 versions
- **Firefox:** Latest 2 versions  
- **Safari:** Latest 2 versions
- **Edge:** Latest 2 versions

### Polyfills
- **Automatic:** Next.js includes necessary polyfills
- **Custom:** Add polyfills for specific features if needed

## Accessibility

### WCAG Guidelines
- **Semantic HTML:** Proper heading hierarchy
- **Alt Text:** Images include descriptive alt text
- **Keyboard Navigation:** All interactive elements accessible
- **Color Contrast:** WCAG AA compliant color combinations

### Screen Reader Support
```javascript
// Accessible form labels
<label htmlFor="email" className="sr-only">Email Address</label>
<input 
  id="email"
  name="email"
  type="email"
  aria-describedby="email-error"
  // ...
/>
```

## Future Enhancements

### Planned Features
- [ ] Progressive Web App (PWA) support
- [ ] Dark/light theme toggle
- [ ] Real-time notifications
- [ ] Advanced photo gallery with zoom
- [ ] Drag-and-drop file uploads
- [ ] Calendar integration
- [ ] Mobile app version

### Performance Improvements
- [ ] Implement React Query for data fetching
- [ ] Add service worker for offline support
- [ ] Optimize images with WebP format
- [ ] Implement lazy loading for images
- [ ] Add skeleton loading states