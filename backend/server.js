// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const helmet = require('helmet');
// const errorHandler = require('./middleware/errorHandler'); // ✅ added import
// // require('express-async-errors');     

// const authRoutes = require('./routes/authRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const aboutRoutes = require('./routes/aboutRoutes');

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(helmet());
// // ❌ removed early app.use(errorHandler); it was here

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/about', aboutRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'FreelancePro API is running...' });
// });

// // ✅ Central error handler after all routes
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, mobile apps
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error(
            `CORS policy does not allow access from origin: ${origin}`
          ),
          false
        );
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// ========================
// Body Parser
// ========================
app.use(express.json({ limit: '10kb' }));

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

// Auth Routes Rate Limiter
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

// ========================
// Health Check
// ========================
app.get('/', (req, res) => {
  res.json({
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
  console.log(`Server running on port ${PORT}`);
});