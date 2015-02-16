var HttpError = require('../error').HttpError;

module.exports = function(req, res, next) {
    if(!req.sessions.user) {
        return next(new HttpError(401, 'Вы не авторизированы'));
    }

    next();
};