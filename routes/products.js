const express = require('express');
const getConnection = require('../utils/getConnection');
const exceptionHandler = require('../utils/exceptionHandler');

const router = express.Router();

async function getProducts() {
    let conn;

    try {
        conn = await getConnection();
        const rows = await conn.query(`
            select p.id as id, p.name as productName, u.name as merchantName, price, availableDate, description
            from products p inner join users u on (p.merchantId = u.id);
        `);

        return rows;
    } catch (err) {
        throw err;
    } finally {
	    if (conn) conn.end();
    }
}

/* GET products listing. */
router.get('/', exceptionHandler(async (req, res, next) => {
    const products = await getProducts();

    res.send(products);
}));

module.exports = router;