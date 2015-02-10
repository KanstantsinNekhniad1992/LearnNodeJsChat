var User = require('./models/user').User;
var HttpError = require('error').HttpError;

module.exports = function(app) {

    app.get('/index', function(req, res, next) {
        res.render('index', {
            body: '<b>Hello</b>'
        });
    });
    app.get('/users', function(req, res, next) {
        User.find({}, function(err, user) {
            if(err) throw err;
            res.json(user);
        });
    });

    app.get('/user/:id', function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            res.json(user);
        });
    });
};


