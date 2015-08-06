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
				new Core.SimpleModule("abcABCą");
			}).to.throw(SyntaxError);
			done();
		});
		it("should throw error when module name contain wrong chars -space", function (done) {
			expect(function () {
				new Core.SimpleModule("abcA BC");
			}).to.throw(SyntaxError);
			done();
		});
		it("should NOT throw error when module name contain  chars a-zA-Z-", function (done) {
			expect(function () {
				new Core.SimpleModule("abcA-BC");
			}).to.not.throw(SyntaxError);
			done();
		});
	});
	describe("Application is instantioned, added instance of SimpleModule with name 'simple'. Basic app has route '/' and none 404 fallback. Artwave app has route 'test'. Actions named std ", function () {
		beforeEach(function (done) {
			app = require('./core/app')();
			var router= new express.Router();
			myApp = new Core.Application(router);
			app.use(require('morgan')("combined",{stream: myApp.logger.getStream() }));
			var simpleModule = new Core.SimpleModule("simple");
			myApp.addModule(simpleModule);
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
		it("should return status code 200 when accessing '/test/simple/list';  'index' is SimpleModule default controller route", function (done) {
			request(app).get("/test/simple/list")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	describe("Sprawdzamy zachowanie gdy podane do aplikacji parametry są błędne", function () {

	});
	// describe("Sprawdzamy zachowanie gdy jedna z akcji jest domyślna", function () {
	// 	beforeEach(function (done) {
	// 		app = require('./core/app')();
	// 		var router = new express.Router();
	// 		myApp = new Core.Application(router);
	// 		app.use(require('morgan')("combined",{stream: myApp.getLogger().getStream() }));
	// 		var module = new Core.Module("simple");
	// 		myApp.addModule(module);
	// 		var action1 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "action1");
	// 		module.addAction(action1);
	// 		var action2 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "action2");
	// 		module.addAction(action2, true);
	// 		myApp.init();
	// 		app.use("/test", router);
	// 		app.get('/', function (req, res) {
	// 			res.sendStatus(200);
	// 		});
	// 		app.use(function (req, res, next) {
	// 			res.sendStatus(500);
	// 		});
	// 		done();
	// 	});
	// 	it("zwraca 200 przy wejściu na poprawny adres '/test/simple/action1'", function (done) {
	// 		request(app).get("/test/simple/action1")
	// 			.end(function (err, res) {
	// 				expect(res.status).to.be.equal(200);
	// 				done();
	// 			});
	// 	});
	// 	it("zwraca 200 przy wejściu na adres modułu '/test/simple/', czyli z akcji domyślnej", function (done) {
	// 		request(app).get("/test/simple/")
	// 			.end(function (err, res) {
	// 				expect(res.status).to.be.equal(200);
	// 				done();
	// 			});
	// 	});
	// });
	describe("Check if application protect from multiple use of Component single instance", function () {
		var moduleParent1, moduleParent2;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			moduleParent1 = new Core.SimpleModule("simple1");
			moduleParent2 = new Core.SimpleModule("simple2");
			done();
		});
		it("should throw error when child module is added to both moduleParent1 and moduleParent2", function (done) {
			var moduleChild = new Core.SimpleModule("simple3");
			moduleParent1.addModule(moduleChild);
			expect(function () {
				moduleParent2.addModule(moduleChild);
			}).to.throw(SyntaxError);
			done();
		});
	});
	describe("Add to action params and then check route paths", function () {

		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			var myField1 = new Core.Field("test", Core.Action.FieldType.PARAM_FIELD);
			var myField2 = new Core.Field("par2", Core.Action.FieldType.PARAM_FIELD);
			myAction.addField(myField1);
			myAction.addField(myField2);

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
			var myModule = new Core.Module("module1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			var myModel = new Core.Model("model1");
			myModel.addColumn(new Core.Column.StringColumn("a1"));
			myModel.addColumn(new Core.Column.TextColumn("a2"));
			myModel.addColumn(new Core.Column.StringColumn("a3", 10, true));
			var col3 = new Core.Column.EnumColumn("a3");
			col3.setList(["kot", "ala", "ma"]);
			myModel.addColumn(col3);
			// myModel.addColumn(new Core.Column.HstoreColumn("a4"));
			myModel.addColumn(new Core.Column.JsonColumn("a5"));
			myModel.addColumn(new Core.Column.JsonBColumn("a6"));
			myModule.addModel(myModel);
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
	describe("sprawdza działanie subskrypcji na event Action.OnBegin", function () {
		var moduleParent1, moduleParent2, moduleChild1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			moduleParent1 = new Core.Module("modu1");
			myApp.addModule(moduleParent1);
			moduleChild1 = new Core.Module("child1");
			moduleParent1.addModule(moduleChild1);
			var action1 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			moduleChild1.addAction(action1);
			moduleParent2 = new Core.Module("modu2");
			myApp.addModule(moduleParent2);
			// app.use(myApp.getMiddleware());
			done();
		});
		it("kod 400 blokada 'on', nasłuch lokalny", function (done) {
			var event1 = new Core.Event.Action.OnBegin();
			event1.addCallback(function (request, response, done) {
				response.setStatus(400);
				response.allow =false;
				done();
			});
			moduleChild1.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(400);
						done();
					});
			});
		});
		it("kod 200 blokada 'off', nasłuch lokalny", function (done) {
			var event1 = new Core.Event.Action.OnBegin();
			event1.addCallback(function (request, response, done) {
				response.allow =true;
				done();
			});
			moduleChild1.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(200);
						done();
					});
			});
		});
		it("kod 400 blokada 'on', nasłuch lokalny od parent module", function (done) {
			var event1 = new Core.Event.Action.OnBegin();
			event1.addCallback(function (request, response, done) {
				response.setStatus(400);
				response.allow =false;
				done();
			});
			moduleParent1.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(400);
						done();
					});
			});
		});
		it("kod 200 blokada 'on' - nie zadziała bo nasłuch lokalny ale od modułu niespokrewnionego", function (done) {
			var event1 = new Core.Event.Action.OnBegin();
			event1.addCallback(function(request, response, done) {
				response.allow =false;
				done();
			});
			moduleParent2.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(200);
						done();
					});
			});
		});
		it("kod 400 blokada 'on', nasłuch publiczny od modułu niespokrewnionego", function (done) {
			var event1 = new Core.Event.Action.OnBegin(true);
			event1.addCallback(function (request, response, done) {
				response.setStatus(400);
				response.allow =false;
				done();
			});
			moduleParent2.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(400);
						done();
					});
			});
		});
		it("kod 200 blokada 'on' - nie zadziała bo nasłuch oczekuje podtypu 'dummy' którego event nie ma", function (done) {
			var event1 = new Core.Event.Action.OnBegin();
			event1.setSubtype("dummy");
			event1.addCallback(function (request, response, done) {
				response.allow =false;
				done();
			});
			moduleParent1.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(200);
						done();
					});
			});
		});
		it("kod 400 blokada 'on' - nasłuch publiczny, emiter path '/act1'", function (done) {
			var event1 = new Core.Event.Action.OnBegin(true);
			event1.setEmiterRegexp(/act1/);
			event1.addCallback(function (request, response, done) {
				response.setStatus(400);
				response.allow =false;
				done();
			});
			moduleParent2.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(400);
						done();
					});
			});
		});
		it("kod 200 blokada 'on' - nasłuch publiczny, emiter path '/dummy' -nie ma takiej ścieżki", function (done) {
			var event1 = new Core.Event.Action.OnBegin(true);
			event1.setEmiterRegexp(/dummy/);
			event1.addCallback(function (request, response, done) {
				response.allow =false;
				done();
			});
			moduleParent2.subscribe(event1);
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(200);
						done();
					});
			});
		});
	});
});
