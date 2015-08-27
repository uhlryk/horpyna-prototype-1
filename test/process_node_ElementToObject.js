var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.ElementToObject", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");
		myModule.addAction(myAction);
		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());
		myNode1 = new Core.Node.BaseNode(myProcessModel);
		myProcessModel.addChildNode(myNode1);
		myNode1.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping);
			});
		});
		testNode = new Core.Node.Transform.ElementToObject(myProcessModel);
		myNode1.addChildNode(testNode);
		myNode2 = new Core.Node.BaseNode(myProcessModel);
		testNode.addChildNode(myNode2);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				afterMapping = myNode2.getEntryMappedByType(processEntryList, request);
				resolve(null);
			});
		});
		myApp.init().then(function () {
			done();
		});
	});

	it('Powinien zwrócić [] gdy podamy null', function (done) {
		beforeMapping = null;
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(0);
				done();
			});
	});
	it('Powinien zwrócić [{0:"test"}] gdy podamy "test"', function (done) {
		beforeMapping = "test";
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("0","test");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"test"}] gdy podamy "test" i ustawimy klucz "k1"', function (done) {
		beforeMapping = "test";
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
		testNode.setKey("k1");
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("k1","test");
				done();
			});
	});
	it('Powinien zwrócić [{0:{k1:"v1"}}] gdy podamy {k1:"v1"}', function (done) {
		beforeMapping = {k1:"v1"};
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("0");
				expect(afterMapping[0]["0"]).to.include.property("k1","v1");
				done();
			});
	});
	it('Powinien zwrócić [{0:"v1"},{0:"v2"}] gdy podamy ["v1","v2"]', function (done) {
		beforeMapping = ["v1","v2"];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0","v1");
				expect(afterMapping[1]).to.include.property("0","v2");
				done();
			});
	});
	it('Powinien zwrócić [{0:["v1","v2"]},{0:["v3","v4"]}] gdy podamy [["v1","v2"],["v3","v4"]]', function (done) {
		beforeMapping = [["v1","v2"],["v3","v4"]];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0");
				expect(afterMapping[0]["0"]).to.be.length(2);
				expect(afterMapping[0]["0"][0]).to.be.equal("v1");
				expect(afterMapping[0]["0"][1]).to.be.equal("v2");
				expect(afterMapping[1]).to.include.property("0");
				expect(afterMapping[1]["0"]).to.be.length(2);
				expect(afterMapping[1]["0"][0]).to.be.equal("v3");
				expect(afterMapping[1]["0"][1]).to.be.equal("v4");
				done();
			});
	});
	it('Powinien zwrócić [{0:{k1:"v2"}},{0:{k2:"v4"}}] gdy podamy [{k1:"v2"},{k2:"v4"}]', function (done) {
		beforeMapping = [{k1:"v2"},{k2:"v4"}];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				console.log(afterMapping);
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0");
				expect(afterMapping[0]["0"]).to.include.property("k1","v2");
				expect(afterMapping[1]).to.include.property("0");
				expect(afterMapping[1]["0"]).to.include.property("k2","v4");
				done();
			});
	});
});