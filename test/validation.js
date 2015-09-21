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
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");
			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.BaseValidator(myField1, "val1", false);
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
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.ContainsValidator(myField1, "valtest", "seed");

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
	describe("Sprawdzenie akcji z walidacją EqualsValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.EqualsValidator(myField1, "valtest", "dummy");

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
	describe("Sprawdzenie akcji z walidacją MatchesValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.MatchesValidator(myField1, "valtest",'a+');
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr ma pattern", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "dumaamy"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie spełnia", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "olekolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsAlphaValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsAlphaValidator(myField1, "valtest");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr ma tylko znaki a-zA-Z", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "dummy"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr ma też inne znaki niż a-zA-Z", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "ol3e"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsAlnumValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsAlnumValidator(myField1, "valtest");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr ma tylko znaki a-zA-Z0-9", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "dume4my"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr ma też inne znaki niż a-zA-Z", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "ol^e"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsNumericValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsNumericValidator(myField1, "valtest");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr ma tylko znaki 0-9", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "52323"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr ma też inne znaki niż 0-9", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "o324"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsBooleanValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsBooleanValidator(myField1, "valtest");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr ma string typu bool", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "true"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr ma inny niż bool string", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "ol^e"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsStringLengthValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsStringLengthValidator(myField1, "valtest",5,10);
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr ma string w przedziale 5-10", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "alamakota"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr ma string mniejszy niż 5", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "ala"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 422 gdy parametr ma string większy niż 10", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "alama kota i mruga na płocie"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsDateValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsDateValidator(myField1, "valtest");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr jest datą", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "2015-01-11"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie jest datą", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "ala"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsEmailValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsEmailValidator(myField1, "valtest");
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr jest emailem", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "ala@ma.pl"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie jest poprawnym emailem", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "alamacos"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsFloatValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsFloatValidator(myField1, "valtest",5,10);
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr jest Floatem", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "7.32"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie jest poprawnym floatem", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "33.2s"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 422 gdy parametr jest floatem poniżej przedziału", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: 3.99})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 422 gdy parametr jest floatem powyżej przedziału", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: 13.11})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsIntValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsIntValidator(myField1, "valtest",5 , 10);
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr jest Intem w poprawnym przedziale 5-10", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: 7})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie jest poprawnym Intem", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "33.2"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 422 gdy parametr jest Intem poniżej przedziału", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: 3})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("zwraca 422 gdy parametr jest Intem powyżej przedziału", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: 13})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	describe("Sprawdzenie akcji z walidacją IsInValidator", function () {
		var myField1;
		beforeEach(function (done) {
			myApp = new Core.Application(require("./config/config"));
			app = myApp.appServer;
			var myModule = new Core.Module(myApp.root, "mod1");

			var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "act1");
			myField1 = new Core.Field.BaseField(myAction, "param1", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.ValidatorStandard.IsInValidator(myField1, "valtest", ["ala", "kot"]);
			myAction.setActionHandler(function(request, response, action){
				return Core.Util.Promise.resolve()
				.then(function(){
					if(request.isActionValid()){
						response.setStatus(200);
					}else{
						response.setStatus(422);
					}
				});
			});
			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy parametr jest w tablicy", function (done) {
			request(app).get("/mod1/act1/")
			.send({param1: "ala"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("zwraca 422 gdy parametr nie jest w tablicy", function (done) {
			request(app).get("/mod1/act1/")
				.send({param1: "alaa"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
});