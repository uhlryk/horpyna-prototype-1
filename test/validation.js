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
			myField1.addValidator(new Core.Validator.BaseValidator("val1", false));
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
			myField1.addValidator(new Core.Validator.Standard.ContainsValidator("valtest", "seed"));
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
	describe("Sprawdzenie akcji z walidacją EqualsValidator", function () {
		var myField1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.EqualsValidator("valtest", "dummy"));
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
	describe("Sprawdzenie akcji z walidacją MatchesValidator", function () {
		var myField1;
		beforeEach(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.MatchesValidator("valtest",'a+'));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsAlphaValidator("valtest"));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsAlnumValidator("valtest"));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsNumericValidator("valtest"));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsBooleanValidator("valtest"));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsStringLengthValidator("valtest",5,10));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsDateValidator("valtest"));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsEmailValidator("valtest"));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsFloatValidator("valtest",5,10));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsIntValidator("valtest",5 , 10));
			myAction.addField(myField1);

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
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "act1");
			myModule.addAction(myAction);
			myField1 = new Core.Field("param1", Core.Action.FieldType.BODY_FIELD);
			myField1.addValidator(new Core.Validator.Standard.IsInValidator("valtest", ["ala", "kot"]));
			myAction.addField(myField1);

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