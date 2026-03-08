const express = require('express');
const dotenv = require('dotenv');
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

dotenv.config({ quiet: true });

const app = express();

// Trust proxy if you're behind one (Render / Railway)
app.set('trust proxy', 1);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan(':method :url :status - :response-time ms'));
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:8080'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// Express 5 + express-mongo-sanitize compatibility
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.get('/', (req, res) => {
  res.send('TASK MANAGER API is running.');
});

// Avoid noisy 404s for browser favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorMiddlewares.notFound);
app.use(errorMiddlewares.errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
