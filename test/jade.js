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
describe("Funkcje Modułu JadeResourceModule", function() {
	describe("sprawdza działanie widoku wygenerowanego przez jade", function () {
		var module1;
		before(function (done) {
			app = require('./jade/app')();
			myApp = new Core.Application();
			module1 = new Core.Module("res1");
			myApp.addModule(module1);
			myApp.setViewClass(Core.View.JadeView);
			var action1 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "action1");
			module1.addAction(action1);
			app.use(myApp.getMiddleware());
			action1.addActionHandler(function (request, response, done) {
				response.getView().setTemplate("index");
				response.addValue("title", "mój tytuł");
				done();
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 z kodem html", function (done) {
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
			var createAction = moduleResource1.getAction(Core.SimpleModule.ACTION_CREATE);
			createAction.addBody(new Core.Param("name"));
			createAction.addBody(new Core.Param("pass"));
			var updateAction = moduleResource1.getAction(Core.SimpleModule.ACTION_UPDATE);
			updateAction.addBody(new Core.Param("name"));
			updateAction.addBody(new Core.Param("pass"));
			app.use(myApp.getMiddleware());
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.send({name: "olek"})
				.send({pass: "bolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 list", function (done) {
			request(app).get("/res1/list")
				.end(function (err, res) {
					//console.log(res.text);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 detail", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					console.log(res.text);
					expect(res.status).to.be.equal(200);
					done();
				});
		});

		it("kod 200 edit", function (done) {
			request(app).put("/res1/update/1")
				.send({name: "ala"})
				.send({pass: "doda"})
				.end(function (err, res) {
					//console.log(res.text);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).delete("/res1/delete/1")
				.end(function (err, res) {
					//console.log(res.text);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});