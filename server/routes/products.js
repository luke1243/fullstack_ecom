const router = require('express').Router();
const createError = require('http-errors');
const productsModel = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/products/photo/:filename', (req, res, next) => {
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            next(createError(404, 'Image not found'));
        }
    });
});

router.get('/products', (req, res, next) => {
    const { search, category, sort } = req.query;

    let query = {};

    // Search by name or description
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by category
    if (category) {
        query.category = category;
    }

    // Build sort object
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'name_asc') sortOption.name = 1;
    else if (sort === 'name_desc') sortOption.name = -1;

    productsModel.find(query)
        .sort(sortOption)
        .then(products => {
            res.json(products);
        })
        .catch(err => next(createError(500, 'Error fetching products')));
});

// Admin Routes
// Update product
router.put('/products/:id', verifyToken, isAdmin, (req, res, next) => {
    const { name, description, price, stock } = req.body;

    productsModel.findByIdAndUpdate(
        req.params.id,
        { name, description, price, stock, updatedAt: Date.now() },
        { new: true, runValidators: true }
    )
        .then(product => {
            if (!product) {
                return next(createError(404, 'Product not found'));
            }
            res.json(product);
        })
        .catch(err => next(createError(500, err.message || 'Error updating product')));
});

// Delete product
router.delete('/products/:id', verifyToken, isAdmin, (req, res, next) => {
    productsModel.findByIdAndDelete(req.params.id)
        .then(product => {
            if (!product) {
                return next(createError(404, 'Product not found'));
            }
            res.json({ message: 'Product deleted successfully' });
        })
        .catch(err => next(createError(500, 'Error deleting product')));
});

module.exports = router;