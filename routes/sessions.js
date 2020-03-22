const express = require('express');
const mariadb = require('mariadb');
const crypto = require('crypto');
const router = express.Router();

const TOKEN_EXPIRY_IN_MINUTES = 30;

router.get('/', async (req, res, next) => {
    const token = crypto.randomBytes(24).toString('base64');
    const expiry = new Date(Date.now() + TOKEN_EXPIRY_IN_MINUTES * 60000).getTime();

    
    res.send(token);
});

module.exports = router;