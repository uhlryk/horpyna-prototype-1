var express = require('express');
var chai = require("chai");
var morgan = require("morgan");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var myApp;
/**
 * podstawowe testy, czy serwer działa i logowanie
 */
describe("Funkcje podstawowe", function() {
	describe("Aplikacja nie ma dodanych modułów, domyślnie niezainicjowana, ma route '/' z kodem 201 i fallback z 404 ", function () {
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			done();
		});
		it("zwraca kod 201, przy '/'", function (done) {
			myApp.appServer.get('/', function (req, res) {
				res.sendStatus(201);
			});
			myApp.appServer.use(function (req, res, next) {
				res.sendStatus(404);
			});
			request(myApp.appServer).get("/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(201);
					done();
				});
		});
		it("zwraca kod 200 dla '/' z aplikacji jak zainicjowana", function (done) {
			myApp.init().then(function () {
				myApp.appServer.get('/', function (req, res) {
					res.sendStatus(500);
				});
				myApp.appServer.use(function (req, res, next) {
					res.sendStatus(404);
				});
				request(myApp.appServer).get("/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
			});
		});
		it("zwraca kod 403 gdy wywołamy nieistniejący route '/custom' a aplikacja niezainicjowana", function (done) {
			myApp.appServer.get('/', function (req, res) {
				res.sendStatus(201);
			});
			myApp.appServer.use(function (req, res, next) {
				res.sendStatus(403);
			});
			request(myApp.appServer).get("/custom")
				.end(function (err, res) {
					expect(res.status).to.be.equal(403);
					done();
				});
		});
		it("zwraca kod 404 gdy wywołamy nieistniejący route '/custom' a aplikacja zainicjowana (fallbackaplikacji)", function (done) {
			myApp.init();
			myApp.appServer.get('/', function (req, res) {
				res.sendStatus(201);
			});
			myApp.appServer.use(function (req, res, next) {
				res.sendStatus(500);
			});
			request(myApp.appServer).get("/custom")
				.end(function (err, res) {
					expect(res.status).to.be.equal(404);
					done();
				});
		});
	});
	describe("Sprawdza czy nadane nazwy komponentom są poprawne", function () {
		before(function (done) {
			myApp = new Core.Application(require("./config/config"));
			done();
		});
		it("should throw error when module name contain wrong chars 'ą'", function (done) {
			expect(function () {
				new Core.Module(myApp.root, "abcABCą");
			}).to.throw(SyntaxError);
			done();
		});
		it("should throw error when module name contain wrong chars -space", function (done) {
			expect(function () {
				new Core.Module(myApp.root, "abcA BC");
			}).to.throw(SyntaxError);
			done();
		});
		it("should NOT throw error when module name contain  chars a-zA-Z-", function (done) {
			expect(function () {
				new Core.Module(myApp.root, "abcA-BC");
			}).to.not.throw(SyntaxError);
			done();
		});
	});
	describe("Sprawdza czy dodanie parametrów do akcji zmieni ich routy", function () {
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			var myModule = new Core.Module(myApp.root,"mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			var myField1 = new Core.Field.BaseField(myAction, "test", Core.Field.FieldType.PARAM_FIELD);
			var myField2 = new Core.Field.BaseField(myAction, "par2", Core.Field.FieldType.PARAM_FIELD);
			myApp.init();
			done();
		});
		it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function (done) {
			request(myApp.appServer).get("/mod1/act1/999/32")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	describe("Sprawdzenie połączenia do bazy danych", function () {
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			var myModule = new Core.Module(myApp.root, "module1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			var myModel = new Core.Model(myModule, "model1");
			myModel.addColumn(new Core.Column.StringColumn("a1"));
			myModel.addColumn(new Core.Column.TextColumn("a2"));
			myModel.addColumn(new Core.Column.StringColumn("a3", 10, true));
			var col3 = new Core.Column.EnumColumn("a3");
			col3.setList(["kot", "ala", "ma"]);
			myModel.addColumn(col3);
			myModel.addColumn(new Core.Column.JsonColumn("a5"));
			myModel.addColumn(new Core.Column.JsonBColumn("a6"));
			myApp.init().then(function () {
				done();
			});
		});
		it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function (done) {
			request(myApp.appServer).get("/module1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});
