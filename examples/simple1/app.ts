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
var app = express();
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
var myApp = new Core.Application();
myApp.setDbDefaultConnection("mysql", "localhost", 8889, "awsystem", "root", "root");
var moduleResource1 = new Core.JadeResourceModule("res1");
myApp.addModule(moduleResource1);
var resModel = moduleResource1.getModel(Core.ResourceModule.RESOURCE_MODEL);
var nameCol = new Core.Column.StringColumn("name", 50);
resModel.addColumn(nameCol);
var passCol = new Core.Column.StringColumn("pass", 50);
resModel.addColumn(passCol);
app.use(myApp.getMiddleware());
myApp.init().then(function () {
	app.listen(8885, function () {
		console.log('Example app listening');

	});
});
