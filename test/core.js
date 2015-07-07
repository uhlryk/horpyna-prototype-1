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
		app.use(myApp.run());
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
		app.use("/test/",myApp.run());
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
		app.use("/test/",myApp.run());
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
		module.addAction(action2);
		action2.setDefault(true);
		app.use("/test/",myApp.run());
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
		app.use(myApp.run());
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
		myModel.addColumn(new Core.Model.Column("test"));
		myModule.addModel(myModel);
		app.use(myApp.run());
		done();
	});
	it("should return status code 200 when accessing '/mod1/act1/999/32' where 999 is param ':test' and 32 is 'par2'", function(done){
		request(app).get("/module1/act1")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				done();
			});
	});
});