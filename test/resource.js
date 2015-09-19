var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Funkcje Modułu Core.App.Module.Resource", function() {
	describe("podstawowe Core.App.Module.Resource", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.App.Module.Resource(myApp.root, "res1");

			var resModel = moduleResource1.getModel("default");
			var nameCol = new Core.Column.StringColumn("name", 50);
			resModel.addColumn(nameCol);
			var passCol = new Core.Column.StringColumn("pass", 50);
			resModel.addColumn(passCol);
			var createAction = moduleResource1.createAction;
			new Core.Field.BaseField(createAction, "name", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.BaseField(createAction, "pass", Core.Field.FieldType.BODY_FIELD);
			var updateAction = moduleResource1.updateAction;
			new Core.Field.BaseField(updateAction, "name", Core.Field.FieldType.BODY_FIELD);
			new Core.Field.BaseField(updateAction, "pass", Core.Field.FieldType.BODY_FIELD);
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 updateform gdy brak elementu,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 422 detail gdy brak elementu", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("kod 200 createform,", function (done) {
			request(app).get("/res1/create")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.send({name: "olek"})
				.send({pass: "bolek"})
				.end(function (err, res) {
					console.log(res.body);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 list", function (done) {
			request(app).get("/res1/list")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 detail", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 updateform,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});

		it("kod 200 edit", function (done) {
			request(app).post("/res1/update/1")
				.send({name: "ala"})
				.send({pass: "doda"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	describe("moduł dodany po zainicjowaniu aplikacji a więc wywołany później init", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			myApp.init().then(function () {
				moduleResource1 = new Core.App.Module.Resource(myApp.root, "res1");
				var resModel = moduleResource1.getModel("default");
				var nameCol = new Core.Column.StringColumn("name", 50);
				resModel.addColumn(nameCol);
				var passCol = new Core.Column.StringColumn("pass", 50);
				resModel.addColumn(passCol);
				var createAction = moduleResource1.createAction;
				new Core.Field.BaseField(createAction, "name", Core.Field.FieldType.BODY_FIELD);
				new Core.Field.BaseField(createAction, "pass", Core.Field.FieldType.BODY_FIELD);
				var updateAction = moduleResource1.updateAction;
				new Core.Field.BaseField(updateAction, "name", Core.Field.FieldType.BODY_FIELD);
				new Core.Field.BaseField(updateAction, "pass", Core.Field.FieldType.BODY_FIELD);
				moduleResource1.init()
				.then(function(){
					done();
				});
			});
		});
		it("kod 200 updateform gdy brak elementu,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 422 detail gdy brak elementu", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("kod 200 createform,", function (done) {
			request(app).get("/res1/create")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.send({name: "olek"})
				.send({pass: "bolek"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 list", function (done) {
			request(app).get("/res1/list")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 detail", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 updateform,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});

		it("kod 200 edit", function (done) {
			request(app).post("/res1/update/1")
				.send({name: "ala"})
				.send({pass: "doda"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	describe("Skonfigurowany przez metodę skrótową", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.App.Module.Resource(myApp.root, "res1");
			moduleResource1.addField("name", []);
			moduleResource1.addField("pass", []);
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 updateform gdy brak elementu,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 422 detail gdy brak elementu", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("kod 200 createform,", function (done) {
			request(app).get("/res1/create")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.send({name: "olek"})
				.send({pass: "bolek"})
				.end(function (err, res) {
					console.log(res.body);
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 list", function (done) {
			request(app).get("/res1/list")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 detail", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 updateform,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});

		it("kod 200 edit", function (done) {
			request(app).post("/res1/update/1")
				.send({name: "ala"})
				.send({pass: "doda"})
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});