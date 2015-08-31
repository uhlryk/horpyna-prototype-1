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
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");
		myModule.addAction(myAction);
		var p1 = new Core.Field("p1", Core.Action.FieldType.PARAM_FIELD);
		var p2 = new Core.Field("p2", Core.Action.FieldType.PARAM_FIELD);
		myAction.addField(p1);
		myAction.addField(p2);
		var q1 = new Core.Field("o", Core.Action.FieldType.QUERY_FIELD, {optional:true});
		var q2 = new Core.Field("d", Core.Action.FieldType.QUERY_FIELD, {optional:true});
		var q3 = new Core.Field("q3", Core.Action.FieldType.QUERY_FIELD, {optional:true});
		myAction.addField(q1);
		myAction.addField(q2);
		myAction.addField(q3);

		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());

		myNode1 = new Core.Node.BaseNode([myProcessModel]);
		myNode1.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping);
			});
		});
		testNode = new Core.App.Node.SortLinks([myNode1]);

		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				afterMapping = myNode2.getMappedEntry(processEntryList, request);
				resolve(null);
			});
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