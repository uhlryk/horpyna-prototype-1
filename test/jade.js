var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/lib/index');
var app;
var myApp
/**
 * test gdy aplikacja jest skonfigurowana z jade view engine
 */

describe("sprawdza działanie widoku wygenerowanego przez jade", function(){
	var module1;
	before(function(done){
		app = require('./jade/app')();
		myApp = new Core.Application();
		module1 = new Core.Module("res1");
		myApp.addModule(module1);
		myApp.setViewClass(Core.View.JadeView);
		var action1 = new Core.Action(Core.Action.GET,"action1");
		module1.addAction(action1);
		app.use(myApp.getMiddleware());
		action1.addActionHandler(function(request, response, done){
			console.log("A2");
			response.getView().setTemplate("index");
			response.addValue("title","mój tytuł");
			done();
		});
		myApp.init().then(function() {
			done();
		});
	});
	it("kod 200 z kodem html", function(done){
		request(app).get("/res1/action1")
			.end(function (err, res) {
				console.log(res.text);
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});