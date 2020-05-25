const express = require('express');
const OrderService = require('../services/orderService');
const UserService = require('../services/userService');
const ProductService = require('../services/productService');
const exceptionHandler = require('../utils/exceptionHandler');
const router = express.Router();

router.post('/', exceptionHandler(async (req, res, next) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    const { productId } = req.body;
    const orderService = new OrderService();
    const order = await orderService.addOrder(req.user.get('id'), productId);
    res.status(201);
    res.send(order.serialize());
}));

router.get('/:id', exceptionHandler(async (req, res, next) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    const id = parseInt(req.params.id);
    const include = req.query.include && req.query.include.split(',');
    const orderService = new OrderService();
    const order = await orderService.getOrder(id);

    const result = {
        data: order.serialize()
    };
    
    if (include) {
        result.included = [];
        let product;
        const productService = new ProductService();

        if (include.includes('product') || (include.includes('product.merchant'))) {
            const products = await productService.getProducts({ productId: order.get('productId')});

            product = products[0];
        }
        if (include.includes('product')) {
            result.included.push(product.serialize());
        }
        if (include.includes('product.merchant')) {
            const userService = new UserService();
            const users = await userService.getUsersByIds([product.get('merchantId')]);

            result.included.push(users[0].serialize());
        }
    }

    res.send(result);
}));

module.exports = router;