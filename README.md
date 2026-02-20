# CPT Healthcare Bidding Platform

A comprehensive, enterprise-level full-stack MERN application for a healthcare CPT code bidding platform with modular, scalable architecture.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Context API, Axios, TailwindCSS 3, Framer Motion |
| Backend | Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs |
| Architecture | Service Layer, Middleware-based validation, Centralized error handling, Role-based authorization |

---

## Features

### 1. Landing Page & Search
- Hero section with glassmorphism design and smooth Framer Motion animations
- CPT code + ZIP code search module
- Search state persisted in `sessionStorage`
- Redirects to registration if user is unauthenticated

### 2. User Registration
- Conditional form based on user type (Patient / Broker / Employer)
- Broker/Employer: requires `numberOfEmployees` and `planType`
- Client and server-side validation (email, password, phone, ZIP)

### 3. Authentication & Authorization
- JWT-based authentication (24h access token, 7-day refresh token)
- Tokens stored in `localStorage`
- Auto-login state restoration on app load
- `ProtectedRoute` component for guarding routes
- Admin middleware for admin-only routes

### 4. CPT Search & Results
- Search by CPT code, description, or ZIP code
- Dynamic CPT result cards with auto-rendering of all data fields
- Reserve amount highlighted in purple
- "Place Bid" CTA on each card

### 5. Bidding System
- Bid modal with reserve amount display
- Frontend & backend validation: bid > reserve amount
- Default status: `pending`
- Success notification after bid placement

### 6. User Dashboard
- Profile summary with user type badge
- Bid history table (CPT code, bid amount, reserve, status, date)
- Color-coded status badges (pending/approved/denied)

### 7. Admin Dashboard
- View and filter all users (by type)
- View all bids (filter by status)
- Approve/Deny bids with optional comments
- View bids for individual users

---

## Project Structure

```
cpt-healthcare-bidding-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # database.js, environment.js
│   │   ├── controllers/     # authController, searchController, bidController, userController, adminController
│   │   ├── middleware/      # authMiddleware, adminMiddleware, errorMiddleware, validationMiddleware
│   │   ├── models/          # User.js, CPTData.js, Bid.js
│   │   ├── routes/          # authRoutes, searchRoutes, bidRoutes, userRoutes, adminRoutes
│   │   ├── seed/            # seedCPTData.js
│   │   ├── services/        # authService, searchService, bidService, userService, adminService
│   │   ├── utils/           # errorHandler, successResponse, passwordUtils, jwtUtils
│   │   ├── validators/      # authValidator, bidValidator, searchValidator
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/             # axiosConfig, authAPI, searchAPI, bidAPI, userAPI, adminAPI
    │   ├── animations/      # framerMotion.js
    │   ├── components/      # Navbar, HeroSection, SearchModule, RegistrationForm, LoginForm, CPTCard, BidModal, ProtectedRoute, Footer, Loading, ErrorBoundary
    │   ├── context/         # AuthContext, SearchContext
    │   ├── hooks/           # useAuth, useSearch, useFetch
    │   ├── pages/           # Home, Register, Login, Results, UserDashboard, AdminDashboard, NotFound
    │   ├── utils/           # validators, formatters, constants, localStorage
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── tailwind.config.js
    └── package.json
```

---

## Installation & Setup

### Prerequisites
- Node.js >= 18
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Sania-Ijaz/cpt-healthcare-bidding-platform.git
cd cpt-healthcare-bidding-platform
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Edit .env if your backend runs on a different port
npm install
```

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cpt-healthcare
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Running Locally

### Start MongoDB
```bash
mongod
```

### Seed the Database
```bash
cd backend
npm run seed
```

### Start Backend
```bash
cd backend
npm run dev   # Development with nodemon
# or
npm start     # Production
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000` (or the Vite default port).

---

## API Documentation

### Auth Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout (auth required) |
| POST | `/api/auth/refresh-token` | Refresh JWT token |

### Search Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/search?cpt=XXX&zip=YYY` | Search CPT codes |

### Bid Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/bid` | Place a new bid |
| GET | `/api/bid/user` | Get user's bids |
| GET | `/api/bid/:id` | Get specific bid |
| PATCH | `/api/bid/:id` | Update pending bid |

### User Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/profile` | Get profile |
| PATCH | `/api/user/profile` | Update profile |
| GET | `/api/user/dashboard` | Get dashboard data |

### Admin Endpoints (Admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/users` | List all users (pagination, filter by type) |
| GET | `/api/admin/user/:id` | Get specific user |
| GET | `/api/admin/user/:id/bids` | Get bids for user |
| GET | `/api/admin/bids` | List all bids (pagination, filter by status) |
| PATCH | `/api/admin/bid/:id` | Approve/deny bid |

---

## Database Schemas

### User Schema
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  phone: String (required, 10 digits),
  zipCode: String (required, 5 digits),
  type: 'patient' | 'broker' | 'employer',
  numberOfEmployees: Number (broker/employer only),
  planType: 'PPO' | 'HMO' | 'EPO' | 'HDHP' | 'Custom' (broker/employer only),
  role: 'user' | 'admin' (default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### CPTData Schema
```javascript
{
  specialty: String (required),
  cptCode: String (required, unique, indexed),
  description: String (required, indexed),
  county: String (required),
  state: String (required),
  zipCode: String (required, indexed),
  avgCharge: Number (required),
  minCharge: Number (required),
  maxCharge: Number (required),
  reserveAmount: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Bid Schema
```javascript
{
  userId: ObjectId (ref: User, required),
  cptDataId: ObjectId (ref: CPTData, required),
  bidAmount: Number (required),
  status: 'pending' | 'approved' | 'denied' (default: 'pending'),
  adminComments: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT with 24h expiry + 7-day refresh token
- Input validation on frontend and backend
- Helmet.js for HTTP security headers
- CORS configured for frontend origin
- Rate limiting (100 req/15 min per IP)
- Admin-only routes protected with role middleware
- No sensitive data in JWT payload (userId only)
- Centralized error handling (no stack traces in production)

---

## Scalability

The service-layer architecture supports future enhancements:
- **Real-time Bidding**: Socket.io integration in bidService
- **Notifications**: Notification service layer hook
- **Redis Caching**: Service layer supports cache abstraction
- **Payment Gateway**: Service abstraction ready
- **Microservices**: Services can be extracted independently
- **Pagination**: Already implemented in all list endpoints

---

## Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables on the platform
2. Set `NODE_ENV=production`
3. Deploy from the `backend/` directory

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
