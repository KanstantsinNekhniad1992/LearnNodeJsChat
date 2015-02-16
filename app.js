var express = require('express');
var http = require('http');
var config = require('./config');
var log = require('./libs/log')(module);
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var HttpError = require('./error').HttpError;
var router = express.Router();
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('./libs/mongoose');

var app = express();
app.set('port', config.get('port'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
require('./routes')(app);
app.use(require('./middleware/sendHttpError'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//if(app.get('env')=='development') {
//    app.use(express.logger('dev'));
//} else {
//    app.use(express.logger('default'));
//}

app.use(function(err, req, res, next) {
    if(typeof err == 'number') {
        err = new HttpError(err);
    }

    if(err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if(app.get('env') == 'development') {
            console.log(err.message);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

app.engine('ejs', require('ejs-locals'));
app.use(logger('dev'));
app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session: key'),
    cookie: config.get('session:cookie'),
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection,
        db: mongoose.connection.db,
        session: session})
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    var session = req.session;
    session.user =  null;
    if (session.views) {
        session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + session.views + '</p>');
        res.write('<p>expires in: ' + (session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
});
app.use(require('./middleware/loadUser'));
app.use(router);

http.createServer(app).listen(app.get('port'), function() {
    log.info('Express is listening on port '+ config.get('port'));
});