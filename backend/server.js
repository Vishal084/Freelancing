// require('dotenv').config();
// // require('express-async-errors');

// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const aboutRoutes = require('./routes/aboutRoutes');
// const adminRoutes = require('./routes/adminRoutes');          // ← added
// const blogRoutes = require('./routes/blogRoutes');           // ← added
// const testimonialRoutes = require('./routes/testimonialRoutes');
// const faqRoutes = require('./routes/faqRoutes');

// const app = express();

// // ========================
// // Database Connection
// // ========================
// connectDB();

// // ========================
// // Security Middleware
// // ========================
// app.use(helmet());

// // ========================
// // CORS Configuration
// // ========================
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(',')
//   : ['http://localhost:5173', 'http://localhost:5174'];   // ← added admin panel origin

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (!allowedOrigins.includes(origin)) {
//         return callback(
//           new Error(`CORS policy does not allow access from origin: ${origin}`),
//           false
//         );
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );

// // ========================
// // Body Parser
// // ========================
// app.use(express.json({ limit: '10kb' }));

// // ========================
// // Rate Limiting
// // ========================
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use(globalLimiter);

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20,
//   message: 'Too many login attempts. Please try again after 15 minutes.',
// });
// app.use('/api/auth', authLimiter);

// // ========================
// // Routes
// // ========================
// app.use('/api/auth', authRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/about', aboutRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/blogs', blogRoutes);               // ← public blog route
// app.use('/api/testimonials', testimonialRoutes);
// app.use('/api/faqs', faqRoutes);

// // ========================
// // Health Check
// // ========================
// app.get('/', (req, res) => {
//   res.json({ success: true, message: 'FreelancePro API is running...' });
// });

// // ========================
// // Error Handler
// // ========================
// app.use(errorHandler);

// // ========================
// // Server
// // ========================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





require('dotenv').config();
// require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
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

const app = express();

// ========================
// Database Connection
// ========================
connectDB();

// ========================
// Security Middleware
// ========================
app.use(helmet());

// ========================
// CORS Configuration
// ========================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
    ];

console.log('Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming Origin:', origin);

    // Allow Postman, mobile apps, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('Blocked Origin:', origin);

    return callback(
      new Error(`CORS policy does not allow access from origin: ${origin}`)
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options(/.*/, cors(corsOptions));

// ========================
// Body Parser
// ========================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

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

// ========================
// Health Check
// ========================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FreelancePro API is running...',
  });
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
  console.log(`🚀 Server running on port ${PORT}`);
});