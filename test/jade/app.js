var express = require('express');

var port = process.env.PORT || 8887;

module.exports = function() {

    var app = express();
    app.set('port', port);
    //app.use(bodyParser.json());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    return app;
};