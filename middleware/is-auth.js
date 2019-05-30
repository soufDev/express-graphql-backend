const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const authHeader = request.get('Authorization');
    if (!authHeader) {
        request.isAuth = false
        next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        request.isAuth = false;
        next();
    }
    try {
        decodedToken = jwt.verify(token, 'supersecretkey');
    } catch (err) {
        request.isAuth = false;
        next();
    }
    if (!decodedToken) {
        request.isAuth = false;
        next();
    }
    request.isAuth = true;
    request.userId = decodedToken.userId;
    next();
}