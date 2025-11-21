const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  //Log error
  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  res.status(statusCode);
  res.json({
    message: err.message,
    // In production, don't send stack trace to client
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
