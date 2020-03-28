const express = require('express');
const router = express.Router();
const exceptionHandler = require('../utils/exceptionHandler');

router.get('/', exceptionHandler(async (req, res, next) => {
    console.log(req.token);
    res.send('hi');
}));

module.exports = router;