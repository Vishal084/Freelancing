require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes aggregator
const apiRoutes = require('./routes/api');

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
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ========================
// CORS Configuration
// ========================
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? (process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [
          'https://your-user-frontend.com',
          'https://your-admin-panel.com',
        ])
  : '*';

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!isProduction) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ========================
// Body Parsers
// ========================
// IMPORTANT: Raw body parser for Razorpay webhook (must come before express.json)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Regular JSON body parser
app.use(express.json({ limit: '10kb' }));

// ========================
// Rate Limiting
// ========================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
// Mount all API routes under /api using the aggregator
app.use('/api', apiRoutes);

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
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});