import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import path from 'path';

// Use createRequire for winston (CJS module)
const require = createRequire(import.meta.url);
const winston = require('winston');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

// Vercel and other serverless platforms have a read-only filesystem —
// skip File transports and only log to Console in those environments.
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), logFormat),
  }),
];

const exceptionHandlers = [];

if (!isServerless) {
  try {
    mkdirSync(path.join(process.cwd(), 'logs'), { recursive: true });
  } catch {}
  transports.push(
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') })
  );
  exceptionHandlers.push(
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') })
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: logFormat,
  transports,
  ...(exceptionHandlers.length && { exceptionHandlers }),
  exitOnError: false,
});

export default logger;
