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
describe("Funkcje Modułu JadeResourceModule", function() {
	describe("sprawdza działanie widoku wygenerowanego przez jade", function () {
		var module1;
		before(function (done) {
			app = require('./jade/app')();
			myApp = new Core.Application(app);
			module1 = new Core.Module("res1");
			myApp.addModule(module1);
			// myApp.setViewClass(Core.View.JadeView);
			var action1 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "action1");
			module1.addAction(action1);
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
	describe("sprawdza działanie JadeResourceModule", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./jade/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.ResourceModule("res1");
			myApp.addModule(moduleResource1);
			var resModel = moduleResource1.getDefaultModel();
			var nameCol = new Core.Column.StringColumn("name", 50);
			resModel.addColumn(nameCol);
			var passCol = new Core.Column.StringColumn("pass", 50);
			resModel.addColumn(passCol);
			var createAction = moduleResource1.createAction;
			createAction.addField(new Core.Field.BaseField("name", Core.Field.FieldType.BODY_FIELD));
			createAction.addField(new Core.Field.BaseField("pass", Core.Field.FieldType.BODY_FIELD));
			var updateAction = moduleResource1.updateAction;
			updateAction.addField(new Core.Field.BaseField("name", Core.Field.FieldType.BODY_FIELD));
			updateAction.addField(new Core.Field.BaseField("pass", Core.Field.FieldType.BODY_FIELD));
			// app.use(myApp.getMiddleware());
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