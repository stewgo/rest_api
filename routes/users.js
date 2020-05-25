const express = require('express');
const UserService = require('../services/userService');
const exceptionHandler = require('../utils/exceptionHandler');
const _ = require('underscore');
const router = express.Router();

router.get('/:id', exceptionHandler(async (req, res, next) => {
    if (!req.user) {
        throw new Error('Invalid token');
    }
    const userId = parseInt(req.params.id);

    if (userId !== req.user.json.id) {
        throw new Error('Forbidden');
    }

    // Just return the user that comes from the middleware
    // TODO: Improve when we allow users to view info about other users.
    res.send({
        data: req.user.serialize()
    });
}));

router.post('/', exceptionHandler(async (req, res) => {
    validateRequestBody(req.body);
    const userService = new UserService();

    await userService.addUser(req.body);
        
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