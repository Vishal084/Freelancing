require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const apiRoutes = require("./routes/api")
const app = express();

// ========================
// Database Connection
// ========================
connectDB();

// ========================
// Trust proxy (Render uses a reverse proxy)
// ========================
app.set('trust proxy', 1);

// ========================
// Security Middleware
// ========================
app.use(helmet());

// ========================
// CORS Configuration
// ========================
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    // ✅ Get allowed origins from environment variable.
    //    Added 'http://localhost:3000' to default list so your Vite frontend works.
    const allowedOrigins = (
      process.env.ALLOWED_ORIGINS ||
      'http://localhost:3000,http://localhost:5173,http://localhost:5174'
    ).split(',');

    // If wildcard is present, allow all origins (use only for testing)
    if (allowedOrigins.includes('*')) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware (this also handles OPTIONS preflight automatically)
app.use(cors(corsOptions));

// ========================
// Body Parser (with rawBody capture for Razorpay Webhook verification)
// ========================
app.use(
  express.json({
    limit: '10kb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// ========================
// Rate Limiting
// ========================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts. Please try again after 15 minutes.',
});
app.use('/api/auth', authLimiter);

// ========================
// Routes
// ========================
app.use("/api", apiRoutes)

// ========================
// Health Check
// ========================
app.get('/', (req, res) => {
  res.json({ success: true, message: 'FreelancePro API is running...' });
});

// ========================
// Error Handler
// ========================
app.use(errorHandler);

// ========================
// Server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});