# 🔐 Auth API — JWT + Redis + MongoDB

A production-ready REST API implementing secure authentication using **JWT (Access + Refresh Tokens)**, **Redis-based token blacklisting**, and **Sliding Window Rate Limiting**.

---

## 🚀 Features

- **JWT Authentication** — Access Token + Refresh Token flow
- **Token Blacklisting** — Logout invalidates token via Redis
- **Auto Token Refresh** — Expired access token automatically refreshed using refresh token
- **Sliding Window Rate Limiting** — Redis-based, prevents brute force attacks
- **Password Hashing** — bcrypt with salt
- **Cookie-based Auth** — httpOnly cookies for security
- **MongoDB** — User data persistence with Mongoose

---

## 🏗️ Project Architecture

```
project/
├── config/
│   └── redis.js          # Redis client setup
├── Controllers/
│   └── user.controllers.js  # signup, login, profile, logout
├── middleware/
│   ├── authMiddleware.js    # JWT verify + blacklist check
│   └── rateLimiter.js       # Sliding window rate limiter
├── model/
│   └── user.model.js        # Mongoose user schema
├── routes/
│   └── user.routes.js       # API routes
├── .env                     # Environment variables
└── index.js                 # Entry point
```

---

## ⚙️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| Redis (RedisLabs) | Token blacklist + Rate limiting |
| JWT | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Cookie handling |

---

## 🔄 Authentication Flow

```
SIGNUP:
POST /signup → hash password → save to MongoDB → 201 ✅

LOGIN:
POST /login → verify password → generate Access + Refresh Token
           → store in httpOnly cookies → 200 ✅

PROFILE (Protected):
GET /profile → authMiddleware → verify token → check blacklist
            → fetch user from DB → return profile ✅

LOGOUT:
POST /logout → authMiddleware → blacklist token in Redis
            → set expiry → clear cookies → 200 ✅

TOKEN REFRESH (Automatic):
Access token expired → authMiddleware catches TokenExpiredError
                    → verify refresh token → generate new access token
                    → set new cookie → continue request ✅
```

---

## 🛡️ Rate Limiting — Sliding Window Algorithm

Every IP is allowed **5 requests per 60 seconds**.

```
How it works:
1. Remove all requests older than 60s from Redis Sorted Set
2. Count remaining requests in current window
3. If count >= 5 → 429 Too Many Requests
4. Else → add current request timestamp → allow ✅

Why Sliding Window?
Fixed window allows burst at window edges (e.g. 10 req in 2 seconds).
Sliding window always checks the LAST 60 seconds — no edge case exploitation.
```

---

## 📡 API Endpoints

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| POST | `/signup` | ❌ | Register new user |
| POST | `/login` | ❌ | Login and get tokens |
| GET | `/profile` | ✅ | Get logged in user profile |
| POST | `/logout` | ✅ | Logout and invalidate token |

---

## 📥 Request & Response Examples

### POST `/signup`
```json
// Request Body
{
  "name": "Nishant",
  "DOB": "2000-01-17",
  "email": "nishant@example.com",
  "password": "secret123"
}

// Response 201
{
  "message": "newUser registered successfully.."
}
```

### POST `/login`
```json
// Request Body
{
  "email": "nishant@example.com",
  "password": "secret123"
}

// Response 200
{
  "message": "Login Successfull..."
}
// Cookies set: accessToken, refreshToken
```

### GET `/profile`
```json
// Response 200
{
  "_id": "...",
  "name": "Nishant",
  "email": "nishant@example.com",
  "DOB": "2000-01-17"
}
```

### POST `/logout`
```json
// Response 200
{
  "message": "logout successfully..."
}
```

---

## 🔴 Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad Request |
| 401 | Unauthorized / Invalid Token |
| 404 | User not found |
| 409 | User already registered |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Internal Server Error |

---

## 🛠️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=5500
URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASS=your_redis_password
```

### 4. Run the server
```bash
# Development
npm run dev

# Production
node index.js
```

---

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `REFRESH_SECRET` | Secret for signing refresh tokens |
| `REDIS_HOST` | Redis server host |
| `REDIS_PORT` | Redis server port |
| `REDIS_PASS` | Redis server password |

---

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "mongoose": "^8.x",
  "redis": "^4.x",
  "jsonwebtoken": "^9.x",
  "bcrypt": "^5.x",
  "cookie-parser": "^1.x",
  "dotenv": "^16.x"
}
```

---

## 👨‍💻 Author

**Nishant** — Built as a backend revision project covering core authentication concepts.
