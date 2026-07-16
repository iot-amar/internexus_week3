/**
 * API Routes for Order Tracking
 * Binds validation middleware and controllers to REST endpoints.
 */

const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const validator = require('../middleware/validator');

// 1. Create a new order
router.post(
  '/orders',
  validator.validateCreateOrder,
  orderController.createOrder
);

// 2. Fetch order details by order ID
router.get(
  '/orders/:id',
  validator.validateOrderIdParam,
  orderController.getOrderById
);

// 3. Update the status of an order
router.put(
  '/orders/:id/status',
  validator.validateOrderIdParam,
  validator.validateUpdateStatus,
  orderController.updateOrderStatus
);

// 4. List all orders for a specific customer
router.get(
  '/customers/:customerId/orders',
  validator.validateCustomerIdParam,
  orderController.getOrdersByCustomerId
);

module.exports = router;
