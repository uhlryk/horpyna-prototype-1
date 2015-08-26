var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.UniqueKey", function() {
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
		testNode = new Core.Node.Transform.UniqueKey(myProcessModel);
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
	it('Powinien zwrócić [{0:"k1"},{0:"k2"},{0:"k3"},{0:"k2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i gdy mapujemy MAP_OBJECT_ARRAY', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("0","k1");
				expect(afterMapping[1]).to.include.property("0","k2");
				expect(afterMapping[2]).to.include.property("0","k3");
				expect(afterMapping[3]).to.include.property("0","k2");
				done();
			});
	});
	it('Powinien zwrócić [{0:"k1"},{0:"k2"}{0:"k3"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i gdy mapujemy MAP_OBJECT', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.include.property("0","k1");
				expect(afterMapping[1]).to.include.property("0","k2");
				expect(afterMapping[2]).to.include.property("0","k3");
				done();
			});
	});
	it('Powinien zwrócić [{key:"k1"},{key:"k2"}{key:"k3"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i gdy mapujemy MAP_OBJECT', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		//UniqueKey przez mapowanie dostaje jeden obiekt z unikalnymi kluczami i wartościami
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		testNode.setKey("key");
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(3);
				expect(afterMapping[0]).to.include.property("key","k1");
				expect(afterMapping[1]).to.include.property("key","k2");
				expect(afterMapping[2]).to.include.property("key","k3");
				done();
			});
	});
});