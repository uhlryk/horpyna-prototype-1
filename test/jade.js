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
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});
describe("sprawdza działanie JadeResourceModule", function () {
	var moduleResource1;
	before(function (done) {
		app = require('./jade/app')();
		myApp = new Core.Application();
		myApp.setDbDefaultConnection("mysql", "localhost", 8889, "awsystem", "root", "root");
		moduleResource1 = new Core.JadeResourceModule("res1");
		myApp.addModule(moduleResource1);
		var resModel = moduleResource1.getModel(Core.ResourceModule.RESOURCE_MODEL);
		var nameCol = new Core.Column.StringColumn("name", 50);
		resModel.addColumn(nameCol);
		var passCol = new Core.Column.StringColumn("pass", 50);
		resModel.addColumn(passCol);
		app.use(myApp.getMiddleware());
		myApp.init().then(function () {
			done();
		});
	});
	it("kod 200 create", function (done) {
		request(app).post("/res1/")
			.send({name: "olek"})
			.send({pass: "bolek"})
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("kod 200 list", function (done) {
		request(app).get("/res1/")
			.end(function (err, res) {
				//console.log(res.text);
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("kod 200 detail", function (done) {
		request(app).get("/res1/1")
			.end(function (err, res) {
				console.log(res.text);
				expect(res.status).to.be.equal(200);
				done();
			});
	});

	it("kod 200 edit", function (done) {
		request(app).put("/res1/1")
			.send({name: "ala"})
			.send({pass: "doda"})
			.end(function (err, res) {
				//console.log(res.text);
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("kod 200 delete", function (done) {
		request(app).delete("/res1/1")
			.end(function (err, res) {
				//console.log(res.text);
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});