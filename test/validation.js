var express = require('express');
var chai = require("chai");
var morgan = require("morgan");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Walidacja", function() {
	describe("Sprawdzenie akcji z walidacją BaseValidation", function () {
		var myField1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.BaseValidator("val1"));
			myAction.addField(myField1);

			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr obowiązkowy i wysłany w formularzu,'", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "olek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr obowiązkowy i nie wysłany w formularzu,'", function (done) {
			request(app).get("/mod1/act1/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 200 gdy parametr nie obowiązkowy i wysłany w formularzu,'", function (done) {
			myField1.optional = true;
			request(app).get("/mod1/act1/")
				.send({param1: "olek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 200 gdy parametr nie obowiązkowy i nie wysłany w formularzu,'", function (done) {
			myField1.optional = true;
			request(app).get("/mod1/act1/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją ContainsValidation", function () {
		var myField1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.ContainsValidator("valtest", "seed"));
			myAction.addField(myField1);

			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 422 gdy parametr niewysłany'", function (done) {
			request(app).get("/mod1/act1/")
				// .send({param1: "olek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 200 gdy parametr ma dany fragment'", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "olekseedolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie zawiera danego fragmentu'", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "olekolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją EqualsValidation", function () {
		var myField1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.EqualsValidator("valtest", "dummy"));
			myAction.addField(myField1);

			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr jest równy 'dummy'", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "dummy"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie jest równy 'dummy'", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "olekolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
});