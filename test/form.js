var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy formularzy", function() {
	var moduleResource;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
		moduleResource = new Core.ResourceModule("res1");
		myApp.addModule(moduleResource);
		done();
	});
	it("powinien zwrócić json z formularzem", function(done){
		moduleResource.addField("model", Core.Action.FormInputType.TEXT, [{
			name:"size", class: Core.Validator.Standard.IsStringLengthValidator,params:[3,6]
		}], {length:50});
		moduleResource.addField("marka", Core.Action.FormInputType.TEXT, [{
			name:"size", class: Core.Validator.Standard.IsStringLengthValidator,params:[3,6]
		}], {length:50});
		myApp.init().then(function () {
			request(app).get("/res1/create")
				.end(function (err, res) {
					// console.log(res.text);
					var formList = res.body.content;
					expect(formList).to.be.length(1);
					var form = formList[0];
					expect(form.valid).to.be.true;
					expect(form.fields).to.be.length(4);
					expect(form.fields).to.include.some.property("name","model");
					expect(form.fields).to.include.some.property("name","marka");
					expect(form.fields).to.include.some.property("name","_submit");
					expect(form.fields).to.include.some.property("name","_source");
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	it("powinien zwrócić json z formularzem który ma błąd walidacji", function(done){
		moduleResource.addField("model", Core.Action.FormInputType.TEXT, [{
			name:"size", class: Core.Validator.Standard.IsStringLengthValidator,params:[3,6]
		}], {length:50});
		moduleResource.addField("marka", Core.Action.FormInputType.TEXT, [{
			name:"size", class: Core.Validator.Standard.IsStringLengthValidator,params:[3,6]
		}], {length:50});
		myApp.init().then(function () {
			request(app).post("/res1/create")
				.end(function (err, res) {
					// console.log(res.text);
					var formList = res.body.content;
					expect(formList).to.be.length(1);
					var form = formList[0];
					expect(form.valid).to.be.true;
					expect(form.fields).to.be.length(4);
					expect(form.fields).to.include.some.property("name","model");
					expect(form.fields).to.include.some.property("name","marka");
					expect(form.fields).to.include.some.property("name","_submit");
					expect(form.fields).to.include.some.property("name","_source");
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});