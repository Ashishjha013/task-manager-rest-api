const { createLogger, format, transports } = require('winston');

const timestampFormat = format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' });

const consoleFormat = format.combine(
  timestampFormat,
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  }),
);

const fileFormat = format.combine(timestampFormat, format.errors({ stack: true }), format.json());

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
    new transports.File({ filename: 'logs/combined.log', format: fileFormat }),
  ],
});

module.exports = logger;
