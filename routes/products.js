const express = require('express');
const exceptionHandler = require('../utils/exceptionHandler');
const ProductService = require('../services/productService');
const Product = require('../entities/product');
const UserService = require('../services/userService');
const _ = require('underscore');

const router = express.Router();

// Using https://jsonapi.org
/* GET products listing. */
router.get('/', exceptionHandler(async (req, res) => {
    const productService = new ProductService();
    const userService = new UserService();
    const options = {};

    //TODO: this can be improved
    if (req.query.merchantId) {
        options.merchantId = parseInt(req.query.merchantId);
    }
    if (req.query.availableOnly) {
        options.availableOnly = req.query.availableOnly.toLowerCase() === 'true';
    }
    const products = await productService.getProducts(options);
    const response = {
        data: products.map(product => product.serialize())
    };

    if (req.query.include === 'merchant') {
        // Make this more secure, only include certain fields
        const users = await userService.getUsersByIds(_.uniq(products.map(product => product.json.merchantId)));

        response.included = users.map(user => user.serialize());
    }

    res.send(response);
}));


router.post('/', exceptionHandler(async (req, res) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    if (!req.user.json.isMerchant) {
        throw new Error('Not allowed');
    }
    const productService = new ProductService();
    const product = Product.deserialize(req.body);
    const result = await productService.createProduct(product.getJson());

    res.send(result.toString());
}));

module.exports = router;