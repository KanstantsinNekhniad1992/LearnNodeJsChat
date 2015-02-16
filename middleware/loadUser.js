var User = require('../models/user').User;

module.exports = function(req, res, next) {
    req.user = req.locals.user = null;
    if(!req.sessions.user) return next();

    User.findById(req.session.user, function(err, user) {
        if(err) return next(err);

        req.user = req.locals.user = user;
        next();
    })
};