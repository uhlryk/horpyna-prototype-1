var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8888;

module.exports = function() {
    var app = express();
    app.set('port', port);
    app.use(bodyParser.json());
    return app;
};