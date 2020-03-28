

const authentication = function (req, res, next) {
    // Authorization: Bearer AbCdEf123456
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const token = authorizationHeader.replace(/^[bB]earer\s*/, '');

        req.token = token;
    }
    // req.user = 'hi';

    next();
};

module.exports = authentication;