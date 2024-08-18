const express = require('express');
const Product = require('../models/productModel');
const { checkAuth } = require('../utils/auth');

const router = express.Router();

// Public routes (No authentication required)
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        // setTimeout(() => {
        // }, 1500);
        // console.log(products)
        res.status(200).json({ response: true, data: products, message: 'Found products' });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const foundProduct = await Product.findById(id);
        if (!foundProduct) {
            return res.status(404).json({ response: false, message: 'Product not found' });
        }
        res.status(200).json({ response: true, data: foundProduct, message: 'Product found' });
    } catch (error) {
        next(error);
    }
});

// Protected routes (Authentication required)
router.use(checkAuth);

// Only admins can add, update, or delete products
router.post('/', async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    try {
        const newProduct = new Product({ name, description, price, category, stock, imageUrl });
        await newProduct.save();
        res.status(201).json({ response: true, data: newProduct, message: 'Product created successfully' });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    const id = req.params.id;
    const { name, description, price, category, stock, imageUrl } = req.body;

    try {
        const productUpdated = await Product.findByIdAndUpdate(id, { name, description, price, category, stock, imageUrl }, { new: true });
        if (!productUpdated) {
            return res.status(404).json({ response: false, message: 'Product not found' });
        }
        res.status(200).json({ response: true, data: productUpdated, message: 'Product updated successfully' });
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
        const productDeleted = await Product.findByIdAndDelete(id);
        if (!productDeleted) {
            return res.status(404).json({ response: false, message: 'Product not found' });
        }
        res.status(200).json({ response: true, data: productDeleted, message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
