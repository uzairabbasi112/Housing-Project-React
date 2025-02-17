const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body); // Log incoming data

    const { userId, productId, totalAmount, status } = req.body;

    // Validate input
    if (!userId || !productId || !totalAmount) {
      return res.status(400).json({ error: 'All fields (userId, productId, totalAmount) are required' });
    }

    // Create a new order with default or provided status
    const newOrder = new Order({
      userId,
      productId,
      totalAmount,
      status: status || 'Pending', // Default status is 'Pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all orders for the user
    const orders = await Order.find({ userId }).populate('productId');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find().populate('productId');
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId).populate('productId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update the status of an order
router.patch('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status field is required' });
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
