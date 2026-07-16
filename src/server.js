/**
 * Order Tracking API - Entry Server
 * Starts the application listener and handles graceful shutdowns.
 */

const app = require('./app');

// Configure port
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Order Tracking API is running on port ${PORT}`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local Address: http://localhost:${PORT}`);
  console.log(`==================================================`);
});

// Handle graceful shutdown signals
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
