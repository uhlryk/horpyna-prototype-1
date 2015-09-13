var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;
/**
 * test gdy aplikacja jest skonfigurowana z jade view engine
 */
describe("Funkcje Modułu JadeCore.App.Module.Resource", function() {
	describe("sprawdza działanie widoku wygenerowanego przez jade", function () {
		var module1;
		before(function (done) {
			app = require('./jade/app')();
			myApp = new Core.Application(app);
			module1 = new Core.Module(myApp.root, "res1");
			var action1 = new Core.Action.BaseAction(module1, Core.Action.BaseAction.GET, "action1");
			action1.setActionHandler(function (request, response) {
				return Core.Util.Promise.resolve()
				.then(function(){
					response.view = "index";
					response.addValue("title", "mój tytuł");
				});
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
	describe("sprawdza działanie JadeCore.App.Module.Resource", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./jade/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.App.Module.Resource(myApp.root, "res1");
			var resModel = moduleResource1.model;
			var nameCol = new Core.Column.StringColumn("name", 50);
			resModel.addColumn(nameCol);
			var passCol = new Core.Column.StringColumn("pass", 50);
			resModel.addColumn(passCol);
			var createAction = moduleResource1.createAction;
			new Core.Field.BaseField(createAction, "name", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.BaseField(createAction, "pass", Core.Field.FieldType.BODY_FIELD);
			var updateAction = moduleResource1.updateAction;
			new Core.Field.BaseField(updateAction, "name", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.BaseField(updateAction, "pass", Core.Field.FieldType.BODY_FIELD);
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 createform,", function (done) {
			request(app).get("/res1/create")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});

		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.send({name: "olek"})
				.send({pass: "bolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 list", function (done) {
			request(app).get("/res1/list")
				.end(function (err, res) {
					// console.log(res.text);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 detail", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					// console.log(res.text);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 updateform,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});

		it("kod 302 edit", function (done) {
			request(app).post("/res1/update/1")
				.send({name: "ala"})
				.send({pass: "doda"})
				.end(function (err, res) {
					// console.log(res.text);
					expect(res.status).to.be.equal(302);
					done();
				});
		});
		it("kod 302 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					// console.log(res.text);
					expect(res.status).to.be.equal(302);
					done();
				});
		});
	});
});