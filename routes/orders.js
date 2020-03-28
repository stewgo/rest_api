const express = require('express');
const OrderService = require('../services/orderService');


const router = express.Router();
const exceptionHandler = require('../utils/exceptionHandler');

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