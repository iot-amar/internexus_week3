/**
 * Centralized Error Handling Middleware
 * Catches all runtime errors, logs them, and returns a clean JSON response.
 */

function errorHandler(err, req, res, next) {
  console.error(`[Error Handler] ${new Date().toISOString()} - ${err.stack}`);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    // Avoid exposing stack trace in production for security, but allow it in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

/**
 * Handle 404 Route Not Found
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
