var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var myApp;
describe("Testy autoryzacji", function() {
	var moduleAuthorization;
	beforeEach(function (done) {
		myApp = new Core.Application(require("./config/config"));
		var moduleToGoIn = new Core.App.Module.Resource(myApp.root, "goin");
		var moduleWithAuthData = new Core.App.Module.Resource(myApp.root, "authres");
		moduleWithAuthData.addField("name", []);
		moduleWithAuthData.addField("password", [{name:"sha1", class: Core.Field.FilterStandard.HashSha,params:["testsalt"]}],{length:100});
		moduleAuthorization = new Core.App.Module.Authorization(myApp.root, "auth");
		var localAuthorizationStrategy = new Core.App.Module.AuthorizationExtension.LocalStrategy(moduleAuthorization);
		localAuthorizationStrategy.setModel(moduleWithAuthData.model);
		localAuthorizationStrategy.addField("name", []);
		localAuthorizationStrategy.addField("password", [{name:"sha1", class: Core.Field.FilterStandard.HashSha,params:["testsalt"]}]);
		var setRoleModule = new Core.App.Module.AuthorizationExtension.AddAclRoleOnActionFinish(moduleAuthorization);
		setRoleModule.setTargetAction(moduleWithAuthData.createAction);
		setRoleModule.setRole(["member"]);
		myApp.init()
		.then(function () {
			return moduleAuthorization.allow(["member"], [moduleToGoIn.createFormAction])
		})
		.then(function(){
			return moduleAuthorization.allow(["otherrole"], [moduleToGoIn.listAction]);
		})
		.then(function(){
			done();
		});
	});
	it("powinien zwrócić kod 401 gdy nie podamy tokena a chcemy wejść do akcji autoryzowanej", function(done){

			request(myApp.appServer).get("/goin/create")
				.end(function (err, res) {
					expect(res.status).to.be.equal(401);
					done();
				});
	});
	it("powinien zwrócić kod 200 gdy nie podamy tokena a chcemy wejść do akcji nie autoryzowanej", function(done){
			request(myApp.appServer).get("/authres/list")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
	});
	it("powinien zwrócić kod 401 gdy podamy błędny token a chcemy wejść do akcji autoryzowanej", function(done){
			request(myApp.appServer).get("/goin/create")
			.query({access_token:'123456789'})
				.end(function (err, res) {
					expect(res.status).to.be.equal(401);
					done();
				});
	});
	it("powinien zwrócić kod 422 gdy spróbujemy się zalogować podając błędny login i hasło", function(done){
			request(myApp.appServer).post("/auth/login")
			.send({name:'sfasfafs'})
			.send({password:'123456789'})
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
	});
	it("powinien zwrócić kod 200 i token gdy się zalogujemy podając poprawny login i hasło", function(done){
			request(myApp.appServer).post("/authres/create")
			.send({name:'sfasfafs'})
			.send({password:'123456789'})
			.end(function (err, res) {
				request(myApp.appServer).post("/auth/login")
				.send({name:'sfasfafs'})
				.send({password:'123456789'})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.content[0].token).to.be.length.above(50);
					done();
				});
			});
	});
	it("powinien zwrócić kod 401 gdy podamy poprawny token ale mamy złą rolę a chcemy wejść do akcji autoryzowanej", function(done){
			request(myApp.appServer).post("/authres/create")
			.send({name:'sfasfafs'})
			.send({password:'123456789'})
			.end(function (err, res) {
				request(myApp.appServer).post("/auth/login")
				.send({name:'sfasfafs'})
				.send({password:'123456789'})
				.end(function (err, res) {
					var token = res.body.content[0].token;
					request(myApp.appServer).get("/goin/list")
					.query({access_token:token})
					.end(function (err, res) {
						expect(res.status).to.be.equal(401);
						done();
					});
				});
			});
	});
	it("powinien zwrócić kod 200 gdy podamy poprawny token i mamy poprawną rolę i chcemy wejść do akcji autoryzowanej", function(done){
			request(myApp.appServer).post("/authres/create")
			.send({name:'sfasfafs'})
			.send({password:'123456789'})
			.end(function (err, res) {
				request(myApp.appServer).post("/auth/login")
				.send({name:'sfasfafs'})
				.send({password:'123456789'})
				.end(function (err, res) {
					var token = res.body.content[0].token;
					request(myApp.appServer).get("/goin/create")
					.query({access_token:token})
					.end(function (err, res) {
						expect(res.status).to.be.equal(200);
						done();
					});
				});
			});
	});
});