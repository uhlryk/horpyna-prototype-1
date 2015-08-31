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
		var myNode1a = new Core.Node.BaseNode([myProcessModel]);
		myNode1a.setContent(function(data) {
			return beforeMapping1;
		});
		var myNode1b = new Core.Node.BaseNode([myProcessModel]);
		myNode1b.setContent(function(data) {
			return beforeMapping2;
		});
		testNode = new Core.Node.Transform.MultiplicationCombine([myNode1a, myNode1b]);
		testNode.addFirstChannel(Core.Node.NodeMapper.RESPONSE_NODE_1);
		testNode.addSecondChannel(Core.Node.NodeMapper.RESPONSE_NODE_2);
		myNode2 = new Core.Node.BaseNode([testNode]);
		myNode2.setContent(function(data) {
			afterMapping = data.getMappedEntry();
			return null;
		});
		myApp.init().then(function () {
			done();
		});
	});
	it('Powinien zwrócić [{k1:"v1",k2:"v2"}] gdy podamy na canal_1 {k1:"v1"} a na canal_2 {k2:"v2"}', function (done) {
		beforeMapping1 = {k1:"v1"};
		beforeMapping2 = {k2:"v2"};
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
});