const express = require('express');
const Order = require('../models/orderModel');
const { checkAuth } = require('../utils/auth');

const router = express.Router();

// Protected routes (Authentication required)
router.use(checkAuth);

// Only users can create orders, and admins can view all orders
router.post('/', async (req, res, next) => {
    const { products, totalAmount } = req.body;
    const user = req.user._id;

    try {
        const newOrder = new Order({ user, products, totalAmount });
        await newOrder.save();
        res.status(201).json({ response: true, data: newOrder, message: 'Order created successfully' });
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find().populate('user').populate('products.product');
        } else {
            orders = await Order.find({ user: req.user._id }).populate('products.product');
        }
        res.status(200).json({ response: true, data: orders, message: 'Found orders' });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const order = await Order.findById(id).populate('user').populate('products.product');
        if (!order) {
            return res.status(404).json({ response: false, message: 'Order not found' });
        }

        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.status(200).json({ response: true, data: order, message: 'Order found' });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const id = req.params.id;
    const { status } = req.body;

    try {
        const orderUpdated = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!orderUpdated) {
            return res.status(404).json({ response: false, message: 'Order not found' });
        }
        res.status(200).json({ response: true, data: orderUpdated, message: 'Order status updated successfully' });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const id = req.params.id;
    try {
        const orderDeleted = await Order.findByIdAndDelete(id);
        if (!orderDeleted) {
            return res.status(404).json({ response: false, message: 'Order not found' });
        }
        res.status(200).json({ response: true, data: orderDeleted, message: 'Order deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
