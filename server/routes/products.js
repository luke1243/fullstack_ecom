const router = require('express').Router();
const createError = require('http-errors');
const productsModel = require('../models/Product');

router.get('/products', (req, res, next) => {
    productsModel.find()
        .then(products => {
            res.json(products);
        })
        .catch(err => next(createError(500, 'Error fetching products')));
});

router.get('/products/photo/:filename', (req, res, next) => {
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            next(createError(404, 'Image not found'));
        }
    });
});

router.get('/products/:id', (req, res, next) => {
    productsModel.findById(req.params.id)
        .then(product => {
            if (!product) {
                return next(createError(404, 'Product not found'));
            }
            res.json(product);
        })
        .catch(err => next(createError(500, 'Error fetching product')));
});

module.exports = router;