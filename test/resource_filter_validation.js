var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;
describe("Testy filtrów i walidacji przy szybkim tworzeniu przez Core.App.Module.Resource", function() {
	var moduleResource;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
		moduleResource = new Core.App.Module.Resource(myApp.root, "res1");
		done();
	});
	it("powinien zwrócić błąd walidacji gdy damy validator rozmiaru i za dużą wartość", function(done){
		moduleResource.addField("model", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6] }], {length:50});
		myApp.init().then(function () {
			request(app).post("/res1/create")
			.send({model: "olekfsasfsa"})
				.end(function (err, res) {
					var formList = res.body.content;
					var form = formList[0];
					expect(form.responseValidatorList).to.include.some.property("field","model");
					done();
				});
		});
	});
	it("powinien zwrócić przefiltrowaną wartość gdy damy filtr", function(done){
		moduleResource.addField("model", [{name:"size", class: Core.Field.FilterStandard.Blacklist,params:["ab"] }]);
		myApp.init().then(function () {
			request(app).post("/res1/create")
			.send({model: "abcdabcd"})
				.end(function (err, res) {
					expect(res.body.content[0]).to.include.property("model","cdcd");
					done();
				});
		});
	});
	it("powinien zwrócić przefiltrowaną wartość gdy damy filtr i walidator który przejdzie na true", function(done){
		moduleResource.addField("model", [
			{name:"size", class: Core.Field.FilterStandard.Blacklist,params:["ab"]},
			{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,10]}
			]);
		myApp.init().then(function () {
			request(app).post("/res1/create")
			.send({model: "abcdabcd"})
				.end(function (err, res) {
					expect(res.body.content[0]).to.include.property("model","cdcd");
					done();
				});
		});
	});
});