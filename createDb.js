var User = require('models/user').User;

var user = new User({
    username: 'Tester2',
    password: 'secret'
});

user.save(function(err, user, affected) {
    if(err) throw err;

    User.findOne({username: 'Tester'}, function(err, user) {
        console.log(user);
    });
});