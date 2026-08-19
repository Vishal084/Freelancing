require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
<<<<<<< HEAD
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const faqRoutes = require('./routes/faqRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');

=======
const apiRoutes = require("./routes/api")
>>>>>>> aug-03-amar
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
// In development, allow all origins for easy testing.
// In production, restrict to the origins listed in ALLOWED_ORIGINS.
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? (process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [
          'https://your-user-frontend.com',
          'https://your-admin-panel.com',
        ])
  : '*'; // allow all origins during development

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, always allow
    if (!isProduction) {
      return callback(null, true);
    }

    // In production, check against the allowed list
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
// Body Parser
// ========================
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
<<<<<<< HEAD
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
=======
app.use("/api", apiRoutes)

>>>>>>> aug-03-amar

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