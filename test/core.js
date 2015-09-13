var express = require('express');
var chai = require("chai");
var morgan = require("morgan");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;
/**
 * podstawowe testy, czy serwer działa i logowanie
 */
describe("Funkcje podstawowe", function() {
	describe("Aplikacja nie ma dodanych modułów, domyślnie niezainicjowana, ma route '/' z kodem 201 i fallback z 404 ", function () {
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);

			done();
		});
		it("zwraca kod 201, przy '/'", function (done) {
			app.get('/', function (req, res) {
				res.sendStatus(201);
			});
			app.use(function (req, res, next) {
				res.sendStatus(404);
			});
			request(app).get("/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(201);
					done();
				});
		});
		it("zwraca kod 200 dla '/' z aplikacji jak zainicjowana", function (done) {
			myApp.init().then(function () {
				app.get('/', function (req, res) {
					res.sendStatus(500);
				});
				app.use(function (req, res, next) {
					res.sendStatus(404);
				});
				request(app).get("/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
			});
		});
		it("zwraca kod 403 gdy wywołamy nieistniejący route '/custom' a aplikacja niezainicjowana", function (done) {
			app.get('/', function (req, res) {
				res.sendStatus(201);
			});
			app.use(function (req, res, next) {
				res.sendStatus(403);
			});
			request(app).get("/custom")
				.end(function (err, res) {
					expect(res.status).to.be.equal(403);
					done();
				});
		});
		it("zwraca kod 404 gdy wywołamy nieistniejący route '/custom' a aplikacja zainicjowana (fallbackaplikacji)", function (done) {
			myApp.init();
			app.get('/', function (req, res) {
				res.sendStatus(201);
			});
			app.use(function (req, res, next) {
				res.sendStatus(500);
			});
			request(app).get("/custom")
				.end(function (err, res) {
					expect(res.status).to.be.equal(404);
					done();
				});
		});
	});
	describe("Application is instantioned, but none modules are added to Artwave. Basic app has route '/' and none 404 fallback. Artwave app has route 'test': ", function () {
		beforeEach(function (done) {
			app = require('./core/app')();
			var router = new express.Router();
			myApp = new Core.Application(router);

			myApp.init();
			app.use("/test/", router);
			app.get('/', function (req, res) {
				res.sendStatus(200);
			});
			app.use(function (req, res, next) {
				res.sendStatus(500);
			});
			done();
		});
		it("should return status code 200 when accessing '/test'", function (done) {
			request(app).get("/test")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("should return status code 404 when accessing '/test/someurl'", function (done) {
			request(app).get("/test/test")
				.end(function (err, res) {
					expect(res.status).to.be.equal(404);
					done();
				});
		});
	});
	describe("Check if application checking of right names and route names working correctly", function () {
		before(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);

			done();
		});
		it("should throw error when module name contain wrong chars 'ą'", function (done) {
			expect(function () {
				new Core.Module(myApp, "abcABCą");
			}).to.throw(SyntaxError);
			done();
		});
		it("should throw error when module name contain wrong chars -space", function (done) {
			expect(function () {
				new Core.Module(myApp, "abcA BC");
			}).to.throw(SyntaxError);
			done();
		});
		it("should NOT throw error when module name contain  chars a-zA-Z-", function (done) {
			expect(function () {
				new Core.Module(myApp, "abcA-BC");
			}).to.not.throw(SyntaxError);
			done();
		});
	});
	describe("Add to action params and then check route paths", function () {
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module(myApp.root,"mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			var myField1 = new Core.Field.BaseField(myAction, "test", Core.Field.FieldType.PARAM_FIELD);
			var myField2 = new Core.Field.BaseField(myAction, "par2", Core.Field.FieldType.PARAM_FIELD);

			myApp.init();
			// app.use(myApp.getMiddleware());
			done();
		});
		it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function (done) {
			request(app).get("/mod1/act1/999/32")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	describe("Sprawdzenie połączenia do bazy danych", function () {

		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			var myModule = new Core.Module(myApp.root, "module1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			var myModel = new Core.Model(myModule, "model1");
			myModel.addColumn(new Core.Column.StringColumn("a1"));
			myModel.addColumn(new Core.Column.TextColumn("a2"));
			myModel.addColumn(new Core.Column.StringColumn("a3", 10, true));
			var col3 = new Core.Column.EnumColumn("a3");
			col3.setList(["kot", "ala", "ma"]);
			myModel.addColumn(col3);
			// myModel.addColumn(new Core.Column.HstoreColumn("a4"));
			myModel.addColumn(new Core.Column.JsonColumn("a5"));
			myModel.addColumn(new Core.Column.JsonBColumn("a6"));
			// app.use(myApp.getMiddleware());
			myApp.init().then(function () {
				done();
			});
		});
		it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function (done) {
			request(app).get("/module1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});
