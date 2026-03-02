const express = require('express');
const dotenv = require('dotenv');
// Don't use morgan in production environment
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const errorMiddlewares = require('./middlewares/errorMiddleware');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { connectRedis } = require('./config/redis');

dotenv.config();
connectDB();
connectRedis().catch(console.error);

const app = express();

// Trust proxy if you're behind one (Render / Railway)
app.set('trust proxy', 1);

// Security Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:8080'];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow no origin (postman, curl, server-to-server requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// Make req.query writable again (Express 5 + express-mongo-sanitize compatibility hack)
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ---- Routes ----
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.get('/', (req, res) => {
  res.send('🚀 TASK MANAGER API deployed and running successfully!');
});

// User Routes
app.use('/api/users', userRoutes);
// Task Routes
app.use('/api/tasks', taskRoutes);

// ---- 404 + Error Handling ----
// Error Handling Middlewares
app.use(errorMiddlewares.notFound);
app.use(errorMiddlewares.errorHandler);

app.listen(process.env.PORT, () => {
  logger.info(
    `Server running on http://localhost:${process.env.PORT} in ${
      process.env.NODE_ENV || 'development'
    } mode`
  );
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
