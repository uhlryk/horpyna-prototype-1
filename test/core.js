var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/lib/index');
var app;
var myApp
/**
 * podstawowe testy, czy serwer działa i logowanie
 */
describe("Application is instantioned, but none modules are added to Application. Basic app has route '/' and fallback 404 error: ", function(){
	beforeEach(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();
		app.get('/', function (req, res) {
			res.sendStatus(200);
		});
		app.use(function (req, res, next) {
			res.sendStatus(404);
		});
		done();
	});
	it("should return status code 200 when accessing '/' and Artwave router is not added to app.use", function(done){
		request(app).get("/")
			.end(function(err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("should return status code 200 when accessing '/' and Artwave router is added to app.use", function(done){
		myApp.init();
		app.use(myApp.getMiddleware());
		request(app).get("/")
			.end(function(err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("should return status code 404 when accessing '/custom' and Artwave router is added to app.use", function(done){
		request(app).get("/custom")
			.end(function(err, res) {
				expect(res.status).to.be.equal(404);
				done();
			});
	});
});
describe("Application is instantioned, but none modules are added to Artwave. Basic app has route '/' and none 404 fallback. Artwave app has route 'test': ", function() {
	beforeEach(function (done) {
		app = require('./helpers/app')();
		myApp = new Core.Application();
		myApp.init();
		app.use("/test/",myApp.getMiddleware());
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
describe("Check if application checking of right names and route names working correctly", function(){
	before(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();

		done();
	});
	it("should throw error when module name contain wrong chars 'ą'", function(done){
		expect(function(){
			new Core.SimpleModule("abcABCą")
		}).to.throw(SyntaxError);
		done();
	});
	it("should throw error when module name contain wrong chars -space", function(done){
		expect(function(){
			new Core.SimpleModule("abcA BC")
		}).to.throw(SyntaxError);
		done();
	});
	it("should NOT throw error when module name contain  chars a-zA-Z-", function(done){
		expect(function(){
			new Core.SimpleModule("abcA-BC")
		}).to.not.throw(SyntaxError);
		done();
	});
});
describe("Application is instantioned, added instance of SimpleModule with name 'simple'. Basic app has route '/' and none 404 fallback. Artwave app has route 'test'. Actions named std ", function() {
	beforeEach(function (done) {
		app = require('./helpers/app')();
		myApp = new Core.Application();
		var simpleModule = new Core.SimpleModule("simple");
		myApp.addModule(simpleModule);
		myApp.init();
		app.use("/test/",myApp.getMiddleware());
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
describe("Check actions set as default (default action not return routeName, use parent module routeName only)", function() {
	beforeEach(function (done) {
		app = require('./helpers/app')();
		myApp = new Core.Application();
		var module = new Core.Module("simple");
		myApp.addModule(module);
		var action1 = new Core.Action(Core.Action.GET,"action1");
		module.addAction(action1);
		var action2 = new Core.Action(Core.Action.GET,"action2");
		module.addAction(action2,true);
		myApp.init();
		app.use("/test/",myApp.getMiddleware());
		app.get('/', function (req, res) {
			res.sendStatus(200);
		});
		app.use(function (req, res, next) {
			res.sendStatus(500);
		});
		done();
	});
	it("should return status code 200 when accessing '/test/simple/action1' where 'action1' is action routeName ", function (done) {
		request(app).get("/test/simple/action1")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("should return status code 200 when accessing '/test/simple/', because action is default", function (done) {
		request(app).get("/test/simple/")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});
describe("Check if application protect from multiple use of Component single instance", function(){
	var moduleParent1, moduleParent2;
	beforeEach(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();
		moduleParent1 = new Core.SimpleModule("simple1");
		moduleParent2 = new Core.SimpleModule("simple2");
		done();
	});
	it("should throw error when child module is added to both moduleParent1 and moduleParent2", function(done){
		moduleChild = new Core.SimpleModule("simple3");
		moduleParent1.addModule(moduleChild);
		expect(function(){
			moduleParent2.addModule(moduleChild);
		}).to.throw(SyntaxError);
		done();
	});
});
describe("Add to action params and then check route paths", function(){

	beforeEach(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();
		var myModule = new Core.Module("mod1");
		myApp.addModule(myModule);
		var myAction = new Core.Action(Core.Action.GET, "act1");
		myModule.addAction(myAction);
		var myParam1 = new Core.Param("test");
		var myParam2 = new Core.Param("par2");
		myAction.addParam(myParam1);
		myAction.addParam(myParam2);
		myApp.init();
		app.use(myApp.getMiddleware());
		done();
	});
	it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function(done){
		request(app).get("/mod1/act1/999/32")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});
describe("Check db connection", function(){

	beforeEach(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();
		myApp.setDbDefaultConnection("mysql", "localhost", 8889, "awsystem", "root", "root");
		var myModule = new Core.Module("module1");
		myApp.addModule(myModule);
		var myAction = new Core.Action(Core.Action.GET, "act1");
		myModule.addAction(myAction);
		var myModel = new Core.Model("model1");
		myModel.addColumn(new Core.Column.StringColumn("a1"));
		myModel.addColumn(new Core.Column.TextColumn("a2"));
		myModel.addColumn(new Core.Column.StringColumn("a3",10,true));
		var col3= new Core.Column.EnumColumn("a3");
		col3.setList(["kot","ala","ma"]);
		myModel.addColumn(col3);
		myModule.addModel(myModel);
		app.use(myApp.getMiddleware());
		myApp.init().then(function(){
			done();
		});
	});
	it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function(done){
		request(app).get("/module1/act1")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});
describe("sprawdza działanie subskrypcji na event Action.BeforeStart", function(){
	var moduleParent1, moduleParent2, moduleChild1;
	beforeEach(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();
		moduleParent1 = new Core.Module("modu1");
		myApp.addModule(moduleParent1);
		moduleChild1 = new Core.Module("child1");
		moduleParent1.addModule(moduleChild1);
		var action1 = new Core.Action(Core.Action.GET, "act1");
		moduleChild1.addAction(action1);
		moduleParent2 = new Core.Module("modu2");
		myApp.addModule(moduleParent2);
		app.use(myApp.getMiddleware());
		done();
	});
	it("kod 400 blokada 'on', nasłuch lokalny", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleChild1.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(400);
					done();
				});
		});
	});
	it("kod 200 blokada 'off', nasłuch lokalny", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.addCallback(function(data, done){
			data.allow(true);
			done();
		});
		moduleChild1.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	it("kod 400 blokada 'on', nasłuch lokalny od parent module", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleParent1.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(400);
					done();
				});
		});
	});
	it("kod 200 blokada 'on' - nie zadziała bo nasłuch lokalny ale od modułu niespokrewnionego", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleParent2.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	it("kod 400 blokada 'on', nasłuch publiczny od modułu niespokrewnionego", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.setPublic();
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleParent2.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(400);
					done();
				});
		});
	});
	it("kod 200 blokada 'on' - nie zadziała bo nasłuch oczekuje podtypu 'dummy' którego event nie ma", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.setSubtype("dummy");
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleParent1.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	it("kod 400 blokada 'on' - nasłuch publiczny, emiter path '/act1'", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.setEmiterRegexp(/act1/);
		event1.setPublic();
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleParent2.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(400);
					done();
				});
		});
	});
	it("kod 200 blokada 'on' - nasłuch publiczny, emiter path '/dummy' -nie ma takiej ścieżki", function(done){
		var event1= new Core.Event.Action.BeforeStart.Subscriber();
		event1.setEmiterRegexp(/dummy/);
		event1.setPublic();
		event1.addCallback(function(data, done){
			data.allow(false);
			done();
		});
		moduleParent2.subscribe(event1);
		myApp.init().then(function(){
			request(app).get("/modu1/child1/act1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});
describe("sprawdza działanie ResourceModule", function(){
	var moduleResource1;
	before(function(done){
		app = require('./helpers/app')();
		myApp = new Core.Application();
		myApp.setDbDefaultConnection("mysql", "localhost", 8889, "awsystem", "root", "root");
		moduleResource1 = new Core.ResourceModule("res1");
		myApp.addModule(moduleResource1);
		var resModel = moduleResource1.getModel(Core.ResourceModule.RESOURCE_MODEL);
		var nameCol = new Core.Column.StringColumn("name",50);
		resModel.addColumn(nameCol);
		var passCol = new Core.Column.StringColumn("pass",50);
		resModel.addColumn(passCol);
		app.use(myApp.getMiddleware());
		myApp.init().then(function() {
			done();
		});
	});
	it("kod 200 list", function(done){
		request(app).get("/res1/")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("kod 200 detail", function(done){
		request(app).get("/res1/1")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("kod 200 create", function(done){
		request(app).post("/res1/")
			.send({name : "olek"})
			.send({pass : "bolek"})
		.end(function (err, res) {
			expect(res.status).to.be.equal(200);
			done();
		});
	});
	it("kod 200 edit", function(done){
		request(app).put("/res1/1")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
	it("kod 200 delete", function(done){
		request(app).delete("/res1/1")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});