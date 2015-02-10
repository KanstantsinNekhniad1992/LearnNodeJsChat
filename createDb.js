var mongoose = require('./libs/mongoose');
var async = require('async');

async.series([
    open,
    createDb,
    requireModels,
    createUser
    ], function(err, results) {
    mongoose.disconnect();
    console.log(arguments);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function createDb(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUser(callback) {
    require('./models/user');

    var users = [
        { username: 'vasya', password: 'supervasya'},
        { username: 'admin', password: 'admin'},
        { username: 'petya', password: '123'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback)
}