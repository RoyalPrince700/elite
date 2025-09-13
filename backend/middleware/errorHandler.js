// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.log('🔍 [ErrorHandler] Error caught:', err.message);
  console.log('🔍 [ErrorHandler] Request:', req.method, req.originalUrl);
  console.log('🔍 [ErrorHandler] Status code will be:', error.statusCode || 500);

  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('🔍 [ErrorHandler] Full error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Async handler wrapper to catch async errors
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 404 handler
export const notFound = (req, res, next) => {
  console.log('🔍 [NotFound] Route not found:', req.method, req.originalUrl);
  console.log('🔍 [NotFound] All available routes should be logged above');
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
