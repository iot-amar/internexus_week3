/**
 * Express Application Setup
 * Configures global middlewares, routes, and error handling.
 */

const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Disable standard headers that expose tech stack for security
app.disable('x-powered-by');

// Global Middlewares
app.use(express.json({ limit: '10kb' })); // Rate/Payload limit for protection

// Simple logging middleware to track API performance (response times)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Basic CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Root route - Premium Landing
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'High-Performance Order Tracking API',
    version: '1.0.0',
    description: 'Ultra-fast order tracking system powered by Express and optimized ES6 in-memory stores.',
    endpoints: {
      createOrder: { method: 'POST', path: '/orders', body: '{ customerId, items, shippingAddress }' },
      getOrderDetails: { method: 'GET', path: '/orders/:id' },
      updateOrderStatus: { method: 'PUT', path: '/orders/:id/status', body: '{ status }' },
      getCustomerOrders: { method: 'GET', path: '/customers/:customerId/orders' }
    },
    systemTime: new Date().toISOString()
  });
});

// Register Order API Routes
app.use('/', orderRoutes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
