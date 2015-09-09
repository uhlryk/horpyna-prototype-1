var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Funkcje Modułu ResourceModule", function() {
	describe("podstawowe ResourceModule", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.ResourceModule("res1");
			myApp.addModule(moduleResource1);
			var resModel = moduleResource1.getDefaultModel();
			var nameCol = new Core.Column.StringColumn("name", 50);
			resModel.addColumn(nameCol);
			var passCol = new Core.Column.StringColumn("pass", 50);
			resModel.addColumn(passCol);
			var createAction = moduleResource1.createAction;
			createAction.addField(new Core.Field.BaseField("name", Core.Field.FieldType.BODY_FIELD));
			createAction.addField(new Core.Field.BaseField("pass", Core.Field.FieldType.BODY_FIELD));
			var updateAction = moduleResource1.updateAction;
			updateAction.addField(new Core.Field.BaseField("name", Core.Field.FieldType.BODY_FIELD));
			updateAction.addField(new Core.Field.BaseField("pass", Core.Field.FieldType.BODY_FIELD));
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 updateform gdy brak elementu,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 detail gdy brak elementu", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
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
					expect(res.body.redirect.status).to.be.equal(302);
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
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
	});
	describe("moduł dodany po zainicjowaniu aplikacji", function () {
		var moduleResource1;
		before(function (done) {
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.ResourceModule("res1");
			myApp.init().then(function () {
				var resModel = moduleResource1.getDefaultModel();
				var nameCol = new Core.Column.StringColumn("name", 50);
				resModel.addColumn(nameCol);
				var passCol = new Core.Column.StringColumn("pass", 50);
				resModel.addColumn(passCol);
				var createAction = moduleResource1.createAction;
				createAction.addField(new Core.Field.BaseField("name", Core.Field.FieldType.BODY_FIELD));
				createAction.addField(new Core.Field.BaseField("pass", Core.Field.FieldType.BODY_FIELD));
				var updateAction = moduleResource1.updateAction;
				updateAction.addField(new Core.Field.BaseField("name", Core.Field.FieldType.BODY_FIELD));
				updateAction.addField(new Core.Field.BaseField("pass", Core.Field.FieldType.BODY_FIELD));
				myApp.addModule(moduleResource1)
				.then(function(){
					done();
				});
			});
		});
		it("kod 200 updateform gdy brak elementu,", function (done) {
			request(app).get("/res1/update/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 detail gdy brak elementu", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
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
					expect(res.body.redirect.status).to.be.equal(302);
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
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
	});
});