var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;
describe("Testy formularzy", function() {
	var moduleResource, moduleAuthorization;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
		moduleResource = new Core.App.Module.Resource(myApp.root, "res1");
		moduleAuthorization = new Core.App.Module.Authorization(myApp.root, "auth1");
		moduleAuthorization.allow(["member"], [moduleResource.createFormAction])
		.then(function(){
			done();
		});
	});
	it("powinien zwrócić kod 401 gdy nie podamy tokena a chcemy wejść do akcji autoryzowanej", function(done){
		myApp.init().then(function () {
			request(app).get("/res1/create")
				.end(function (err, res) {
					expect(res.status).to.be.equal(401);
					done();
				});
		});
	});
	it("powinien zwrócić kod 200 gdy nie podamy tokena a chcemy wejść do akcji nie autoryzowanej", function(done){
		myApp.init().then(function () {
			request(app).get("/res1/list")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	it("powinien zwrócić kod 401 gdy podamy błędny token a chcemy wejść do akcji autoryzowanej", function(done){
		myApp.init().then(function () {
			request(app).get("/res1/create")
			.query({access_token:'123456789'})
				.end(function (err, res) {
					expect(res.status).to.be.equal(401);
					done();
				});
		});
	});
});