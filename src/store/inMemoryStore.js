/**
 * High-Performance In-Memory Data Store for Orders
 * Uses ES6 Maps for O(1) complexity lookups.
 * Includes indexes to optimize query times.
 */

class InMemoryStore {
  constructor() {
    // Primary storage: orderId -> Order details
    this.orders = new Map();

    // Index: customerId -> Set of orderIds (prevents scanning all orders for customer lookup)
    this.customerOrders = new Map();

    // Pre-populate with sample data for testing as requested
    this.seedData();
  }

  /**
   * Generates a new order and stores it
   * @param {Object} orderData 
   * @returns {Object} Created order
   */
  createOrder(orderData) {
    const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    
    const newOrder = {
      id: orderId,
      customerId: orderData.customerId,
      items: orderData.items || [],
      totalAmount: this.calculateTotal(orderData.items),
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      createdAt: now,
      updatedAt: now
    };

    // Save to primary map
    this.orders.set(orderId, newOrder);

    // Save to customer index
    if (!this.customerOrders.has(newOrder.customerId)) {
      this.customerOrders.set(newOrder.customerId, new Set());
    }
    this.customerOrders.get(newOrder.customerId).add(orderId);

    return newOrder;
  }

  /**
   * Fetches an order by its ID (O(1) lookup)
   * @param {string} orderId 
   * @returns {Object|null} The order object or null if not found
   */
  getOrderById(orderId) {
    return this.orders.get(orderId) || null;
  }

  /**
   * Updates an order's status
   * @param {string} orderId 
   * @param {string} status 
   * @returns {Object|null} Updated order or null if not found
   */
  updateOrderStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (!order) return null;

    order.status = status.toLowerCase();
    order.updatedAt = new Date().toISOString();
    
    this.orders.set(orderId, order);
    return order;
  }

  /**
   * Fetches all orders for a specific customer (O(K) where K is number of customer's orders)
   * @param {string} customerId 
   * @returns {Array} List of orders
   */
  getOrdersByCustomerId(customerId) {
    const orderIds = this.customerOrders.get(customerId);
    if (!orderIds) return [];

    const customerOrdersList = [];
    for (const orderId of orderIds) {
      const order = this.orders.get(orderId);
      if (order) {
        customerOrdersList.push(order);
      }
    }
    return customerOrdersList;
  }

  /**
   * Helper to calculate the total amount of order items
   * @param {Array} items 
   * @returns {number}
   */
  calculateTotal(items = []) {
    return Number(
      items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    );
  }

  /**
   * Seed some sample orders for testing
   */
  seedData() {
    const sampleOrders = [
      {
        id: 'ORD-10001',
        customerId: 'CUST-8821',
        items: [
          { productId: 'PROD-001', name: 'Wireless Headphones', quantity: 1, price: 2999.00 },
          { productId: 'PROD-002', name: 'USB-C Cable', quantity: 2, price: 499.00 }
        ],
        totalAmount: 3997.00,
        status: 'delivered',
        shippingAddress: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          street: 'Marine Drive'
        },
        createdAt: '2026-07-16T10:30:00Z',
        updatedAt: '2026-07-16T14:20:00Z'
      },
      {
        id: 'ORD-10002',
        customerId: 'CUST-8821',
        items: [
          { productId: 'PROD-003', name: 'Ergonomic Office Chair', quantity: 1, price: 12500.00 }
        ],
        totalAmount: 12500.00,
        status: 'shipped',
        shippingAddress: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          street: 'Marine Drive'
        },
        createdAt: '2026-07-16T18:15:00Z',
        updatedAt: '2026-07-16T19:00:00Z'
      },
      {
        id: 'ORD-10003',
        customerId: 'CUST-4512',
        items: [
          { productId: 'PROD-004', name: 'Mechanical Keyboard', quantity: 1, price: 4500.00 },
          { productId: 'PROD-005', name: 'Gaming Mouse', quantity: 1, price: 2500.00 }
        ],
        totalAmount: 7000.00,
        status: 'processing',
        shippingAddress: {
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          street: 'Indiranagar'
        },
        createdAt: '2026-07-16T21:00:00Z',
        updatedAt: '2026-07-16T21:10:00Z'
      },
      {
        id: 'ORD-10004',
        customerId: 'CUST-7703',
        items: [
          { productId: 'PROD-006', name: 'Smart Watch', quantity: 1, price: 8999.00 }
        ],
        totalAmount: 8999.00,
        status: 'pending',
        shippingAddress: {
          city: 'Patna',
          state: 'Bihar',
          pincode: '800001',
          street: 'Fraser Road'
        },
        createdAt: '2026-07-16T23:45:00Z',
        updatedAt: '2026-07-16T23:45:00Z'
      }
    ];

    for (const order of sampleOrders) {
      this.orders.set(order.id, order);
      if (!this.customerOrders.has(order.customerId)) {
        this.customerOrders.set(order.customerId, new Set());
      }
      this.customerOrders.get(order.customerId).add(order.id);
    }
  }
}

// Export a single instance to act as a singleton database
module.exports = new InMemoryStore();
