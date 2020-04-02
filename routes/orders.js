const express = require('express');
const OrderService = require('../services/orderService');
const exceptionHandler = require('../utils/exceptionHandler');

const router = express.Router();

router.post('/', exceptionHandler(async (req, res, next) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    const { productId } = req.body;
    const orderService = new OrderService();

    const orderId = await orderService.placeOrder(req.user.id, productId);
    res.send({ orderId });
}));

module.exports = router;