var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.SortLinks", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping, myAction;
	beforeEach(function (done) {
		myApp = new Core.Application(require("./config/config"));
		app = myApp.appServer;
		var myModule = new Core.Module(myApp.root, "process");
		myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "myAction");
		var p1 = new Core.Field.BaseField(myAction,"p1", Core.Field.FieldType.PARAM_FIELD);
		var p2 = new Core.Field.BaseField(myAction,"p2", Core.Field.FieldType.PARAM_FIELD);
		var q1 = new Core.Field.BaseField(myAction,"o", Core.Field.FieldType.QUERY_FIELD, {optional:true});
		var q2 = new Core.Field.BaseField(myAction,"d", Core.Field.FieldType.QUERY_FIELD, {optional:true});
		var q3 = new Core.Field.BaseField(myAction,"q3", Core.Field.FieldType.QUERY_FIELD, {optional:true});

		myProcessModel = new Core.Node.ProcessModel(myAction);

		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(data) {
			return beforeMapping;
		});
		testNode = new Core.App.Node.SortLinks([myNode1]);

		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
			afterMapping = data.getMappedEntry();
			return null;
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien zwrócić listę linków z beforeMapping i params i query', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k1:"v3",k3:"v4"}];
		testNode.setAction(myAction);
		request(app).get("/process/myAction/1/2")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.include.property("uri","/process/myAction/1/2?o=k1&d=asc");
				expect(afterMapping[0]).to.include.property("name","k1");
				expect(afterMapping[1]).to.include.property("uri","/process/myAction/1/2?o=k2&d=asc");
				expect(afterMapping[1]).to.include.property("name","k2");
				expect(afterMapping[2]).to.include.property("uri","/process/myAction/1/2?o=k3&d=asc");
				expect(afterMapping[2]).to.include.property("name","k3");
				done();
			});
	});
	it('Powinien zwrócić listę linków z beforeMapping i params i query, gdzie mamy dodatkowe query q3 które musi być przepisane do linków', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k1:"v3",k3:"v4"}];
		testNode.setAction(myAction);
		request(app).get("/process/myAction/1/2?q3=test")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.include.property("uri","/process/myAction/1/2?o=k1&d=asc&q3=test");
				expect(afterMapping[0]).to.include.property("name","k1");
				expect(afterMapping[1]).to.include.property("uri","/process/myAction/1/2?o=k2&d=asc&q3=test");
				expect(afterMapping[1]).to.include.property("name","k2");
				expect(afterMapping[2]).to.include.property("uri","/process/myAction/1/2?o=k3&d=asc&q3=test");
				expect(afterMapping[2]).to.include.property("name","k3");
				done();
			});
	});
	it('Powinien zwrócić listę linków gdzie pierwszy ma d=desc gdy w request ?o=k1&d=asc', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k1:"v3",k3:"v4"}];
		testNode.setAction(myAction);
		request(app).get("/process/myAction/1/2?o=k1&d=asc")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.include.property("uri","/process/myAction/1/2?o=k1&d=desc");
				expect(afterMapping[0]).to.include.property("name","k1");
				expect(afterMapping[1]).to.include.property("uri","/process/myAction/1/2?o=k2&d=asc");
				expect(afterMapping[1]).to.include.property("name","k2");
				expect(afterMapping[2]).to.include.property("uri","/process/myAction/1/2?o=k3&d=asc");
				expect(afterMapping[2]).to.include.property("name","k3");
				done();
			});
	});
	it('Powinien zwrócić listę linków gdzie pierwszy ma d=asc gdy w request ?o=k1&d=desc', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k1:"v3",k3:"v4"}];
		testNode.setAction(myAction);
		request(app).get("/process/myAction/1/2?o=k1&d=desc")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.include.property("uri","/process/myAction/1/2?o=k1&d=asc");
				expect(afterMapping[0]).to.include.property("name","k1");
				expect(afterMapping[1]).to.include.property("uri","/process/myAction/1/2?o=k2&d=asc");
				expect(afterMapping[1]).to.include.property("name","k2");
				expect(afterMapping[2]).to.include.property("uri","/process/myAction/1/2?o=k3&d=asc");
				expect(afterMapping[2]).to.include.property("name","k3");
				done();
			});
	});
});