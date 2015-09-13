var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;

describe("Testy Node transform.AdditionCombine", function() {
	var myProcessModel, myNode2, testNode, beforeMapping1, beforeMapping2, afterMapping;
	beforeEach(function (done) {
		app = require('./core/app')();
		myApp = new Core.Application(app);
		var myModule = new Core.Module(myApp.root, "process");
		var myAction = new Core.Action.BaseAction(myModule, Core.Action.BaseAction.GET, "myAction");
		myProcessModel = new Core.Node.ProcessModel(myAction);
		var myNode1a = new Core.Node.BaseNode([myProcessModel]);
		myNode1a.setContent(function(data) {
			return beforeMapping1;
		});
		var myNode1b = new Core.Node.BaseNode([myProcessModel]);
		myNode1b.setContent(function(data) {
			return beforeMapping2;
		});
		testNode = new Core.Node.Transform.AdditionCombine([myNode1a,myNode1b]);
		testNode.addFirstChannel(Core.Node.SourceType.RESPONSE_NODE_1);
		testNode.addSecondChannel(Core.Node.SourceType.RESPONSE_NODE_2);
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
	it('Powinien zwrócić [{k1:"v1",k3:"v3"},{k2:"v2",k4:"v4"}] gdy podamy na canal_1 [{k1:"v1"},{k2:"v2"}] a na canal_2 [{k3:"v3"},{k4:"v4"}]', function (done) {
		beforeMapping1 = [{k1:"v1"},{k2:"v2"}];
		beforeMapping2 = [{k3:"v3"},{k4:"v4"}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k3","v3");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.include.property("k4","v4");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1",k3:"v3"},{k2:"v2"}] gdy podamy na canal_1 [{k1:"v1"},{k2:"v2"}] a na canal_2 {k3:"v3"}', function (done) {
		beforeMapping1 = [{k1:"v1"},{k2:"v2"}];
		beforeMapping2 = {k3:"v3"};
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k3","v3");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.not.include.property("k3");
				done();
			});
	});
	it('Powinien zwrócić [{k1:"v1",k3:"v3"},{k2:"v2"}] gdy podamy na canal_1 [{k1:"v1"}] a na canal_2 [{k3:"v3"},{k2:"v2"}]', function (done) {
		beforeMapping1 = {k1:"v1"};
		beforeMapping2 = [{k3:"v3"},{k2:"v2"}];
		request(app).get("/process/myAction")
			.end(function (err, res) {
				expect(afterMapping).to.be.length(2);
				expect(afterMapping[0]).to.include.property("k1","v1");
				expect(afterMapping[0]).to.include.property("k3","v3");
				expect(afterMapping[1]).to.include.property("k2","v2");
				expect(afterMapping[1]).to.not.include.property("k3");
				done();
			});
	});
});