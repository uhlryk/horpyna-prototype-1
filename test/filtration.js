var express = require('express');
var chai = require("chai");
var morgan = require("morgan");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Filtracja", function() {
	describe("Sprawdzenie akcji z filtracją BaseFilter", function () {
		var myField1, finalValue, filter;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myModule.addAction(myAction);
			myField1 = new Core.Field.BaseField("param1", Core.Field.FieldType.BODY_FIELD);
			filter = new Core.Field.BaseFilter("filter1", false);
			myField1.addFilter(filter);
			myAction.addField(myField1);

			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca tą samą wartość ponieważ filtr nie robił na niej operacji'", function (done) {
			request(app).post("/mod1/act1/")
				.send({param1: "olek"})
				.end(function (err, res) {
					console.log("finalValue");
					console.log(finalValue);
					expect(finalValue).to.be.equal("olek");
					done();
				});
		});
		it("zwraca wartość z suffixem 'BBB' bo takie coś robił filtr", function (done) {
			filter.setLogic(function(value){
				return value+"BBB";
			});
			request(app).post("/mod1/act1/")
			.send({param1: "olek"})
				.end(function (err, res) {
					console.log("finalValue");
					console.log(finalValue);
					expect(finalValue).to.be.equal("olekBBB");
					done();
				});
		});
		it("zwraca wwartość pustą ponieważ do filtra nic nie zostało przekazane'", function (done) {
			myField1.optional = true;
			request(app).post("/mod1/act1/")
				.end(function (err, res) {
					console.log("finalValue");
					console.log(finalValue);
					expect(finalValue).to.be.null;
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z dwiema filtracjami BaseFilter", function () {
		var myField1, finalValue, filter1, filter2;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					finalValue = request.getField(Core.Field.FieldType.BODY_FIELD, "param1");
					response.setStatus(200);
				});
			});
			myModule.addAction(myAction);
			myField1 = new Core.Field.BaseField("param1", Core.Field.FieldType.BODY_FIELD);
			myAction.addField(myField1);
			filter1 = new Core.Field.BaseFilter("filter1", false);
			myField1.addFilter(filter1);
			filter2 = new Core.Field.BaseFilter("filter2", false);
			myField1.addFilter(filter2);
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca wartość z sufixem 'BBBAAA' ponieważ działają dwa filtry gdzie pierwszy daje sufix BBB a następny AAA", function (done) {
			filter1.setLogic(function(value){
				return value+"BBB";
			});
			filter2.setLogic(function(value){
				return value+"AAA";
			});
			request(app).post("/mod1/act1/")
			.send({param1: "olek"})
				.end(function (err, res) {
					console.log("finalValue");
					console.log(finalValue);
					expect(finalValue).to.be.equal("olekBBBAAA");
					done();
				});
		});
	});
});