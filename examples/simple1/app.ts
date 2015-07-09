/// <reference path="../../typings/tsd.d.ts" />

/**
 * Simple example of use only one module with one controller
 * After run server go to url:
 * http://localhost:3000/test/user
 * part 'test' route to module
 * part 'user' route to controller in route
 * each one can be configured
 * then there is second instance on same module named test2
 * go to url:
 * http://localhost:3000/test2/user/std
 *
 * then there is second istance of library myApp2 in route 'some' with same module called test
 * go to url:
 * http://localhost:3000/some/test/user/std
 * long paths results of use library directly, not by npm
 * Warning: this instance (myApp2) must be set before first instance(myApp), because when first instance is run for route '/'
 * then it take care of fallbacks and nothing go to myApp2
 */

import express = require('express');
import bodyParser = require('body-parser');
import Core = require('./../../lib/index');
import MyModule = require('./modules/myModule/module');

var app = express();
app.use(bodyParser.json());
//-----begin-------
//var myApp2 = new Core.Application();
//myApp2.addModule(new MyModule("test3"));
//myApp2.init();
//app.use("/some", myApp2.getMiddleware());
//
//var myApp = new Core.Application();
//myApp.addModule(new MyModule("test"));
//myApp.addModule(new MyModule("test2"));
//myApp.init();
//app.use(myApp.getMiddleware());
//

//------end--------
var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
