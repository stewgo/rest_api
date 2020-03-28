const express = require('express');
const LoginService = require('../services/loginService');
const router = express.Router();
const exceptionHandler = require('../utils/exceptionHandler');

router.post('/', exceptionHandler(async (req, res, next) => {
    const loginService = new LoginService();  
    const { username, password } = req.body;
    const result = await loginService.doLogin(username, password);

    res.send(result);
}));

module.exports = router;