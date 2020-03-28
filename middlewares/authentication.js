
const UserService = require('../services/userService');
const exceptionHandler = require('../utils/exceptionHandler');

const authentication = exceptionHandler(async (req, res, next) => {
    // Authorization: Bearer AbCdEf123456
    const authorizationHeader = req.headers.authorization;
    
    // Delete it just in case it is somehow set.
    delete req.user;

    if (authorizationHeader) {
        const token = authorizationHeader.replace(/^[bB]earer\s*/, '');
        const userService = new UserService();
        const user = await userService.getUserByToken(token);
        
        if (user) {
            req.user = user;
        }
    }
    next();
});

module.exports = authentication;