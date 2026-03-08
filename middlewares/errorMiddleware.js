const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const isFavicon404 = statusCode === 404 && req.originalUrl === '/favicon.ico';

  if (!isFavicon404) {
    logger.error({
      message: err.message,
      statusCode,
      path: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      stack: statusCode >= 500 ? err.stack : undefined,
    });
  }

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' || statusCode < 500 ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
