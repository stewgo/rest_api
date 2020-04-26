const express = require('express');
const OrderService = require('../services/orderService');
const UserService = require('../services/userService');
const exceptionHandler = require('../utils/exceptionHandler');

const router = express.Router();

router.post('/', exceptionHandler(async (req, res, next) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    const { productId } = req.body;
    const orderService = new OrderService();
    const order = await orderService.placeOrder(req.user.id, productId);
    res.send(order);
}));

module.exports = router;