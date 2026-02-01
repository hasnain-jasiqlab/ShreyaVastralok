import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Default error structure
  let error = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    errors: err.errors || undefined
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = 'Validation Error';
    error.errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle duplicate key errors
  if (err.code === '23505') {
    error.statusCode = StatusCodes.CONFLICT;
    error.message = 'Duplicate field value entered';
    error.errors = [{
      field: err.detail?.match(/\(([^)]+)\)/g)?.[0]?.replace(/[\(\)]/g, '') || 'unknown',
      message: 'This value already exists'
    }];
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.message = 'Token expired';
  }

  // Log the error
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Send response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export default errorHandler;
