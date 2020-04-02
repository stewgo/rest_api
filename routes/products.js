const express = require('express');
const getConnection = require('../utils/getConnection');
const exceptionHandler = require('../utils/exceptionHandler');
const ProductService = require('../services/productService');

const router = express.Router();

/* GET products listing. */
router.get('/', exceptionHandler(async (req, res) => {
    const productService = new ProductService();
    let products;
    const merchantId = req.query.merchantId;

    if (merchantId) {
        products = await productService.getProductsByMerchantId(merchantId);
    } else {
        products = await productService.getAllProducts();
    }

    res.send(products);
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