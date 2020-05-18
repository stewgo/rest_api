const express = require('express');
const exceptionHandler = require('../utils/exceptionHandler');
const ProductService = require('../services/productService');
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
        data: products.map(product => product.toResource())
    };

    if (req.query.include === 'merchants') {
        const users = await userService.getUsersByIds(_.uniq(products.map(product => product.json.merchantId)));

        response.included = users.map(user => user.toResource());
    }

    res.send(response);
}));


router.post('/', exceptionHandler(async (req, res) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    if (!req.user.isMerchant) {
        throw new Error('Not allowed');
    }
    const productService = new ProductService();
    const product = { ...req.body, merchantId: req.user.id };
    const result = await productService.createProduct(product);

    res.send(result.toString());
}));

module.exports = router;