const _ = require('underscore');
const express = require('express');
const SignupService = require('../services/signupService');
const exceptionHandler = require('../utils/exceptionHandler');
const router = express.Router();

router.post('/', exceptionHandler(async (req, res) => {
    validateRequestBody(req.body);
    const signupService = new SignupService();

    await signupService.signup(req.body);
        
    res.send();
}));

function validateRequestBody(requestBody) {
    const keys = ['username', 'password', 'name', 'email', 'phoneNumber', 'address'];

    keys.forEach((key) => {
        const value = requestBody[key];

        if (!value) {
            throw new Error(`${key} must be part of the request body.`);
        }
        if (!_.isString(value)) {
            throw new Error(`${key} must be a string,`);
        }
    });
}

module.exports = router;