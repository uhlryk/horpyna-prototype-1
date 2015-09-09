var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.ActionLink", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping, testAction1, testAction2;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");
		myModule.addAction(myAction);

		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());

		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(data) {
				return beforeMapping;

		});
		testNode = new Core.Node.Transform.ActionLink([myNode1]);

		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
				afterMapping = data.getMappedEntry();
				return null;
		});
		testAction1 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "testAction1");
		myModule.addAction(testAction1);
		var p1 = new Core.Field.BaseField("p1", Core.Field.FieldType.PARAM_FIELD);
		var p2 = new Core.Field.BaseField("p2", Core.Field.FieldType.PARAM_FIELD);
		testAction1.addField(p1);
		testAction1.addField(p2);
		var q1 = new Core.Field.BaseField("q1", Core.Field.FieldType.QUERY_FIELD);
		var q2 = new Core.Field.BaseField("q2", Core.Field.FieldType.QUERY_FIELD);
		testAction1.addField(q1);
		testAction1.addField(q2);

		testAction2 = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "testAction2");
		var p1 = new Core.Field.BaseField("p1", Core.Field.FieldType.PARAM_FIELD);
		var p3 = new Core.Field.BaseField("p3", Core.Field.FieldType.PARAM_FIELD);
		testAction2.addField(p1);
		testAction2.addField(p3);
		var q1 = new Core.Field.BaseField("q1", Core.Field.FieldType.QUERY_FIELD);
		var q3 = new Core.Field.BaseField("q3", Core.Field.FieldType.QUERY_FIELD);
		testAction2.addField(q1);
		testAction2.addField(q3);

		myModule.addAction(testAction2);
		myApp.init().then(function () {
			done();
		});
	});
	/**
	 * Ponieważ mapowanie dla null zwróci []. A więc Node uzna że brak jest obiektów, a liczba zwróconych linków
	 * to liczba akcji * liczba obiektów lub przy braku obiektów liczba akcji * 1
	 */
	it('Powinien zwrócić [] gdy podamy null i testAction1', function (done) {
		beforeMapping = null;
		testNode.addAction(testAction1);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/0/0");
				expect(afterMapping[0]).to.include.property("name","testAction1");
				done();
			});
	});
	it('Powinien zwrócić [{uri:"/process/testAction1/1/2",name:"dummy"}] gdy podamy {p1:1,p2:2,n:"dummy"} i testAction1 i name from source key "n"', function (done) {
		beforeMapping = {p1:1,p2:2,n:"dummy"};
		testNode.addAction(testAction1);
		testNode.setNameFromEntrySource("n");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2");
				expect(afterMapping[0]).to.include.property("name","dummy");
				done();
			});
	});
	it('Powinien zwrócić listę z dwoma obiektami linków gdy podamy tablicę z dwoma obiektami danych i akcję testAction1', function (done) {
		beforeMapping = [{p1:1,p2:2,q1:3,q2:4,n:"dummy"},{p1:"a",p2:"b",q1:"c",q2:"d",n:"foo"}];
		testNode.addAction(testAction1);
		testNode.setNameFromEntrySource("n");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2?q1=3&q2=4");
				expect(afterMapping[0]).to.include.property("name","dummy");
				expect(afterMapping[1]).to.include.property("uri","/process/testAction1/a/b?q1=c&q2=d");
				expect(afterMapping[1]).to.include.property("name","foo");
				done();
			});
	});
	it('Powinien zwrócić listę z dwoma obiektami linków gdy podamy jeden obiekt danych i dwie akcje testAction1,testAction2', function (done) {
		beforeMapping = {p1:1,p2:2,q1:3,q2:4};
		testNode.addAction(testAction1);
		testNode.addAction(testAction2);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2?q1=3&q2=4");
				expect(afterMapping[0]).to.include.property("name","testAction1");
				expect(afterMapping[1]).to.include.property("uri","/process/testAction2/1/0?q1=3");
				expect(afterMapping[1]).to.include.property("name","testAction2");
				done();
			});
	});
	it('Powinien zwrócić listę z czterema obiektami linków gdy podamy tablicę z dwoma obiektami danych i dwie akcje testAction1,testAction2', function (done) {
		beforeMapping = [{p1:1,p2:2,q1:3,q2:4,n:"dummy"},{p1:"a",p2:"b",q1:"c",q2:"d",n:"foo"}];
		testNode.addAction(testAction1);
		testNode.addAction(testAction2);
		testNode.setNameFromEntrySource("n");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("uri","/process/testAction1/1/2?q1=3&q2=4");
				expect(afterMapping[0]).to.include.property("name","dummy");
				expect(afterMapping[1]).to.include.property("uri","/process/testAction1/a/b?q1=c&q2=d");
				expect(afterMapping[1]).to.include.property("name","foo");
				expect(afterMapping[2]).to.include.property("uri","/process/testAction2/1/0?q1=3");
				expect(afterMapping[2]).to.include.property("name","dummy");
				expect(afterMapping[3]).to.include.property("uri","/process/testAction2/a/0?q1=c");
				expect(afterMapping[3]).to.include.property("name","foo");
				done();
			});
	});
});