/**
 * Request Validation Middleware
 * Checks input format and types, returning 400 Bad Request if validation fails.
 */

const ALLOWED_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

/**
 * Validates request body for creating an order (POST /orders)
 */
function validateCreateOrder(req, res, next) {
  const { customerId, items, shippingAddress } = req.body;

  const errors = [];

  // Validate Customer ID
  if (!customerId || typeof customerId !== 'string' || customerId.trim() === '') {
    errors.push('customerId is required and must be a non-empty string');
  }

  // Validate Shipping Address
  if (!shippingAddress) {
    errors.push('shippingAddress is required');
  } else if (typeof shippingAddress === 'object') {
    if (!shippingAddress.city || typeof shippingAddress.city !== 'string' || shippingAddress.city.trim() === '') {
      errors.push('shippingAddress.city is required and must be a non-empty string');
    }
  } else if (typeof shippingAddress !== 'string' || shippingAddress.trim() === '') {
    errors.push('shippingAddress must be a non-empty string or object containing city');
  }

  // Validate Items
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('items is required and must be a non-empty array');
  } else {
    items.forEach((item, index) => {
      if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') {
        errors.push(`items[${index}].productId is required and must be a non-empty string`);
      }
      if (item.quantity === undefined || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors.push(`items[${index}].quantity is required and must be a positive integer`);
      }
      if (item.price === undefined || typeof item.price !== 'number' || item.price < 0) {
        errors.push(`items[${index}].price is required and must be a non-negative number`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

/**
 * Validates request body for updating order status (PUT /orders/:id/status)
 */
function validateUpdateStatus(req, res, next) {
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['status is required and must be a string']
    });
  }

  const normalizedStatus = status.toLowerCase().trim();

  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [`status must be one of: ${ALLOWED_STATUSES.join(', ')}`]
    });
  }

  // Normalize the status to lowercase for consistency
  req.body.status = normalizedStatus;
  next();
}

/**
 * Validates request parameters for getting order details (GET /orders/:id)
 */
function validateOrderIdParam(req, res, next) {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['order id parameter is required']
    });
  }

  next();
}

/**
 * Validates request parameters for getting customer orders (GET /customers/:customerId/orders)
 */
function validateCustomerIdParam(req, res, next) {
  const { customerId } = req.params;

  if (!customerId || customerId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['customerId parameter is required']
    });
  }

  next();
}

module.exports = {
  validateCreateOrder,
  validateUpdateStatus,
  validateOrderIdParam,
  validateCustomerIdParam
};
