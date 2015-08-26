var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node response.SendData", function() {
	var myProcessModel, myNode2, myNode1, testNode, beforeMapping, afterMapping, responseNode;
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
		testNode = new Core.Node.Response.SendData(myProcessModel);
		myNode1.addChildNode(testNode);

		myNode2 = new Core.Node.BaseNode(myProcessModel);
		testNode.addChildNode(myNode2);
		myNode2.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				afterMapping = myNode2.getEntryMappedByType(processEntryList, request);
				responseNode = response;
				resolve(null);
			});
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien w response "content" mieć [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i gdy mapujemy MAP_OBJECT_ARRAY', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				var data = responseNode.getData("content");
				expect(data).to.be.length(2);
				expect(data[0]).to.include.property("k1","v1");
				expect(data[0]).to.include.property("k2","v2");
				expect(data[1]).to.include.property("k3","v1");
				expect(data[1]).to.include.property("k2","v2");
				done();
			});
	});
	it('Powinien w response "dummy" mieć [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i gdy mapujemy MAP_OBJECT_ARRAY', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.setResponseKey("dummy");
		request(app).get("/process/myAction")
			.end(function (err, res) {
				var data = responseNode.getData("dummy");
				expect(data).to.be.length(2);
				expect(data[0]).to.include.property("k1","v1");
				expect(data[0]).to.include.property("k2","v2");
				expect(data[1]).to.include.property("k3","v1");
				expect(data[1]).to.include.property("k2","v2");
				done();
			});
	});
	it('Powinien w response "content" mieć {k1:"v1",k2:"v2", k3:"v1"} gdy podamy [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}] i gdy mapujemy MAP_OBJECT', function (done) {
		beforeMapping = [{k1:"v1",k2:"v2"},{k3:"v1",k2:"v2"}];
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				var data = responseNode.getData("content");
				expect(data).to.include.property("k1","v1");
				expect(data).to.include.property("k3","v1");
				expect(data).to.include.property("k2","v2");
				done();
			});
	});
});