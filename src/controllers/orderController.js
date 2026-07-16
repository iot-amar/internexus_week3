/**
 * Controller for Order tracking endpoints
 * Maps HTTP requests to In-Memory Data Store operations
 */

const store = require('../store/inMemoryStore');

/**
 * Create a new order
 * POST /orders
 */
function createOrder(req, res, next) {
  try {
    const newOrder = store.createOrder(req.body);
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get order details by ID
 * GET /orders/:id
 */
function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = store.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update the status of an order
 * PUT /orders/:id/status
 */
function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = store.updateOrderStatus(id, status);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all orders for a specific customer
 * GET /customers/:customerId/orders
 */
function getOrdersByCustomerId(req, res, next) {
  try {
    const { customerId } = req.params;
    const orders = store.getOrdersByCustomerId(customerId);

    return res.status(200).json({
      success: true,
      customerId,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrdersByCustomerId
};
