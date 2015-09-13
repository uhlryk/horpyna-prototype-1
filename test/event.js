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
describe("Eventy", function() {
	describe("sprawdza działanie subskrypcji na event Action.OnBegin", function () {
		var moduleParent1, moduleParent2, moduleChild1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			moduleParent1 = new Core.Module(myApp.root, "modu1");
			moduleChild1 = new Core.Module(moduleParent1, "child1");
			var action1 = new Core.Action.BaseAction(moduleChild1, Core.Action.BaseAction.GET, "act1");
			moduleParent2 = new Core.Module(myApp.root, "modu2");
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
	describe("sprawdza działanie eventów z użyciem Nodów", function () {
		var moduleParent1, moduleParent2, moduleChild1, myNode1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			moduleParent1 = new Core.Module(myApp.root, "modu1");
			moduleChild1 = new Core.Module(moduleParent1, "child1");
			var action1 = new Core.Action.BaseAction(moduleChild1, Core.Action.BaseAction.GET, "act1");
			moduleParent2 = new Core.Module(myApp.root, "modu2");
			var event1 = new Core.Event.Action.OnBegin();
			var processModel =new Core.Node.ProcessModel(event1);
			myNode1 = new Core.Node.BaseNode([processModel]);
			moduleChild1.subscribe(event1);
			done();
		});
		it("kod 400 blokada 'on', nasłuch lokalny", function (done) {
			myNode1.setContent(function(data) {
				data.getActionResponse().setStatus(400);
				data.getActionResponse().allow =false;
			});
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(400);
						done();
					});
			});
		});
		it("kod 200 blokada 'off', nasłuch lokalny", function (done) {
			myNode1.setContent(function(data) {
				data.getActionResponse().allow =true;
			});
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(200);
						done();
					});
			});
		});
		it("kod 400 blokada 'on', nasłuch lokalny od parent module", function (done) {
			myNode1.setContent(function(data) {
				data.getActionResponse().setStatus(400);
				data.getActionResponse().allow =false;
			});
			myApp.init().then(function () {
				request(app).get("/modu1/child1/act1")
					.end(function (err, res) {
						expect(res.status).to.be.equal(400);
						done();
					});
			});
		});
		it("kod 200 blokada 'on' - nie zadziała bo nasłuch lokalny ale od modułu niespokrewnionego", function (done) {
			myNode1.setContent(function(data) {
				data.getActionResponse().allow =false;
			});
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
