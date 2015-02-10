var express = require('express');
var http = require('http');
var config = require('./config');
var log = require('./libs/log')(module);
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
require('routes')(app);

var app = express();
app.set('port', config.get('port'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//if(app.get('env')=='development') {
//    app.use(express.logger('dev'));
//} else {
//    app.use(express.logger('default'));
//}

app.engine('ejs', require('ejs-locals'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

http.createServer(app).listen(app.get('port'), function() {
    log.info('Express is listening on port '+ config.get('port'));
});