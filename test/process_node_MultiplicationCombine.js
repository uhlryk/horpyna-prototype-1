var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.MultiplicationCombine", function() {
	var myProcessModel, myNode2, testNode, beforeMapping1, beforeMapping2, afterMapping;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module("process");
		myApp.addModule(myModule);
		var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.GET, "myAction");
		myModule.addAction(myAction);
		myProcessModel = new Core.Node.ProcessModel();
		myAction.setActionHandler(myProcessModel.getActionHandler());
		var myNode1a = new Core.Node.BaseNode(myProcessModel);
		myProcessModel.addChildNode(myNode1a);
		myNode1a.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping1);
			});
		});
		var myNode1b = new Core.Node.BaseNode(myProcessModel);
		myProcessModel.addChildNode(myNode1b);
		myNode1b.setContent(function(processEntryList, request, response, processList) {
			return new Core.Util.Promise(function(resolve){
				resolve(beforeMapping2);
			});
		});

		testNode = new Core.Node.Transform.MultiplicationCombine(myProcessModel);
		myNode1a.addChildNode(testNode);
		myNode1b.addChildNode(testNode);
		testNode.addEntryMapSource(Core.Node.NodeMapper.RESPONSE_NODE_1);
		testNode.addSecondarySource(Core.Node.NodeMapper.RESPONSE_NODE_2);


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
	it('Powinien zwrócić [{k1:"v1",k2:"v2"}] gdy podamy na canal_1 {k1:"v1"} a na canal_2 {k2:"v2"}', function (done) {
		beforeMapping1 = {k1:"v1"};
		beforeMapping2 = {k2:"v2"};
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k2","v2");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1",k3:"v3"},{k1:"v1",k4:"v4"},{k2:"v2",k3:"v3"},{k2:"v2",k4:"v4"}] gdy podamy na canal_1 [{k1:"v1"},{k2:"v2"}] a na canal_2 [{k3:"v3"},{k4:"v4"}]', function (done) {
		beforeMapping1 = [{k1:"v1"},{k2:"v2"}];
		beforeMapping2 = [{k3:"v3"},{k4:"v4"}];
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k3","v3");
				expect(afterMapping[1]).to.include.property("k1","v1");
				expect(afterMapping[1]).to.include.property("k4","v4");
				expect(afterMapping[2]).to.include.property("k2","v2");
				expect(afterMapping[2]).to.include.property("k3","v3");
				expect(afterMapping[3]).to.include.property("k2","v2");
				expect(afterMapping[3]).to.include.property("k4","v4");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1",k3:"v3"},{k2:"v2",k3:"v3"}] gdy podamy na canal_1 [{k1:"v1"},{k2:"v2"}] a na canal_2 {k3:"v3"}', function (done) {
		beforeMapping1 = [{k1:"v1"},{k2:"v2"}];
		beforeMapping2 = {k3:"v3"};
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k3","v3");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("k3","v3");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1",k3:"v3"},{k2:"v2",k3:"v3"}] gdy podamy na canal_1 [{k1:"v1"},{k2:"v2"}] a na canal_2 [{k3:"v3"}]', function (done) {
		beforeMapping1 = [{k1:"v1"},{k2:"v2"}];
		beforeMapping2 = [{k3:"v3"}];
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k3","v3");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("k3","v3");
				done();
			});
	});
	it('Powinien zwrócić [{"0":"v1","1":"v2"},{"0":"v3","1":"v2"}] gdy podamy na canal_1 ["v1","v3"] a na canal_2 "v2"', function (done) {
		beforeMapping1 = ["v1","v3"];
		beforeMapping2 = "v2";
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_VALUE);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0","v1");
				expect(afterMapping[0]).to.include.property("1","v2");
				expect(afterMapping[1]).to.include.property("0","v3");
				expect(afterMapping[1]).to.include.property("1","v2");
				done();
			});
	});
	it('Powinien zwrócić [{"0":"v1","1":"v2"},{"0":"v1","1":"v4"},{"0":"v3","1":"v2"},{"0":"v3","1":"v4"}] gdy podamy na canal_1 ["v1","v3"] a na canal_2 ["v2","v4"]', function (done) {
		beforeMapping1 = ["v1","v3"];
		beforeMapping2 = ["v2","v4"];
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(4);
				expect(afterMapping[0]).to.include.property("0","v1");
				expect(afterMapping[0]).to.include.property("1","v2");
				expect(afterMapping[1]).to.include.property("0","v1");
				expect(afterMapping[1]).to.include.property("1","v4");
				expect(afterMapping[2]).to.include.property("0","v3");
				expect(afterMapping[2]).to.include.property("1","v2");
				expect(afterMapping[3]).to.include.property("0","v3");
				expect(afterMapping[3]).to.include.property("1","v4");
				done();
			});
	});
	it('Powinien zwrócić [{"0":"v1",k1:"v2",k2:"v4",k3:"v5"},{"0":"v3",k1:"v2",k2:"v4",k3:"v5"}] gdy podamy na canal_1 ["v1","v3"] a na canal_2 {k1:"v2",k2:"v4",k3:"v5"}', function (done) {
		beforeMapping1 = ["v1","v3"];
		beforeMapping2 = {k1:"v2",k2:"v4",k3:"v5"};
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0","v1");
				expect(afterMapping[0]).to.include.property("k1","v2");
				expect(afterMapping[0]).to.include.property("k2","v4");
				expect(afterMapping[0]).to.include.property("k3","v5");
				expect(afterMapping[1]).to.include.property("0","v3");
				expect(afterMapping[1]).to.include.property("k1","v2");
				expect(afterMapping[1]).to.include.property("k2","v4");
				expect(afterMapping[1]).to.include.property("k3","v5");
				done();
			});
	});
	it('Powinien zwrócić [{"0":"v1",k1:"v2",k2:"v4","1":"v5"},{"0":"v3",k1:"v2",k2:"v4","1":"v5"}] gdy podamy na canal_1 ["v1","v3"] a na canal_2 {k1:"v2",k2:"v4","0":"v5"}', function (done) {
		beforeMapping1 = ["v1","v3"];
		beforeMapping2 = {k1:"v2",k2:"v4","0":"v5"};
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE_ARRAY);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("0","v1");
				expect(afterMapping[0]).to.include.property("k1","v2");
				expect(afterMapping[0]).to.include.property("k2","v4");
				expect(afterMapping[0]).to.include.property("1","v5");
				expect(afterMapping[1]).to.include.property("0","v3");
				expect(afterMapping[1]).to.include.property("k1","v2");
				expect(afterMapping[1]).to.include.property("k2","v4");
				expect(afterMapping[1]).to.include.property("1","v5");
				done();
			});
	});
	it('Powinien zwrócić [{"0":"v1",k1:"v2",k2:"v4","1":"v5"}] gdy podamy na canal_1 "v1" a na canal_2 {k1:"v2",k2:"v4","0":"v5"}', function (done) {
		beforeMapping1 = "v1";
		beforeMapping2 = {k1:"v2",k2:"v4","0":"v5"};
		testNode.setEntryMapType(Core.Node.NodeMapper.MAP_VALUE);
		testNode.setSecondaryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		myNode2.setEntryMapType(Core.Node.NodeMapper.MAP_OBJECT_ARRAY);
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(1);
				expect(afterMapping[0]).to.include.property("0","v1");
				expect(afterMapping[0]).to.include.property("k1","v2");
				expect(afterMapping[0]).to.include.property("k2","v4");
				expect(afterMapping[0]).to.include.property("1","v5");
				done();
			});
	});
});